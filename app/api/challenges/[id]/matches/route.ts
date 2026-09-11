import { NextRequest, NextResponse } from 'next/server';
import { getUniversityMatches } from '@/lib/matching/university';
import { getPartnerMatches } from '@/lib/matching/partner';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const type = req.nextUrl.searchParams.get('type') || 'university';

    if (type === 'partner') {
      const partnerMatches = await getPartnerMatches(id);
      return NextResponse.json(partnerMatches);
    }

    const universityMatches = await getUniversityMatches(id);
    return NextResponse.json(universityMatches);
  } catch (error) {
    console.error('API matches error:', error);
    return NextResponse.json({ error: 'Failed to calculate matches' }, { status: 500 });
  }
}
