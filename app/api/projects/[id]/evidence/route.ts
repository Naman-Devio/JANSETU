import { NextRequest, NextResponse } from 'next/server';
import { addPilotEvidence as mockAddPilotEvidence } from '@/lib/mocks';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const result = await mockAddPilotEvidence(id, body);
    return NextResponse.json(result);
  } catch (error) {
    console.error('API addPilotEvidence error:', error);
    return NextResponse.json({ error: 'Failed to add pilot evidence' }, { status: 500 });
  }
}
