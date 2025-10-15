import { NextResponse } from 'next/server';
import { fetchParliamentLeadership } from '../../../lib/parliamentLeadershipScraper';

export async function GET() {
  try {
    const leadershipData = await fetchParliamentLeadership();
    
    return NextResponse.json({
      success: true,
      data: leadershipData,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Leadership API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch leadership data',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
