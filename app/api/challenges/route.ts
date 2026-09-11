import { NextRequest, NextResponse } from 'next/server';
import { listChallenges as mockListChallenges } from '@/lib/mocks';
import { createServerClient } from '@/lib/supabase/server';
import { ChallengeStatus } from '@/types';

export async function GET(req: NextRequest) {
  try {
    const domain = req.nextUrl.searchParams.get('domain') || undefined;
    const statusParam = req.nextUrl.searchParams.get('status');
    const status = statusParam && statusParam !== 'ALL' ? (statusParam as ChallengeStatus) : undefined;
    const district = req.nextUrl.searchParams.get('district') || undefined;

    try {
      const supabase = createServerClient();
      let query = supabase.from('challenges').select('*');
      if (domain && domain !== 'ALL') query = query.eq('domain', domain);
      if (status) query = query.eq('status', status);
      if (district && district !== 'ALL') query = query.ilike('affected_area', `%${district}%`);

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        const summaries = data.map(
          (ch: {
            id: string;
            title: string;
            domain: string;
            status: ChallengeStatus;
            priority: 'LOW' | 'MEDIUM' | 'HIGH';
            signal_count: number;
            evidence_count: number;
            confirmation_count: number;
            affected_area: string;
            lat: number;
            lng: number;
          }) => ({
            id: ch.id,
            title: ch.title,
            domain: ch.domain,
            status: ch.status,
            priority: ch.priority,
            signalCount: ch.signal_count,
            evidenceCount: ch.evidence_count,
            confirmationCount: ch.confirmation_count,
            affectedArea: ch.affected_area,
            lat: ch.lat,
            lng: ch.lng,
          })
        );
        return NextResponse.json(summaries);
      }
    } catch (dbErr) {
      console.warn('DB listChallenges fallback:', dbErr);
    }

    const fallback = await mockListChallenges({ domain, status, district });
    return NextResponse.json(fallback);
  } catch (error) {
    console.error('API listChallenges error:', error);
    return NextResponse.json({ error: 'Failed to list challenges' }, { status: 500 });
  }
}
