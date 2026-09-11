import { NextRequest, NextResponse } from 'next/server';
import { analyzeReport } from '@/lib/ai';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await analyzeReport(body);
    return NextResponse.json(result);
  } catch (error) {
    console.error('API analyze error:', error);
    return NextResponse.json({ error: 'Failed to analyze report' }, { status: 500 });
  }
}
