import { NextRequest, NextResponse } from 'next/server';
import { acceptProposal as mockAcceptProposal } from '@/lib/mocks';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const project = await mockAcceptProposal(id);
    return NextResponse.json(project);
  } catch (error) {
    console.error('API acceptProposal error:', error);
    return NextResponse.json({ error: 'Failed to accept proposal' }, { status: 500 });
  }
}
