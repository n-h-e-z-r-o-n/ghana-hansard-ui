import { NextResponse } from 'next/server';
import { fetchParliamentHome } from '../../../lib/parliamentScraper';

export async function GET() {
  try {
    const data = await fetchParliamentHome();
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error: any) {
    console.error('Failed to fetch parliament home data:', error);
    return NextResponse.json({ success: false, error: 'Failed to load data' }, { status: 502 });
  }
}


