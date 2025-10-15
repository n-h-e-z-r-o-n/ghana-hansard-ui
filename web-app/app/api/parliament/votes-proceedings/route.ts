import { NextRequest, NextResponse } from 'next/server';
import { fetchVotesProceedings } from '../../../lib/parliamentVotesProceedingsScraper';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    
    const votesProceedingsData = await fetchVotesProceedings(page);
    
    return NextResponse.json({
      success: true,
      data: votesProceedingsData,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Votes & Proceedings API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch votes and proceedings data',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
