import { NextRequest, NextResponse } from 'next/server';
import { submitProposal as mockSubmitProposal } from '@/lib/mocks';
import { createServerClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const proposalId = `PROP-${Math.floor(100 + Math.random() * 900)}`;

    try {
      const supabase = createServerClient();
      await supabase.from('proposals').insert({
        id: proposalId,
        team_id: body.teamId,
        title: body.title,
        problem_understanding: body.problemUnderstanding,
        approach: body.approach,
        expected_impact: body.expectedImpact,
        prototype_plan: body.prototypePlan,
        testing_plan: body.testingPlan,
        duration_weeks: body.durationWeeks,
        estimated_cost_range: body.estimatedCostRange,
      });
    } catch (dbErr) {
      console.warn('DB proposal fallback:', dbErr);
    }

    const proposal = await mockSubmitProposal(body);
    return NextResponse.json(proposal);
  } catch (error) {
    console.error('API submitProposal error:', error);
    return NextResponse.json({ error: 'Failed to submit proposal' }, { status: 500 });
  }
}
