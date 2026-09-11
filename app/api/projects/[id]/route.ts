import { NextRequest, NextResponse } from 'next/server';
import { getProject as mockGetProject } from '@/lib/mocks';
import { createServerClient } from '@/lib/supabase/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    try {
      const supabase = createServerClient();
      const { data, error } = await supabase
        .from('projects')
        .select('*, milestones(*)')
        .eq('id', id)
        .single();

      if (!error && data) {
        return NextResponse.json({
          id: data.id,
          challengeId: data.challenge_id,
          title: data.title,
          status: data.status,
          stage: data.stage,
          milestones: (data.milestones || []).map(
            (m: {
              id: string;
              name: string;
              owner: string;
              due_date: string;
              status: 'PENDING' | 'IN_PROGRESS' | 'DONE';
              deliverable?: string;
            }) => ({
              id: m.id,
              name: m.name,
              owner: m.owner,
              dueDate: m.due_date,
              status: m.status,
              deliverable: m.deliverable,
            })
          ),
        });
      }
    } catch (dbErr) {
      console.warn('DB getProject fallback:', dbErr);
    }

    const fallback = await mockGetProject(id);
    return NextResponse.json(fallback);
  } catch (error) {
    console.error('API getProject error:', error);
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }
}
