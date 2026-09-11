import { NextRequest, NextResponse } from 'next/server';
import { confirmChallenge as mockConfirm } from '@/lib/mocks';
import { createServerClient } from '@/lib/supabase/server';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const userId = body.userId || 'USR-DEMO-CITIZEN';

    try {
      const supabase = createServerClient();
      await supabase.from('challenge_confirmations').insert({
        id: `CONF-${Date.now()}`,
        challenge_id: id,
        user_id: userId,
      });

      const { count } = await supabase
        .from('challenge_confirmations')
        .select('*', { count: 'exact', head: true })
        .eq('challenge_id', id);

      if (count !== null) {
        await supabase.from('challenges').update({ confirmation_count: count }).eq('id', id);
        return NextResponse.json({ confirmationCount: count });
      }
    } catch (dbErr) {
      console.warn('DB confirmation fallback:', dbErr);
    }

    const fallback = await mockConfirm(id, userId);
    return NextResponse.json(fallback);
  } catch (error) {
    console.error('API confirm error:', error);
    return NextResponse.json({ error: 'Failed to confirm challenge' }, { status: 500 });
  }
}
