import { NextRequest, NextResponse } from 'next/server';
import { updateMilestone as mockUpdateMilestone } from '@/lib/mocks';

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { milestoneId, ...updates } = body;
    const result = await mockUpdateMilestone(milestoneId, updates);
    return NextResponse.json(result);
  } catch (error) {
    console.error('API updateMilestone error:', error);
    return NextResponse.json({ error: 'Failed to update milestone' }, { status: 500 });
  }
}
