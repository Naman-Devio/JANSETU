import { NextRequest, NextResponse } from 'next/server';
import { getImpactMetrics as mockGetImpactMetrics } from '@/lib/mocks';
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
        .from('impact_metrics')
        .select('*')
        .eq('project_id', id);

      if (!error && data && data.length > 0) {
        return NextResponse.json(
          data.map(
            (im: {
              id: string;
              project_id: string;
              label: string;
              value: string;
              source: string;
              date: string;
              method: string;
            }) => ({
              id: im.id,
              projectId: im.project_id,
              label: im.label,
              value: im.value,
              source: im.source,
              date: im.date,
              method: im.method,
              isDemoData: true,
            })
          )
        );
      }
    } catch (dbErr) {
      console.warn('DB getImpactMetrics fallback:', dbErr);
    }

    const fallback = await mockGetImpactMetrics(id);
    return NextResponse.json(fallback);
  } catch (error) {
    console.error('API getImpactMetrics error:', error);
    return NextResponse.json({ error: 'Failed to fetch impact metrics' }, { status: 500 });
  }
}
