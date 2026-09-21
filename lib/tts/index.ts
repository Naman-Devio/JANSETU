export async function generateSpeechAudio(text: string): Promise<Response> {
  const cleanText = text
    .replace(/[\n\r\t]/g, ' ')
    .replace(/[*_#`"\\{}]/g, '')
    .trim()
    .slice(0, 350);

  const encoded = encodeURIComponent(cleanText || 'नमस्ते');
  const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encoded}&tl=hi&client=tw-ob`;

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    },
  });

  return response;
}
