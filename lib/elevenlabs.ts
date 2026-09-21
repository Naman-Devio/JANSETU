export async function generateElevenLabsAudio(text: string, customVoiceId?: string): Promise<Response> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    throw new Error('ELEVENLABS_API_KEY is not configured');
  }

  // Primary Requested Voice ID: jUjRbhZWoMK4aDciW36V
  // Free Tier Verified Voice ID: EXAVITQu4vr4xnSDxMaL (Rachel/Bella)
  const targetVoice = customVoiceId || 'jUjRbhZWoMK4aDciW36V';
  const fallbackVoice = 'EXAVITQu4vr4xnSDxMaL';

  let response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${targetVoice}`, {
    method: 'POST',
    headers: {
      'xi-api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.8,
      },
    }),
  });

  // If targetVoice was a paid library voice and returned 402, fallback to free voice
  if (response.status === 402 && targetVoice !== fallbackVoice) {
    response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${fallbackVoice}`, {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.8,
        },
      }),
    });
  }

  return response;
}
