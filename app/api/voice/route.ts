import { NextRequest, NextResponse } from 'next/server';
import { transcribeAudio, generateAudioResponse } from '@/server/chat-agent';
import { rateLimit } from '@/app/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const rateLimitResult = await rateLimit(ip, 10, 60); // 10 requests per minute for voice
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }
    
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;
    const action = formData.get('action') as string;
    
    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }
    
    // Convert file to buffer
    const arrayBuffer = await audioFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    if (action === 'transcribe') {
      // Transcribe audio to text
      const transcription = await transcribeAudio(buffer);
      
      return NextResponse.json({
        transcription,
      });
    } else if (action === 'tts') {
      // Generate audio from text
      const text = formData.get('text') as string;
      
      if (!text) {
        return NextResponse.json(
          { error: 'No text provided for TTS' },
          { status: 400 }
        );
      }
      
      const audioBuffer = await generateAudioResponse(text);
      
      return new NextResponse(audioBuffer, {
        headers: {
          'Content-Type': 'audio/mpeg',
          'Content-Length': audioBuffer.length.toString(),
        },
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Voice API error:', error);
    return NextResponse.json(
      { error: 'An error occurred processing audio' },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
