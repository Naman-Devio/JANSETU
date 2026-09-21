import { NextRequest, NextResponse } from 'next/server';
import { generateElevenLabsAudio } from '@/lib/elevenlabs';

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();
    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text parameter is required' }, { status: 400 });
    }

    const ttsRes = await generateElevenLabsAudio(text);

    if (!ttsRes.ok) {
      const errText = await ttsRes.text();
      console.warn('ElevenLabs API response error:', ttsRes.status, errText);
      return NextResponse.json({ error: 'ElevenLabs generation failed' }, { status: 502 });
    }

    const audioBuffer = await ttsRes.arrayBuffer();
    return new Response(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('ElevenLabs TTS route error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'ElevenLabs internal error' }, { status: 500 });
  }
}
