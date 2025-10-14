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
  try {
    const url = new URL(href, PARLIAMENT_BASE_URL);
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
    // Handle various date formats from the Parliament site
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return new Date().toISOString().split('T')[0]; // Fallback to today
    }
    return date.toISOString().split('T')[0];
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

  function extractFollowingLinks($heading: cheerio.Cheerio, max = 8): ParliamentLinkItem[] {
    const section = $heading.parent();
    const links: ParliamentLinkItem[] = [];

    section.find('a').each((i, a) => {
      const title = $(a).text().trim();
      const href = $(a).attr('href');
      if (title && href && links.length < max) {
        links.push({ title, url: absolutizeUrl(href) });
      }
    });

    if (links.length === 0) {
      $('a').each((i, a) => {
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
  // Look for news entries in the page structure
  $('body').find('*').each((i, element) => {
    const $element = $(element);
    const text = $element.text().trim();
    
    // Look for date patterns followed by bold text (news titles)
    const dateMatch = text.match(/(\w+day,?\s+\d{1,2}(?:st|nd|rd|th)?\s+\w+,?\s+\d{4})\s+\*\*(.*?)\*\*/);
    
    if (dateMatch) {
      const dateStr = dateMatch[1];
      const title = dateMatch[2].trim();
      
      if (title && title.length > 10) {
        // Find the parent container to look for images and additional content
        const $container = $element.closest('div, section, article, p');
        
        // Look for images in the container
        let imageUrl = '';
        let imageAlt = '';
        const $img = $container.find('img').first();
        if ($img.length) {
          const src = $img.attr('src') || $img.attr('data-src');
          if (src) {
            imageUrl = absolutizeUrl(src);
            imageAlt = $img.attr('alt') || title;
          }
        }
        
        // If no image found in container, look for images in the same section
        if (!imageUrl) {
          const $section = $container.parent();
          const $sectionImg = $section.find('img').first();
          if ($sectionImg.length) {
            const src = $sectionImg.attr('src') || $sectionImg.attr('data-src');
            if (src) {
              imageUrl = absolutizeUrl(src);
              imageAlt = $sectionImg.attr('alt') || title;
            }
          }
        }
        
        // Generate description from the text following the title
        let description = title;
        const fullText = $container.text().trim();
        const titleIndex = fullText.indexOf(title);
        if (titleIndex !== -1) {
          const afterTitle = fullText.substring(titleIndex + title.length).trim();
          if (afterTitle.length > 20 && afterTitle.length < 300) {
            description = afterTitle;
          }
        }
        
        // If description is still the title and it's long, truncate it
        if (description === title && title.length > 100) {
          description = title.substring(0, 150) + '...';
        }
        
        const category = extractCategoryFromTitle(title);
        const tags = extractTagsFromTitle(title);
        
        newsItems.push({
          title,
          url: `${PARLIAMENT_BASE_URL}/news`, // Default URL since individual article URLs aren't always available
          date: parseDate(dateStr),
          description,
          category,
          tags,
          imageUrl: imageUrl || undefined,
          imageAlt: imageAlt || undefined
        });
        
        categories.add(category);
      }
    }
  });

  // If no structured news found with the above method, try alternative extraction
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
          const src = $img.attr('src') || $img.attr('data-src');
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

  // If still no news found, try to extract from any text that looks like news
  if (newsItems.length === 0) {
    $('p, div').each((i, element) => {
      const $element = $(element);
      const text = $element.text().trim();
      
      // Look for patterns that might be news entries
      const newsMatch = text.match(/(\w+day,?\s+\d{1,2}(?:st|nd|rd|th)?\s+\w+,?\s+\d{4})\s+(.+)/);
      
      if (newsMatch) {
        const dateStr = newsMatch[1];
        const content = newsMatch[2].trim();
        
        // Extract title (first part before period or long text)
        const titleMatch = content.match(/^(.+?)(?:\s+\*\*|$)/);
        const title = titleMatch ? titleMatch[1].trim() : content.substring(0, 100);
        
        if (title && title.length > 10) {
          // Look for images
          let imageUrl = '';
          let imageAlt = '';
          const $img = $element.find('img').first();
          if ($img.length) {
            const src = $img.attr('src') || $img.attr('data-src');
            if (src) {
              imageUrl = absolutizeUrl(src);
              imageAlt = $img.attr('alt') || title;
            }
          }
          
          const category = extractCategoryFromTitle(title);
          const tags = extractTagsFromTitle(title);
          
          newsItems.push({
            title,
            url: `${PARLIAMENT_BASE_URL}/news`,
            date: parseDate(dateStr),
            description: content.length > 200 ? content.substring(0, 200) + '...' : content,
            category,
            tags,
            imageUrl: imageUrl || undefined,
            imageAlt: imageAlt || undefined
          });
          
          categories.add(category);
        }
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
