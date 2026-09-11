import { NextRequest, NextResponse } from 'next/server';
import { getChallenge as mockGetChallenge } from '@/lib/mocks';
import { createServerClient } from '@/lib/supabase/server';

/** Normalize any DB type string to the EvidenceItem union */
function normalizeEvidenceType(raw: string): 'photo' | 'video' | 'voice' | 'document' {
  const t = (raw ?? '').toLowerCase();
  if (t === 'image' || t === 'photo') return 'photo';
  if (t === 'video') return 'video';
  if (t === 'audio' || t === 'voice') return 'voice';
  return 'document';
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    try {
      const supabase = createServerClient();
      const { data, error } = await supabase
        .from('challenges')
        .select('*, evidence(*)')
        .eq('id', id)
        .single();

      if (!error && data) {
        return NextResponse.json({
          id: data.id,
          title: data.title,
          domain: data.domain,
          status: data.status,
          priority: data.priority,
          signalCount: data.signal_count,
          evidenceCount: data.evidence_count,
          confirmationCount: data.confirmation_count,
          affectedArea: data.affected_area,
          lat: data.lat,
          lng: data.lng,
          problemStatement: data.problem_statement,
          affectedPopulationEstimate: data.affected_population_estimate,
          requiredExpertise: data.required_expertise || [],
          isDemoData: true,
          evidence: (data.evidence || []).map(
            (e: {
              id: string;
              type: string;
              url: string;
              caption?: string;
              title?: string;
              submitted_at?: string;
            }) => ({
              id: e.id,
              type: normalizeEvidenceType(e.type),
              url: e.url,
              caption: e.caption ?? e.title,
              submittedAt: e.submitted_at ?? new Date().toISOString(),
            })
          ),
        });
      }
    } catch (dbErr) {
      console.warn('DB getChallenge fallback:', dbErr);
    }

    const fallback = await mockGetChallenge(id);
    return NextResponse.json(fallback);
  } catch (error) {
    console.error('API getChallenge error:', error);
    return NextResponse.json({ error: 'Challenge not found' }, { status: 404 });
  }
}
