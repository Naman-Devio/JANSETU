import { NextRequest, NextResponse } from 'next/server';
import { createTeam as mockCreateTeam } from '@/lib/mocks';
import { createServerClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const teamId = `TEAM-${Math.floor(100 + Math.random() * 900)}`;

    try {
      const supabase = createServerClient();
      await supabase.from('teams').insert({
        id: teamId,
        challenge_id: body.challengeId,
        faculty_mentor: body.facultyMentor,
        members: body.members || [],
      });
      await supabase.from('challenges').update({ status: 'TEAM_FORMED' }).eq('id', body.challengeId);
    } catch (dbErr) {
      console.warn('DB createTeam fallback:', dbErr);
    }

    const team = await mockCreateTeam(body);
    return NextResponse.json(team);
  } catch (error) {
    console.error('API createTeam error:', error);
    return NextResponse.json({ error: 'Failed to create team' }, { status: 500 });
  }
}
