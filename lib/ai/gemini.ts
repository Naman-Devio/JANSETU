import { ReportAnalysis } from '@/types';

export async function analyzeWithGemini(text: string, lang: 'en' | 'hi' = 'en'): Promise<ReportAnalysis> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  const prompt = `You are the AI civic triage engine for JanSetu (Government of Jharkhand).
Analyze this citizen report:
"${text}"
Language: ${lang}

Respond with strict JSON only in this exact shape:
{
  "domain": "Water & Sanitation",
  "domainConfidence": 94,
  "issueType": "Groundwater Contamination",
  "summary": "Report summary in English or Hindi",
  "priority": "HIGH",
  "priorityConfidence": 91,
  "suggestedExpertise": ["Water Chemistry", "Hydrogeology", "Community Water Systems"]
}`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      }),
      signal: AbortSignal.timeout(8000),
    }
  );

  if (!response.ok) {
    throw new Error(`Gemini API error ${response.status}`);
  }

  const data = await response.json();
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) throw new Error('No content returned from Gemini');

  const parsed = JSON.parse(rawText);
  return {
    domain: parsed.domain || 'Water & Sanitation',
    domainConfidence: Number(parsed.domainConfidence) || 92,
    issueType: parsed.issueType || 'Civic Infrastructure Disruption',
    summary: parsed.summary || text.slice(0, 120),
    priority: parsed.priority || 'HIGH',
    priorityConfidence: Number(parsed.priorityConfidence) || 88,
    suggestedExpertise: Array.isArray(parsed.suggestedExpertise) ? parsed.suggestedExpertise : ['Civil Engineering', 'Hydrology'],
    source: 'live-ai',
  };
}
