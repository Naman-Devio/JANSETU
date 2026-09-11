import { NextRequest, NextResponse } from 'next/server';
import { getMyReports as mockGetMyReports } from '@/lib/mocks';

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('userId') || 'USR-DEMO-CITIZEN';
    const reports = await mockGetMyReports(userId);
    return NextResponse.json(reports);
  } catch (error) {
    console.error('API getMyReports error:', error);
    return NextResponse.json({ error: 'Failed to fetch citizen reports' }, { status: 500 });
  }
}
