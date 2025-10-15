import { NextRequest, NextResponse } from 'next/server';
import { fetchParliamentBills } from '../../../lib/parliamentBillsScraper';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    
    const billsData = await fetchParliamentBills(page);
    
    return NextResponse.json({
      success: true,
      data: billsData,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Parliament Bills API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch parliament bills data',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
