import { NextRequest, NextResponse } from 'next/server';
import { findSimilarChallenges } from '@/lib/matching/similarity';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await findSimilarChallenges(body);
    return NextResponse.json(result);
  } catch (error) {
    console.error('API similar error:', error);
    return NextResponse.json({ error: 'Failed to query similar challenges' }, { status: 500 });
  }
}
