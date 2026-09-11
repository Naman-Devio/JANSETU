import { NextRequest, NextResponse } from 'next/server';
import { listSolutions as mockListSolutions, findRelatedSolutions as mockFindRelated } from '@/lib/mocks';
import { createServerClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  try {
    const domain = req.nextUrl.searchParams.get('domain') || undefined;
    const challengeId = req.nextUrl.searchParams.get('challengeId') || undefined;

    if (challengeId) {
      const related = await mockFindRelated(challengeId);
      return NextResponse.json(related);
    }

    try {
      const supabase = createServerClient();
      let query = supabase.from('solutions').select('*');
      if (domain && domain !== 'ALL') query = query.eq('domain', domain);
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return NextResponse.json(
          data.map(
            (s: {
              id: string;
              title: string;
              domain: string;
              origin_challenge_id: string;
              similarity_to_current_challenge?: number;
            }) => ({
              id: s.id,
              title: s.title,
              domain: s.domain,
              originChallengeId: s.origin_challenge_id,
              similarityToCurrentChallenge: s.similarity_to_current_challenge,
            })
          )
        );
      }
    } catch (dbErr) {
      console.warn('DB solutions fallback:', dbErr);
    }

    const solutions = await mockListSolutions({ domain });
    return NextResponse.json(solutions);
  } catch (error) {
    console.error('API solutions error:', error);
    return NextResponse.json({ error: 'Failed to list solutions' }, { status: 500 });
  }
}
