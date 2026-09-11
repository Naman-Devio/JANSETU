import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { submitProblemReport as mockSubmit } from '@/lib/mocks';

/** Normalize uploaded type strings to the EvidenceItem union */
function normalizeType(raw?: string): 'photo' | 'video' | 'voice' | 'document' {
  const t = (raw ?? '').toLowerCase();
  if (t === 'image' || t === 'photo') return 'photo';
  if (t === 'video') return 'video';
  if (t === 'audio' || t === 'voice') return 'voice';
  return 'document';
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const signalId = `SIG-${Math.floor(1000 + Math.random() * 9000)}`;
    const challengeId = `JNS-${Math.floor(2000 + Math.random() * 8000)}`;
    const now = new Date().toISOString();

    try {
      const supabase = createServerClient();
      const { error } = await supabase.from('challenges').insert({
        id: challengeId,
        title: body.text.slice(0, 60) + (body.text.length > 60 ? '...' : ''),
        domain: 'Water & Sanitation',
        status: 'SIGNAL',
        priority: 'HIGH',
        signal_count: 1,
        evidence_count: Array.isArray(body.evidence) ? body.evidence.length : 0,
        confirmation_count: 1,
        affected_area: 'Ranchi District',
        lat: body.lat || 23.3441,
        lng: body.lng || 85.3096,
        problem_statement: body.text,
        affected_population_estimate: 2500,
        required_expertise: ['Water Chemistry', 'Rural Water Infrastructure'],
        is_demo_data: true,
      });

      if (!error) {
        await supabase.from('problem_signals').insert({
          id: signalId,
          challenge_id: challengeId,
          text: body.text,
          lang: body.lang || 'en',
          lat: body.lat,
          lng: body.lng,
        });

        if (body.evidence && Array.isArray(body.evidence) && body.evidence.length > 0) {
          const evidenceRows = body.evidence.map(
            (ev: { url: string; type?: string; title?: string }, idx: number) => ({
              id: `EVD-${Math.floor(1000 + Math.random() * 9000)}-${idx}`,
              challenge_id: challengeId,
              type: normalizeType(ev.type),
              url: typeof ev === 'string' ? ev : ev.url,
              caption: ev.title || `Citizen media evidence ${idx + 1}`,
              source: 'Citizen Upload',
              submitted_at: now,
            })
          );
          await supabase.from('evidence').insert(evidenceRows);
        }

        return NextResponse.json({ signalId, challengeId });
      }

      console.warn('DB challenge insert error, falling back to mock:', error);
    } catch (dbErr) {
      console.warn('DB submission fallback to mock store:', dbErr);
    }

    const fallbackRes = await mockSubmit(body);
    return NextResponse.json(fallbackRes);
  } catch (error) {
    console.error('API submit error:', error);
    return NextResponse.json({ error: 'Failed to submit report' }, { status: 500 });
  }
}
