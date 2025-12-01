import { NextRequest, NextResponse } from 'next/server';
import { generateChatResponse } from '@/server/chat-agent';
import { saveChatMessage, logEvent } from '@/server/db';
import { rateLimit } from '@/app/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting (5 req/min per IP)
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const rateLimitResult = await rateLimit(ip);
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait a moment.' },
        { status: 429 }
      );
    }
    
    const body = await request.json();
    const { sessionId, message, page, utm, wasProactive, history } = body;
    
    if (!sessionId || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Generate response using chat agent
    const result = await generateChatResponse({
      sessionId,
      message,
      page,
      utm,
      wasProactive,
      history,
    });
    
    // Save messages to database
    await saveChatMessage(sessionId, {
      role: 'user',
      content: message,
      page,
      timestamp: new Date(),
    });
    
    await saveChatMessage(sessionId, {
      role: 'assistant',
      content: result.response,
      page,
      timestamp: new Date(),
    });
    
    // Log analytics event
    await logEvent(sessionId, 'chat_message', {
      wasProactive,
      retrievalUsed: result.retrievalUsed,
      suggestedActions: result.suggestedActions,
    }, page);
    
    return NextResponse.json({
      response: result.response,
      suggestedActions: result.suggestedActions,
    });
  } catch (error: any) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'An error occurred processing your message' },
      { status: 500 }
    );
  }
}
