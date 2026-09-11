import { NextRequest, NextResponse } from 'next/server';
import { verifyChallenge as mockVerify } from '@/lib/mocks';
import { createServerClient } from '@/lib/supabase/server';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const decision = body.decision || 'VERIFIED';

    try {
      const supabase = createServerClient();
      await supabase.from('challenges').update({ status: decision }).eq('id', id);
    } catch (dbErr) {
      console.warn('DB verify fallback:', dbErr);
    }

    const fallback = await mockVerify(id, decision);
    return NextResponse.json(fallback);
  } catch (error) {
    console.error('API verify error:', error);
    return NextResponse.json({ error: 'Failed to verify challenge' }, { status: 500 });
  }
}
