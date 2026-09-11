import { NextRequest, NextResponse } from 'next/server';
import { generateSpeechAudio } from '@/lib/tts';

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();
    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const ttsRes = await generateSpeechAudio(text);
    if (!ttsRes.ok) {
      const errText = await ttsRes.text();
      console.warn('OpenRouter TTS response failed:', ttsRes.status, errText);
      return NextResponse.json({ error: 'TTS generation failed' }, { status: 502 });
    }

    const audioBuffer = await ttsRes.arrayBuffer();
    return new Response(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('TTS Route error:', error);
    return NextResponse.json({ error: 'TTS internal error' }, { status: 500 });
  }
}
