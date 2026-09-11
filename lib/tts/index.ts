export async function generateSpeechAudio(text: string): Promise<Response> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not configured');
  }

  const response = await fetch('https://openrouter.ai/api/v1/audio/speech', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://jansetu.gov.in',
      'X-Title': 'JanSetu TTS',
    },
    body: JSON.stringify({
      model: 'fish-audio/s2.1-pro-free:free',
      input: text.slice(0, 500),
    }),
  });

  return response;
}
