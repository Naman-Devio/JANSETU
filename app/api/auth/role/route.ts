import { NextRequest, NextResponse } from 'next/server';
import { switchDemoRole as mockSwitch, getCurrentUser as mockGetUser } from '@/lib/mocks';
import { UserRole } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const { role } = await req.json();
    const user = await mockSwitch(role as UserRole);
    return NextResponse.json(user);
  } catch (error) {
    console.error('API switch role error:', error);
    return NextResponse.json({ error: 'Failed to switch role' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const user = await mockGetUser();
    return NextResponse.json(user);
  } catch (error) {
    console.error('API get user error:', error);
    return NextResponse.json({ error: 'Failed to get user' }, { status: 500 });
  }
}
