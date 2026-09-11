import { ReportAnalysis } from '@/types';
import { analyzeWithGemini } from './gemini';
import { analyzeWithOpenRouter } from './openrouter';
import { FALLBACK_AI_ANALYSIS } from '@/lib/mocks/data';

/**
 * Multi-Model AI Triage Pipeline:
 * 1. Gemini (Primary)
 * 2. OpenRouter NVIDIA Nemotron (High-tier Open Fallback)
 * 3. Pre-computed stored fallback (Instant resilient offline fallback)
 * Never throws an unhandled error to the UI.
 */
export async function analyzeReport(input: {
  text: string;
  lang?: 'en' | 'hi';
}): Promise<ReportAnalysis> {
  const lang = input.lang || 'en';

  // 1. Try Gemini
  try {
    const geminiRes = await analyzeWithGemini(input.text, lang);
    return geminiRes;
  } catch (errGemini) {
    console.warn('Gemini triage failed, attempting OpenRouter Nemotron fallback:', errGemini);
  }

  // 2. Try OpenRouter NVIDIA Nemotron
  try {
    const openRouterRes = await analyzeWithOpenRouter(input.text, lang);
    return openRouterRes;
  } catch (errOpenRouter) {
    console.warn('OpenRouter Nemotron triage failed, falling back to cached analysis:', errOpenRouter);
  }

  // 3. Fallback to resilient stored analysis
  return {
    ...FALLBACK_AI_ANALYSIS,
    summary: input.text.length > 20 ? input.text.slice(0, 140) + '...' : FALLBACK_AI_ANALYSIS.summary,
    source: 'saved-fallback',
  };
}
