import * as cheerio from 'cheerio';

export interface ParliamentLinkItem {
  title: string;
  url: string;
}

export interface ParliamentNewsItem {
  title: string;
  url: string;
  date: string;
  description: string;
  category: string;
  tags: string[];
  imageUrl?: string;
  imageAlt?: string;
}

export interface ParliamentHomeData {
  news: ParliamentLinkItem[];
  pressReleases: ParliamentLinkItem[];
}

export interface ParliamentNewsData {
  news: ParliamentNewsItem[];
  categories: string[];
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
    // Ensure relative paths like "epanel/news/..." resolve to site root
    const normalized = (/^[a-zA-Z]+:\/\//.test(trimmed) || trimmed.startsWith('/'))
      ? trimmed
      : `/${trimmed}`;
    const url = new URL(normalized, PARLIAMENT_BASE_URL);
    return url.toString();
  } catch {
    return '';
  }
}

function extractCategoryFromTitle(title: string): string {
  const titleLower = title.toLowerCase();
  
  // Define category keywords
  const categories = {
    'Education': ['education', 'school', 'student', 'teacher', 'curriculum', 'quiz', 'learning'],
    'Economy': ['economy', 'finance', 'budget', 'investment', 'bank', 'economic', 'financial'],
    'Security': ['security', 'defense', 'military', 'police', 'terrorism', 'safety'],
    'Health': ['health', 'medical', 'hospital', 'healthcare', 'disease', 'medicine'],
    'Infrastructure': ['infrastructure', 'road', 'bridge', 'construction', 'development', 'project'],
    'Environment': ['environment', 'climate', 'green', 'forest', 'sustainability', 'carbon'],
    'International': ['international', 'diplomatic', 'ambassador', 'foreign', 'commonwealth', 'global'],
    'Technology': ['technology', 'ict', 'digital', 'stem', 'innovation', 'tech'],
    'Governance': ['governance', 'democracy', 'constitution', 'parliament', 'speaker', 'minister'],
    'Social': ['social', 'community', 'youth', 'women', 'children', 'welfare']
  };

  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(keyword => titleLower.includes(keyword))) {
      return category;
    }
  }
  
  return 'General';
}

function extractTagsFromTitle(title: string): string[] {
  const titleLower = title.toLowerCase();
  const tags: string[] = [];
  
  // Extract relevant tags
  const tagKeywords = [
    'parliament', 'speaker', 'minister', 'committee', 'bill', 'legislation',
    'democracy', 'constitution', 'government', 'policy', 'reform',
    'education', 'health', 'economy', 'security', 'infrastructure',
    'international', 'diplomatic', 'technology', 'digital', 'sustainability'
  ];
  
  tagKeywords.forEach(keyword => {
    if (titleLower.includes(keyword)) {
      tags.push(keyword.charAt(0).toUpperCase() + keyword.slice(1));
    }
  });
  
  return tags.slice(0, 3); // Limit to 3 tags
}

function parseDate(dateStr: string): string {
  try {
    // Clean the date string
    let cleanDateStr = dateStr.trim();
    
    // Handle specific Parliament date formats
    // Format: "Tuesday, 29th July, 2025" or "Tuesday, 29 July, 2025"
    const parliamentFormat = cleanDateStr.match(/(\w+day),?\s+(\d{1,2})(?:st|nd|rd|th)?\s+(\w+),?\s+(\d{4})/i);
    if (parliamentFormat) {
      const [, day, dayNum, month, year] = parliamentFormat;
      const monthMap: Record<string, string> = {
        'january': '01', 'february': '02', 'march': '03', 'april': '04',
        'may': '05', 'june': '06', 'july': '07', 'august': '08',
        'september': '09', 'october': '10', 'november': '11', 'december': '12'
      };
      const monthNum = monthMap[month.toLowerCase()];
      if (monthNum) {
        const paddedDay = dayNum.padStart(2, '0');
        return `${year}-${monthNum}-${paddedDay}`;
      }
    }
    
    // Try standard date parsing
    const date = new Date(cleanDateStr);
    if (!isNaN(date.getTime())) {
      return date.toISOString().split('T')[0];
    }
    
    // Fallback: try to extract year, month, day from various formats
    const yearMatch = cleanDateStr.match(/(\d{4})/);
    const monthMatch = cleanDateStr.match(/(\w+)/);
    const dayMatch = cleanDateStr.match(/(\d{1,2})/);
    
    if (yearMatch && monthMatch && dayMatch) {
      const year = yearMatch[1];
      const month = monthMatch[1].toLowerCase();
      const day = dayMatch[1].padStart(2, '0');
      
      const monthMap: Record<string, string> = {
        'january': '01', 'february': '02', 'march': '03', 'april': '04',
        'may': '05', 'june': '06', 'july': '07', 'august': '08',
        'september': '09', 'october': '10', 'november': '11', 'december': '12',
        'jan': '01', 'feb': '02', 'mar': '03', 'apr': '04',
        // omit duplicate 'may'
        'jun': '06', 'jul': '07', 'aug': '08',
        'sep': '09', 'oct': '10', 'nov': '11', 'dec': '12'
      };
      
      const monthNum = monthMap[month];
      if (monthNum) {
        return `${year}-${monthNum}-${day}`;
      }
    }
    
    return new Date().toISOString().split('T')[0]; // Fallback to today
  } catch {
    return new Date().toISOString().split('T')[0];
  }
}

export async function fetchParliamentHome(): Promise<ParliamentHomeData> {
  const res = await fetch(PARLIAMENT_BASE_URL, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Failed to fetch parliament homepage: ${res.status}`);
  }
  const html = await res.text();
  const $ = cheerio.load(html);

  const textIncludes = (s: string) => (i: number, el: cheerio.Element) => $(el).text().trim().toLowerCase().includes(s.toLowerCase());

  function extractFollowingLinks($heading: cheerio.Cheerio<cheerio.Element>, max = 8): ParliamentLinkItem[] {
    const section = $heading.parent();
    const links: ParliamentLinkItem[] = [];

    section.find('a').each((i: number, a: cheerio.Element) => {
      const title = $(a).text().trim();
      const href = $(a).attr('href');
      if (title && href && links.length < max) {
        links.push({ title, url: absolutizeUrl(href) });
      }
    });

    if (links.length === 0) {
      $('a').each((i: number, a: cheerio.Element) => {
        const title = $(a).text().trim();
        const href = $(a).attr('href');
        if (title && href && links.length < max) {
          links.push({ title, url: absolutizeUrl(href) });
        }
      });
    }

    const seen = new Set<string>();
    return links.filter(item => {
      const key = `${item.title}|${item.url}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return Boolean(item.title) && Boolean(item.url);
    });
  }

  const newsHeading = $('h2, h3, h4').filter(textIncludes('latest news')).first();
  const pressHeading = $('h2, h3, h4').filter(textIncludes('press release')).first();

  const news = newsHeading.length ? extractFollowingLinks(newsHeading) : [];
  const pressReleases = pressHeading.length ? extractFollowingLinks(pressHeading) : [];

  function heuristicLinks(selector: string, max = 8): ParliamentLinkItem[] {
    const items: ParliamentLinkItem[] = [];
    $(selector).find('a').each((i, a) => {
      const title = $(a).text().trim();
      const href = $(a).attr('href');
      if (title && href && items.length < max) {
        items.push({ title, url: absolutizeUrl(href) });
      }
    });
    const seen = new Set<string>();
    return items.filter(x => {
      const key = `${x.title}|${x.url}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  const finalNews = news.length ? news : heuristicLinks('[class*="news"], [id*="news"], section:contains("News")');
  const finalPress = pressReleases.length ? pressReleases : heuristicLinks('[class*="press"], [id*="press"], section:contains("Press")');

  return {
    news: finalNews.slice(0, 8),
    pressReleases: finalPress.slice(0, 8)
  };
}

export async function fetchParliamentNews(): Promise<ParliamentNewsData> {
  const res = await fetch(`${PARLIAMENT_BASE_URL}/news`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Failed to fetch parliament news: ${res.status}`);
  }
  const html = await res.text();
  const $ = cheerio.load(html);

  const newsItems: ParliamentNewsItem[] = [];
  const categories = new Set<string>();

  // Extract news items from the main content area
  // Target the actual Parliament site structure: .row containers with img and span siblings
  $('.row').each((i, el) => {
    const $row = $(el);

    // ✅ Extract image first
    const $img = $row.find('img').first();
    const src = $img.attr('src') || $img.attr('data-src') || $img.attr('data-lazy-src') || '';
    const imageUrl = src ? absolutizeUrl(src) : '';
    const imageAlt = $img.attr('alt') || '';

    // ✅ Extract text info from span
    const $span = $row.find('span').first();
    const rawText = $span.text().trim();

    // Parse date
    const dateMatch = rawText.match(/(\w+day,?\s+\d{1,2}(?:st|nd|rd|th)?\s+\w+,?\s+\d{4})/);
    const dateStr = dateMatch ? dateMatch[1] : '';
    const parsedDate = dateStr ? parseDate(dateStr) : new Date().toISOString().split('T')[0];

    // Extract title (inside <b>)
    const title = $span.find('b').first().text().trim();

    // Description is text after the title
    let description = rawText.replace(dateStr, '').replace(title, '').trim();
    if (description.length > 300) {
      description = description.slice(0, 300) + '...';
    }

    if (title && title.length > 10) {
      const category = extractCategoryFromTitle(title);
      const tags = extractTagsFromTitle(title);

      newsItems.push({
        title,
        url: `${PARLIAMENT_BASE_URL}/news`,
        date: parsedDate,
        description,
        category,
        tags,
        imageUrl: imageUrl || undefined,
        imageAlt: imageAlt || undefined
      });

      categories.add(category);
    }
  });

  // If no .row structure found, fallback to alternative extraction methods
  if (newsItems.length === 0) {
    // Look for bold text that might be news titles
    $('strong, b').each((i, element) => {
      const $element = $(element);
      const title = $element.text().trim();
      
      if (title && title.length > 15 && title.length < 200) {
        // Look for date in nearby text
        const $parent = $element.parent();
        const parentText = $parent.text();
        const dateMatch = parentText.match(/(\w+day,?\s+\d{1,2}(?:st|nd|rd|th)?\s+\w+,?\s+\d{4})/);
        
        // Look for images
        let imageUrl = '';
        let imageAlt = '';
        const $img = $parent.find('img').first();
        if ($img.length) {
          const src = $img.attr('src') || $img.attr('data-src') || $img.attr('data-lazy-src');
          if (src) {
            imageUrl = absolutizeUrl(src);
            imageAlt = $img.attr('alt') || title;
          }
        }
        
        // Generate description
        let description = title;
        const afterTitle = parentText.substring(parentText.indexOf(title) + title.length).trim();
        if (afterTitle.length > 20 && afterTitle.length < 300) {
          description = afterTitle;
        }
        
        const category = extractCategoryFromTitle(title);
        const tags = extractTagsFromTitle(title);
        
        newsItems.push({
          title,
          url: `${PARLIAMENT_BASE_URL}/news`,
          date: dateMatch ? parseDate(dateMatch[1]) : new Date().toISOString().split('T')[0],
          description,
          category,
          tags,
          imageUrl: imageUrl || undefined,
          imageAlt: imageAlt || undefined
        });
        
        categories.add(category);
      }
    });
  }

  // Remove duplicates and limit results
  const seen = new Set<string>();
  const uniqueNews = newsItems.filter(item => {
    const key = `${item.title}|${item.date}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, 15); // Limit to 15 news items

  return {
    news: uniqueNews,
    categories: Array.from(categories).sort()
  };
}
