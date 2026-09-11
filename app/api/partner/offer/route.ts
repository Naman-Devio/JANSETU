import { NextRequest, NextResponse } from 'next/server';
import { submitPartnerOffer as mockSubmitPartnerOffer } from '@/lib/mocks';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await mockSubmitPartnerOffer(body);
    return NextResponse.json(result);
  } catch (error) {
    console.error('API submitPartnerOffer error:', error);
    return NextResponse.json({ error: 'Failed to submit partner offer' }, { status: 500 });
  }
}
