import { NextResponse } from 'next/server';
import { fetchParliamentAgenda } from '../../../lib/parliamentAgendaScraper';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const pageParam = searchParams.get('page');
    const page = pageParam ? Math.max(1, parseInt(pageParam, 10) || 1) : 1;

    const data = await fetchParliamentAgenda(page);
    return NextResponse.json({ success: true, data });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
