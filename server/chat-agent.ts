import OpenAI from 'openai';
import { searchDocuments } from './db';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const SYSTEM_PROMPT = `You are ShuAI's conversion assistant. You must:
- Immediately introduce ShuAI and offer 3 options: (1) Quick Audit (book 15-min), (2) Send Case Study, (3) Ask a question.
- Qualify in 3 questions maximum: Company size, Primary goal (lead gen/automation/revenue), Timeline to start.
- Always capture email and phone before booking. If user refuses, give a one-page audit offer in chat and ask for permission to email it.
- Use retrieval results (if present) verbatim for case study numbers.
- If user asks pricing, give ranges with exact phrasing: "Packages start at $5,000/mo for full-stack execution; enterprise quotes start at $25,000."
- When user agrees to book, call backend \`POST /api/webhook/ghl/create-lead\` with payload shown below.
- For voice, always prompt for recording consent before recording begins.
- Keep tone direct and outcome-focused. No generic marketing copy.`;

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatContext {
  sessionId: string;
  message: string;
  page?: string;
  utm?: Record<string, string>;
  wasProactive?: boolean;
  history?: ChatMessage[];
}

export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: process.env.OPENAI_EMBEDDINGS_MODEL || 'text-embedding-3-small',
    input: text,
  });
  
  return response.data[0].embedding;
}

export async function generateChatResponse(context: ChatContext) {
  // Get embeddings for the user message
  const embedding = await generateEmbedding(context.message);
  
  // Search for relevant documents
  const relevantDocs = await searchDocuments(embedding, 5);
  
  // Build context from relevant docs
  const retrievalContext = relevantDocs
    .map((doc: any) => `[${doc.title}]\n${doc.body}\nRelevance: ${(doc.similarity * 100).toFixed(1)}%`)
    .join('\n\n---\n\n');
  
  // Build conversation history (last 6 messages)
  const conversationHistory = (context.history || []).slice(-6);
  
  // Build messages for OpenAI
  const messages: ChatMessage[] = [
    {
      role: 'system',
      content: SYSTEM_PROMPT + (retrievalContext ? `\n\n## Retrieval Context:\n${retrievalContext}` : ''),
    },
    ...conversationHistory,
    {
      role: 'user',
      content: context.message,
    },
  ];
  
  // Call OpenAI
  const completion = await openai.chat.completions.create({
    model: process.env.OPENAI_CHAT_MODEL || 'gpt-4o-mini',
    messages: messages as any,
    temperature: 0.7,
    max_tokens: 500,
  });
  
  const response = completion.choices[0].message.content || 'I apologize, but I encountered an error. Please try again.';
  
  // Determine suggested actions based on response content
  const suggestedActions = determineSuggestedActions(response, context.message);
  
  return {
    response,
    suggestedActions,
    retrievalUsed: relevantDocs.length > 0,
  };
}

function determineSuggestedActions(response: string, userMessage: string): string[] {
  const actions: string[] = [];
  
  const lowerResponse = response.toLowerCase();
  const lowerUserMessage = userMessage.toLowerCase();
  
  // Check if booking should be suggested
  if (
    lowerResponse.includes('book') ||
    lowerResponse.includes('schedule') ||
    lowerResponse.includes('calendar') ||
    lowerUserMessage.includes('book') ||
    lowerUserMessage.includes('meeting')
  ) {
    actions.push('book_calendar');
  }
  
  // Check if case study should be sent
  if (
    lowerResponse.includes('case study') ||
    lowerResponse.includes('cs-001') ||
    lowerUserMessage.includes('case study') ||
    lowerUserMessage.includes('example') ||
    lowerUserMessage.includes('proof')
  ) {
    actions.push('send_case_study_cs-001');
  }
  
  // Check if email should be requested
  if (
    lowerResponse.includes('email') ||
    (lowerResponse.includes('contact') && !actions.includes('book_calendar'))
  ) {
    actions.push('request_email');
  }
  
  return actions;
}

export async function transcribeAudio(audioBlob: Buffer): Promise<string> {
  // Using OpenAI Whisper for transcription
  const transcription = await openai.audio.transcriptions.create({
    file: audioBlob as any,
    model: 'whisper-1',
  });
  
  return transcription.text;
}

export async function generateAudioResponse(text: string): Promise<Buffer> {
  // Using OpenAI TTS
  const mp3 = await openai.audio.speech.create({
    model: 'tts-1',
    voice: 'alloy',
    input: text,
  });
  
  const buffer = Buffer.from(await mp3.arrayBuffer());
  return buffer;
}
