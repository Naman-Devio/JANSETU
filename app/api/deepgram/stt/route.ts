import { NextRequest, NextResponse } from 'next/server';
import { transcribeWithDeepgram } from '@/lib/deepgram';

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || 'audio/webm';
    const arrayBuffer = await req.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Filter out short/empty/corrupted audio clips (less than ~1KB)
    if (!buffer || buffer.length < 1000) {
      return NextResponse.json({ transcript: '' });
    }

    const transcript = await transcribeWithDeepgram(buffer, contentType);
    return NextResponse.json({ transcript });
  } catch (error: any) {
    console.warn('Deepgram STT handled gracefully:', error?.message);
    return NextResponse.json({ transcript: '' });
  }
}
