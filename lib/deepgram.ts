export async function transcribeWithDeepgram(audioBuffer: Buffer, contentType = 'audio/webm'): Promise<string> {
  const apiKey = process.env.DEEPGRAM_API_KEY;
  if (!apiKey) {
    throw new Error('DEEPGRAM_API_KEY is not configured');
  }

  // Try Deepgram Nova-2 Multilingual model first for high precision Hindi & English recognition
  let url = 'https://api.deepgram.com/v1/listen?model=nova-2&detect_language=true&smart_format=true&punctuate=true';

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Token ${apiKey}`,
        'Content-Type': contentType,
      },
      body: new Uint8Array(audioBuffer),
    });

    if (response.ok) {
      const data = await response.json();
      const transcript = data.results?.channels?.[0]?.alternatives?.[0]?.transcript || '';
      if (transcript.trim()) return transcript.trim();
    }
  } catch (e) {
    console.warn('Deepgram primary listen failed, trying general model fallback:', e);
  }

  // Fallback to Nova-2 General model
  url = 'https://api.deepgram.com/v1/listen?model=general&smart_format=true';
  const fallbackRes = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Token ${apiKey}`,
      'Content-Type': contentType,
    },
    body: new Uint8Array(audioBuffer),
  });

  if (!fallbackRes.ok) {
    const errText = await fallbackRes.text();
    throw new Error(`Deepgram API error ${fallbackRes.status}: ${errText}`);
  }

  const data = await fallbackRes.json();
  const transcript = data.results?.channels?.[0]?.alternatives?.[0]?.transcript || '';
  return transcript.trim();
}
