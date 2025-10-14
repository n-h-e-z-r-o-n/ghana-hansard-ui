import { NextResponse } from 'next/server';
import { fetchParliamentNews } from '../../../lib/parliamentScraper';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '12');
    
    const data = await fetchParliamentNews();
    
    // Filter by category if specified
    let filteredNews = data.news;
    if (category && category !== 'all') {
      filteredNews = data.news.filter(item => 
        item.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    // Limit results
    filteredNews = filteredNews.slice(0, limit);
    
    return NextResponse.json({ 
      success: true, 
      data: {
        news: filteredNews,
        categories: data.categories,
        total: data.news.length
      }
    }, { status: 200 });
  } catch (error: any) {
    console.error('Failed to fetch parliament news:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to load news data' 
    }, { status: 502 });
  }
}
