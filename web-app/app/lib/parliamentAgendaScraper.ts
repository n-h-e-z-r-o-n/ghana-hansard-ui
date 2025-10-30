import * as cheerio from 'cheerio';

export interface AgendaItem {
  date: string;
  title: string;
  url: string;
  formattedDate: string;
  dayOfWeek: string;
  meetingType: string;
  year: string;
}

function normalizeAgendaDate(input: string): Date | null {
  if (!input) return null;
  // Normalize whitespace and commas
  const cleaned = input.replace(/\u00A0/g, ' ').trim();
  // Try native parse first
  const d1 = new Date(cleaned);
  if (!isNaN(d1.getTime())) return d1;
  // Remove ordinal suffixes (1st, 2nd, 3rd, 4th) and extra commas
  const noOrd = cleaned.replace(/\b(\d{1,2})(st|nd|rd|th)\b/gi, '$1').replace(/,\s*/g, ' ');
  const d2 = new Date(noOrd);
  if (!isNaN(d2.getTime())) return d2;
  // Handle DD/MM/YYYY or DD-MM-YYYY
  const m = noOrd.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
  if (m) {
    const [, dd, mm, yyyy] = m;
    const iso = `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
    const d3 = new Date(iso);
    if (!isNaN(d3.getTime())) return d3;
  }
  return null;
}

export async function fetchParliamentAgenda(page = 1): Promise<{ agendas: AgendaItem[]; totalPages: number; currentPage: number; lastUpdated: string; }> {
  const PARLIAMENT_BASE_URL = 'https://www.parliament.gh';
  const url = `${PARLIAMENT_BASE_URL}/docs?type=AG&P=${(page-1)*50}`; // parliament site uses offset in multiples of 50
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
  const html = await res.text();
  const $ = cheerio.load(html);

  const agendas: AgendaItem[] = [];

  $('table tbody tr[onclick]').each((i, row) => {
    const onclick = $(row).attr('onclick') || '';
    const date = $(row).find('td').eq(0).text().trim();
    const title = $(row).find('td').eq(1).text().trim();

    const m = onclick.match(/showPDF\('([^']+)','([^']+)'\)/);
    if (!m) return;

    const linkPath = m[1].trim();
    const fullUrl = `https://www.parliament.gh/epanel/docs/${linkPath}`;

    const yearMatch = title.match(/\b(20\d{2}|19\d{2})\b/);
    const year = yearMatch ? yearMatch[0] : 'Unknown';

    const parsed = normalizeAgendaDate(date);
    const formattedDate = parsed ? parsed.toISOString().split('T')[0] : '';
    const dayOfWeek = parsed ? parsed.toLocaleDateString('en-US', { weekday: 'long' }) : '';

    agendas.push({
      date,
      title: title.replace(/,\s*\d{4}$/, '').trim(),
      url: fullUrl,
      formattedDate,
      dayOfWeek,
      meetingType: /agenda/i.test(title) ? 'Agenda' : 'Parliamentary Meeting',
      year
    });
  });

  // Basic pagination hinting: if we got a full batch (50), assume there may be another page.
  const pageSize = 50;
  const currentPage = Math.max(1, page);
  const totalPages = agendas.length === pageSize ? currentPage + 1 : currentPage; // best-effort estimate
  const lastUpdated = new Date().toISOString();

  return { agendas, totalPages, currentPage, lastUpdated };
}

export default fetchParliamentAgenda; // also export default for compatibility
