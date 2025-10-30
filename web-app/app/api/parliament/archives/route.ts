import * as cheerio from 'cheerio';

async function fetchWithTimeout(url: string, timeoutMs = 15000): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { cache: 'no-store', signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchPage(baseUrl: string, pageIndex: number) {
  const offset = pageIndex * 50;
  const url = `${baseUrl}${offset}`;

  let res: Response | null = null;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      res = await fetchWithTimeout(url, 15000);
      if (res.ok) break;
    } catch {}
    await new Promise(r => setTimeout(r, 500 + attempt * 500));
  }
  if (!res || !res.ok) return { items: [], hasMore: false };

  const html = await res.text();
  const $ = cheerio.load(html);

  const rows = $('table tbody tr[onclick]');
  if (!rows || rows.length === 0) return { items: [], hasMore: false };

  const items: { link: string; title: string; year: string }[] = [];
  rows.each((_, el) => {
    try {
      const onclick = $(el).attr('onclick') || '';
      const m = onclick.match(/showPDF\('([^']+)'\,'([^']+)'\)/);
      if (m) {
        const pdfPath = m[1].trim();
        const rawTitle = m[2].trim();
        const yearMatch = rawTitle.match(/(\d{4})/);
        const year = yearMatch ? yearMatch[1] : '';
        const title = rawTitle.replace(/,?\s*\d{4}/, '').trim();
        items.push({ link: `https://www.parliament.gh/epanel/docs/${pdfPath}`, title, year });
      }
    } catch {}
  });

  const hasMore = items.length > 0;
  return { items, hasMore };
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const pagesParam = searchParams.get('pages');
  const type = (searchParams.get('type') || 'HS').toUpperCase();
  const pageParam = searchParams.get('page');

  const baseUrl = `https://www.parliament.gh/docs?type=${encodeURIComponent(type)}&P=`;

  if (pageParam !== null) {
    const pageIndex = Math.max(0, parseInt(pageParam, 10) || 0);
    try {
      const { items, hasMore } = await fetchPage(baseUrl, pageIndex);
      return Response.json({ items, hasMore, page: pageIndex }, { status: 200 });
    } catch {
      return Response.json({ items: [], hasMore: false, page: pageIndex }, { status: 200 });
    }
  }

  const maxPages = Number.isFinite(Number(pagesParam))
    ? Math.max(1, Math.min(40, parseInt(pagesParam as string, 10)))
    : 10;

  const results: { link: string; title: string; year: string }[] = [];

  try {
    for (let i = 0; i < maxPages; i++) {
      const { items, hasMore } = await fetchPage(baseUrl, i);
      if (items.length) results.push(...items);
      if (!hasMore) break;
    }
    return Response.json(results, { status: 200 });
  } catch {
    return Response.json({ error: 'Failed to fetch archives' }, { status: 500 });
  }
}