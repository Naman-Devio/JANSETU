import { ReportAnalysis } from '@/types';

export async function analyzeWithOpenRouter(text: string, lang: 'en' | 'hi' = 'en'): Promise<ReportAnalysis> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not configured');
  }

  const prompt = `You are the AI civic triage engine for JanSetu (Government of Jharkhand).
Analyze this citizen report:
"${text}"
Language: ${lang}

Respond with strict JSON only in this exact shape:
{
  "domain": "Water & Sanitation",
  "domainConfidence": 90,
  "issueType": "Groundwater Contamination",
  "summary": "Report summary",
  "priority": "HIGH",
  "priorityConfidence": 87,
  "suggestedExpertise": ["Environmental Engineering", "Community Systems"]
}`;

  const models = [
    'nvidia/nemotron-3-ultra-550b-a55b:free',
    'nvidia/llama-nemotron-rerank-vl-1b-v2:free',
    'meta-llama/llama-3.3-70b-instruct:free',
  ];

  let rawText = '';
  for (const model of models) {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://jansetu.gov.in',
          'X-Title': 'JanSetu Civic Innovation',
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: 'You are a civic innovation triage AI. Always respond with strict JSON.' },
            { role: 'user', content: prompt },
          ],
          response_format: { type: 'json_object' },
        }),
        signal: AbortSignal.timeout(8000),
      });

      if (response.ok) {
        const data = await response.json();
        rawText = data.choices?.[0]?.message?.content || '';
        if (rawText) break;
      }
    } catch {
      // Try next model
    }
  }

  if (!rawText) throw new Error('No content returned from OpenRouter models');

  const parsed = JSON.parse(rawText);
  return {
    domain: parsed.domain || 'Water & Sanitation',
    domainConfidence: Number(parsed.domainConfidence) || 90,
    issueType: parsed.issueType || 'Societal Infrastructure Issue',
    summary: parsed.summary || text.slice(0, 120),
    priority: parsed.priority || 'HIGH',
    priorityConfidence: Number(parsed.priorityConfidence) || 86,
    suggestedExpertise: Array.isArray(parsed.suggestedExpertise) ? parsed.suggestedExpertise : ['Environmental Science', 'Community Engineering'],
    source: 'live-ai',
  };
}
