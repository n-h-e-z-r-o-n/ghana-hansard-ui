import * as cheerio from 'cheerio';
import { URL } from 'url';

export interface AgendaItem {
  date: string;
  title: string;
  url: string;
  formattedDate: string;
  dayOfWeek: string;
  meetingType: string;
}

export interface AgendaData {
  agendas: AgendaItem[];
  totalPages: number;
  currentPage: number;
  lastUpdated: string;
}

const PARLIAMENT_BASE_URL = 'https://www.parliament.gh';

function absolutizeUrl(href: string | undefined): string {
  if (!href) return '';
  const trimmed = href.trim();
  // Ignore data URLs
  if (trimmed.startsWith('data:')) return '';
  // Protocol-relative URLs
  if (trimmed.startsWith('//')) return `https:${trimmed}`;
  try {
    // Ensure relative paths resolve to site root
    const normalized = (/^[a-zA-Z]+:\/\//.test(trimmed) || trimmed.startsWith('/'))
      ? trimmed
      : `/${trimmed}`;
    const url = new URL(normalized, PARLIAMENT_BASE_URL);
    return url.toString();
  } catch {
    return '';
  }
}

function parseDate(dateStr: string): { formattedDate: string; dayOfWeek: string } {
  try {
    // Handle Parliament date format: "Thursday, 12th June, 2025"
    const dateMatch = dateStr.match(/(\w+day),?\s+(\d{1,2})(?:st|nd|rd|th)?\s+(\w+),?\s+(\d{4})/i);
    if (dateMatch) {
      const [, dayOfWeek, day, month, year] = dateMatch;
      const monthMap: Record<string, string> = {
        'january': '01', 'february': '02', 'march': '03', 'april': '04',
        'may': '05', 'june': '06', 'july': '07', 'august': '08',
        'september': '09', 'october': '10', 'november': '11', 'december': '12'
      };
      const monthNum = monthMap[month.toLowerCase()];
      if (monthNum) {
        const paddedDay = day.padStart(2, '0');
        const formattedDate = `${year}-${monthNum}-${paddedDay}`;
        return { formattedDate, dayOfWeek: dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1) };
      }
    }
    
    // Fallback to standard date parsing
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      const formattedDate = date.toISOString().split('T')[0];
      const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
      return { formattedDate, dayOfWeek };
    }
    
    return { formattedDate: new Date().toISOString().split('T')[0], dayOfWeek: 'Unknown' };
  } catch {
    return { formattedDate: new Date().toISOString().split('T')[0], dayOfWeek: 'Unknown' };
  }
}

function extractMeetingType(title: string): string {
  const titleLower = title.toLowerCase();
  
  if (titleLower.includes('first meeting')) return 'First Meeting';
  if (titleLower.includes('second meeting')) return 'Second Meeting';
  if (titleLower.includes('third meeting')) return 'Third Meeting';
  if (titleLower.includes('fourth meeting')) return 'Fourth Meeting';
  if (titleLower.includes('fifth meeting')) return 'Fifth Meeting';
  if (titleLower.includes('sixth meeting')) return 'Sixth Meeting';
  if (titleLower.includes('seventh meeting')) return 'Seventh Meeting';
  if (titleLower.includes('eighth meeting')) return 'Eighth Meeting';
  if (titleLower.includes('ninth meeting')) return 'Ninth Meeting';
  if (titleLower.includes('tenth meeting')) return 'Tenth Meeting';
  
  return 'Parliamentary Meeting';
}

export async function fetchParliamentAgenda(page: number = 1): Promise<AgendaData> {
  try {
    const url = `${PARLIAMENT_BASE_URL}/docs?type=AG&page=${page}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) {
      throw new Error(`Failed to fetch parliament agenda: ${res.status}`);
    }
    const html = await res.text();
    const $ = cheerio.load(html);

    const agendas: AgendaItem[] = [];

    // Extract agenda items from the table
    $('table tr').each((i, row) => {
      const $row = $(row);
      const cells = $row.find('td');
      
      if (cells.length >= 2) {
        const dateCell = $(cells[0]);
        const titleCell = $(cells[1]);
        
        const dateText = dateCell.text().trim();
        const titleText = titleCell.text().trim();
        
        // Look for links in the title cell
        const link = titleCell.find('a').first();
        const href = link.attr('href');
        
        if (dateText && titleText && dateText !== 'Date' && titleText !== 'Title') {
          const { formattedDate, dayOfWeek } = parseDate(dateText);
          const meetingType = extractMeetingType(titleText);
          
          agendas.push({
            date: dateText,
            title: titleText,
            url: href ? absolutizeUrl(href) : `${PARLIAMENT_BASE_URL}/docs?type=AG`,
            formattedDate,
            dayOfWeek,
            meetingType
          });
        }
      }
    });

    // Extract pagination information
    let totalPages = 1;
    const currentPage = page;
    
    // Look for pagination links
    $('a').each((i, link) => {
      const href = $(link).attr('href');
      if (href && href.includes('page=')) {
        const pageMatch = href.match(/page=(\d+)/);
        if (pageMatch) {
          const pageNum = parseInt(pageMatch[1]);
          if (pageNum > totalPages) {
            totalPages = pageNum;
          }
        }
      }
    });

    // If no pagination found, estimate based on content
    if (totalPages === 1 && agendas.length > 0) {
      // Assume 20 items per page based on the website structure
      totalPages = Math.max(1, Math.ceil(agendas.length / 20));
    }

    return {
      agendas: agendas.slice(0, 20), // Limit to 20 items per page
      totalPages,
      currentPage,
      lastUpdated: new Date().toISOString()
    };

  } catch (error) {
    console.error('Error fetching parliament agenda:', error);
    
    // Return fallback data in case of error
    return {
      agendas: [
        {
          date: "Thursday, 12th June, 2025",
          title: "Agenda for the Second Meeting of Parliament Commencing on Tuesday 27th May-July, 2025",
          url: `${PARLIAMENT_BASE_URL}/docs?type=AG`,
          formattedDate: "2025-06-12",
          dayOfWeek: "Thursday",
          meetingType: "Second Meeting"
        },
        {
          date: "Tuesday, 25th January, 2022",
          title: "Agenda - 1st Meeting 25th January-5th March, 2022",
          url: `${PARLIAMENT_BASE_URL}/docs?type=AG`,
          formattedDate: "2022-01-25",
          dayOfWeek: "Tuesday",
          meetingType: "First Meeting"
        },
        {
          date: "Tuesday, 30th October, 2018",
          title: "Agenda for the 3rd Meeting of Parliament commencing on Tuesday, 30th October, 2018",
          url: `${PARLIAMENT_BASE_URL}/docs?type=AG`,
          formattedDate: "2018-10-30",
          dayOfWeek: "Tuesday",
          meetingType: "Third Meeting"
        }
      ],
      totalPages: 1,
      currentPage: 1,
      lastUpdated: new Date().toISOString()
    };
  }
}
