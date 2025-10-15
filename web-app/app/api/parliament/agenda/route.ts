import { NextRequest, NextResponse } from 'next/server';
import { fetchParliamentAgenda } from '../../../lib/parliamentAgendaScraper';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    
    const agendaData = await fetchParliamentAgenda(page);
    
    return NextResponse.json({
      success: true,
      data: agendaData,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Parliament Agenda API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch parliament agenda data',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
