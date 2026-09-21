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

    const problemText = body.text || body.description || body.title || 'Civic issue reported by citizen.';
    const titleText = body.title || problemText.slice(0, 60) + (problemText.length > 60 ? '...' : '');
    const latitude = body.lat || body.latitude || 23.3441;
    const longitude = body.lng || body.longitude || 85.3096;

    let evidenceList: any[] = [];
    if (Array.isArray(body.evidence)) {
      evidenceList = body.evidence;
    } else if (body.mediaUrl) {
      evidenceList = [{ url: body.mediaUrl, type: 'photo', title: 'Citizen Media Evidence' }];
    }

    try {
      const supabase = createServerClient();
      const { error } = await supabase.from('challenges').insert({
        id: challengeId,
        title: titleText,
        domain: body.category || body.domain || 'Water & Sanitation',
        status: 'SIGNAL',
        priority: body.priority || 'HIGH',
        signal_count: 1,
        evidence_count: evidenceList.length,
        confirmation_count: 1,
        affected_area: body.district ? `${body.district} District` : 'Ranchi District',
        lat: latitude,
        lng: longitude,
        problem_statement: problemText,
        affected_population_estimate: 2500,
        required_expertise: ['Water Chemistry', 'Rural Water Infrastructure'],
        is_demo_data: true,
      });

      if (!error) {
        await supabase.from('problem_signals').insert({
          id: signalId,
          challenge_id: challengeId,
          text: problemText,
          lang: body.lang || 'hi',
          lat: latitude,
          lng: longitude,
        });

        if (evidenceList.length > 0) {
          const evidenceRows = evidenceList.map(
            (ev: { url: string; type?: string; title?: string }, idx: number) => ({
              id: `EVD-${Math.floor(1000 + Math.random() * 9000)}-${idx}`,
              challenge_id: challengeId,
              type: normalizeType(typeof ev === 'object' ? ev.type : 'photo'),
              url: typeof ev === 'string' ? ev : ev.url,
              caption: (typeof ev === 'object' ? ev.title : null) || `Citizen media evidence ${idx + 1}`,
              source: 'Citizen Upload',
              submitted_at: now,
            })
          );
          await supabase.from('evidence').insert(evidenceRows);
        }

        return NextResponse.json({ signalId, challengeId, status: 'success' });
      }

      console.warn('DB challenge insert error, falling back to mock:', error);
    } catch (dbErr) {
      console.warn('DB submission fallback to mock store:', dbErr);
    }

    const fallbackRes = await mockSubmit({
      text: problemText,
      title: titleText,
      domain: body.category || body.domain,
      affectedArea: body.address || (body.district ? `${body.district} District` : undefined),
      lang: 'hi',
      lat: latitude,
      lng: longitude,
      evidence: evidenceList,
    });
    return NextResponse.json({ ...fallbackRes, status: 'success', signalId, challengeId });
  } catch (error: any) {
    console.error('API submit error:', error);
    return NextResponse.json({ error: 'Failed to submit report', details: error?.message }, { status: 500 });
  }
}
