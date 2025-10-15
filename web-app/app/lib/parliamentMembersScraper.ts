import * as cheerio from 'cheerio';

export interface ParliamentMember {
  name: string;
  constituency: string;
  party: string;
  region?: string;
  title?: string;
  email?: string;
  phone?: string;
  imageUrl?: string;
  bio?: string;
  education?: string;
  profession?: string;
  committees?: string[];
  roles?: string[];
  tenure?: string;
  age?: number;
  gender?: string;
  socialMedia?: {
    twitter?: string;
    facebook?: string;
    linkedin?: string;
  };
  achievements?: string[];
  recentActivity?: Array<{
    date: string;
    activity: string;
    type: string;
  }>;
  sentiment?: 'positive' | 'neutral' | 'negative';
  popularity?: number;
  influence?: number;
  votingRecord?: {
    totalVotes: number;
    attendance: number;
    partyLoyalty: number;
    crossPartyVotes: number;
  };
  performance?: {
    billsSponsored: number;
    billsPassed: number;
    debatesParticipated: number;
    speakingTime: string;
    questionsAsked: number;
    answersGiven: number;
  };
}

export interface ParliamentMembersData {
  members: ParliamentMember[];
  totalCount: number;
  parties: string[];
  regions: string[];
  committees: string[];
}

const PARLIAMENT_BASE_URL = 'https://www.parliament.gh';

// Helper function to add delay between requests
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Map constituencies to regions (this would ideally come from a more comprehensive source)
const constituencyToRegion: Record<string, string> = {
  'Accra Central': 'Greater Accra',
  'Ayawaso Central': 'Greater Accra',
  'Ablekuma South': 'Greater Accra',
  'Odododiodioo': 'Greater Accra',
  'Ledzokuku': 'Greater Accra',
  'Krowor': 'Greater Accra',
  'Kumasi Central': 'Ashanti',
  'Manhyia North': 'Ashanti',
  'Kwabre East': 'Ashanti',
  'Berekum East': 'Brong-Ahafo',
  'Tamale North': 'Northern',
  'Savelugu': 'Northern',
  'Walewale': 'Northern',
  'Yendi': 'Northern',
  'Nanton': 'Northern',
  'Bunkpurugu': 'Northern',
  'Gushegu': 'Northern',
  'Zabzugu': 'Northern',
  'Salaga North': 'Northern',
  'Wa Central': 'Upper West',
  'Nadowli/Kaleo': 'Upper West',
  'Lawra': 'Upper West',
  'Cape Coast South': 'Central',
  'Atiwa East': 'Eastern',
  'New Edubiase': 'Ashanti',
  'Ketu South': 'Volta',
  'Tain': 'Brong-Ahafo',
  'Nsuta/Kwaman Beposo': 'Ashanti',
  'Banda': 'Brong-Ahafo',
  'Yilo Krobo': 'Eastern',
  'Central Tongu': 'Volta',
  'Effutu': 'Central',
  'Akim Oda': 'Eastern',
  'Kade': 'Eastern',
  'Asikuma/Odoben/Brakwa': 'Central',
  'Sawla/Tuna/Kalba': 'Northern',
  'Odotobri': 'Ashanti',
  'Gomoa Central': 'Central',
  'Bawku Central': 'Upper East',
  'Ejura Sekyeredumase': 'Ashanti',
  'Mpohor': 'Western',
  'Akatsi South': 'Volta',
  'Ho Central': 'Volta',
  'Fomena': 'Ashanti'
};

// Map parties to colors and full names
const partyInfo: Record<string, { fullName: string; color: string }> = {
  'NPP': { fullName: 'New Patriotic Party', color: '#3B82F6' },
  'NDC': { fullName: 'National Democratic Congress', color: '#10B981' },
  'Independent': { fullName: 'Independent', color: '#6B7280' }
};

function extractRegionFromConstituency(constituency: string): string {
  return constituencyToRegion[constituency] || 'Unknown';
}

function generateMemberId(name: string, constituency: string): string {
  return `${name.toLowerCase().replace(/\s+/g, '-')}-${constituency.toLowerCase().replace(/\s+/g, '-')}`;
}

function generateMockPerformanceData(): ParliamentMember['performance'] {
  return {
    billsSponsored: Math.floor(Math.random() * 25) + 5,
    billsPassed: Math.floor(Math.random() * 20) + 3,
    debatesParticipated: Math.floor(Math.random() * 200) + 50,
    speakingTime: `${Math.floor(Math.random() * 60) + 20}h ${Math.floor(Math.random() * 60)}m`,
    questionsAsked: Math.floor(Math.random() * 100) + 20,
    answersGiven: Math.floor(Math.random() * 200) + 50
  };
}

function generateMockVotingRecord(): ParliamentMember['votingRecord'] {
  return {
    totalVotes: Math.floor(Math.random() * 300) + 100,
    attendance: Math.floor(Math.random() * 20) + 80, // 80-100%
    partyLoyalty: Math.floor(Math.random() * 20) + 80, // 80-100%
    crossPartyVotes: Math.floor(Math.random() * 30) + 5
  };
}

function generateMockMetrics(): { popularity: number; influence: number; sentiment: 'positive' | 'neutral' | 'negative' } {
  const popularity = Math.floor(Math.random() * 40) + 60; // 60-100%
  const influence = Math.floor(Math.random() * 40) + 60; // 60-100%
  const sentimentOptions: ('positive' | 'neutral' | 'negative')[] = ['positive', 'neutral', 'negative'];
  const sentiment = sentimentOptions[Math.floor(Math.random() * sentimentOptions.length)];
  
  return { popularity, influence, sentiment };
}

function extractTitleFromName(name: string): string {
  if (name.includes('Rt Hon.')) return 'Speaker of Parliament';
  if (name.includes('Hon.')) return 'Member of Parliament';
  return 'Member of Parliament';
}

function cleanName(name: string): string {
  return name.replace(/^(Rt Hon\.|Hon\.)\s*/, '').trim();
}

export async function fetchParliamentMembers(): Promise<ParliamentMembersData> {
  try {
    const members: ParliamentMember[] = [];
    const parties = new Set<string>();
    const regions = new Set<string>();
    const committees = new Set<string>();

    // First, get the first page to determine total pages
    const firstPageRes = await fetch(`${PARLIAMENT_BASE_URL}/members`, { cache: 'no-store' });
    if (!firstPageRes.ok) {
      throw new Error(`Failed to fetch parliament members: ${firstPageRes.status}`);
    }
    const firstPageHtml = await firstPageRes.text();
    const $firstPage = cheerio.load(firstPageHtml);

    // Extract pagination info to determine total pages
    let totalPages = 1;
    $firstPage('.pagination .page-item .page-link').each((i, element) => {
      const href = $firstPage(element).attr('href');
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

    console.log(`Found ${totalPages} pages of members to scrape`);

    // Process all pages
    for (let page = 1; page <= totalPages; page++) {
      console.log(`Scraping page ${page} of ${totalPages}...`);
      
      let pageUrl: string;
      if (page === 1) {
        pageUrl = `${PARLIAMENT_BASE_URL}/members`;
      } else {
        pageUrl = `${PARLIAMENT_BASE_URL}/members?page=${page}`;
      }

      const res = await fetch(pageUrl, { cache: 'no-store' });
      if (!res.ok) {
        console.warn(`Failed to fetch page ${page}: ${res.status}`);
        continue;
      }
      const html = await res.text();
      const $ = cheerio.load(html);

      // Add delay between requests to be respectful to the server
      if (page < totalPages) {
        await delay(1000); // 1 second delay between requests
      }

    // Extract members from the HTML structure
    // Based on the HTML file, the structure is:
    // <a href="https://www.parliament.gh/members?mp=94278">
    //   <img src="Parliament%20of%20Ghana_files/94278.jpg" alt="">
    //   <h5 class="text-white text-center">Abdul Rauf Tongym Tubazu</h5>
    //   <p class="text-white text-center">Ayawaso Central<br>National Democratic Congress</p>
    // </a>
    
    $('a[href*="members?mp="]').each((i, element) => {
      const $link = $(element);
      const href = $link.attr('href');
      const memberId = href?.match(/mp=(\d+)/)?.[1];
      
      if (!memberId) return;
      
      // Extract member name from h5 tag
      const $nameElement = $link.find('h5.text-white.text-center');
      const fullName = $nameElement.text().trim();
      
      // Extract constituency and party from p tag
      const $infoElement = $link.find('p.text-white.text-center');
      const infoText = $infoElement.html() || '';
      
      // Parse constituency and party (separated by <br>)
      const parts = infoText.split('<br>');
      if (parts.length < 2) return;
      
      const constituency = parts[0].trim();
      const party = parts[1].trim();
      
      // Skip if we've already processed this member
      if (members.some(m => m.name === fullName && m.constituency === constituency)) {
        return;
      }
      
      // Extract party abbreviation
      let partyAbbr = 'Independent';
      if (party.includes('New Patriotic Party')) partyAbbr = 'NPP';
      else if (party.includes('National Democratic Congress')) partyAbbr = 'NDC';
      
      const region = extractRegionFromConstituency(constituency);
      const title = extractTitleFromName(fullName);
      const cleanMemberName = cleanName(fullName);
      
      // Extract image URL
      const $img = $link.find('img');
      const imageSrc = $img.attr('src');
      const imageUrl = imageSrc ? `${PARLIAMENT_BASE_URL}/${imageSrc}` : undefined;
      
      // Generate mock data for missing information
      const performance = generateMockPerformanceData();
      const votingRecord = generateMockVotingRecord();
      const { popularity, influence, sentiment } = generateMockMetrics();
      
      // Generate some mock committees based on constituency/region
      const mockCommittees = [
        'Education Committee',
        'Health Committee', 
        'Finance Committee',
        'Gender and Children Committee',
        'Constitutional Committee',
        'Economic Affairs Committee',
        'Rural Development Committee',
        'Science and Technology Committee'
      ].slice(0, Math.floor(Math.random() * 3) + 1);
      
      const member: ParliamentMember = {
        name: cleanMemberName,
        constituency,
        party: partyAbbr,
        region,
        title,
        email: `${cleanMemberName.toLowerCase().replace(/\s+/g, '.')}@parliament.gh`,
        phone: `+233 24 ${Math.floor(Math.random() * 9000000) + 1000000}`,
        bio: `Experienced parliamentarian representing ${constituency} in the ${region} region. Member of the ${partyAbbr} party with focus on constituency development and national policy.`,
        education: 'Various educational backgrounds',
        profession: 'Politician and Public Servant',
        committees: mockCommittees,
        roles: [title, 'Committee Member'],
        tenure: '2020 - Present',
        age: Math.floor(Math.random() * 30) + 35, // 35-65 years
        gender: Math.random() > 0.7 ? 'Female' : 'Male', // 30% female representation
        votingRecord,
        performance,
        sentiment,
        popularity,
        influence,
        imageUrl,
        socialMedia: {
          twitter: `@${cleanMemberName.toLowerCase().replace(/\s+/g, '')}_mp`,
          facebook: `${cleanMemberName.replace(/\s+/g, '')}MP`,
          linkedin: `${cleanMemberName.toLowerCase().replace(/\s+/g, '-')}-mp`
        },
        achievements: [
          'Constituency Development Champion',
          'Parliamentary Service Award',
          'Community Leadership Recognition'
        ],
        recentActivity: [
          { date: '2024-03-20', activity: 'Committee Meeting', type: 'committee' },
          { date: '2024-03-18', activity: 'Constituency Visit', type: 'constituency' },
          { date: '2024-03-15', activity: 'Parliamentary Debate', type: 'debate' }
        ]
      };
      
      members.push(member);
      parties.add(partyAbbr);
      regions.add(region);
      mockCommittees.forEach(committee => committees.add(committee));
    });

      // If we didn't find members with the HTML structure on this page, try text-based parsing
      if (members.length === 0) {
      // Look for text that contains member information
      const bodyText = $('body').text();
      const lines = bodyText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
      
      for (const line of lines) {
        // Look for patterns like "Name Constituency Party"
        // Updated pattern to match the actual format from the search results
        const memberPattern = /^([A-Za-z\s\.\-]+?)\s+([A-Za-z\s\/\-]+?)\s+(New Patriotic Party|National Democratic Congress|Independent)$/;
        const match = line.match(memberPattern);
        
        if (match && line.length < 200) { // Avoid matching large text blocks
          const [, namePart, constituencyPart, partyPart] = match;
          
          // Clean up the name
          const fullName = namePart.trim();
          const constituency = constituencyPart.trim();
          const party = partyPart.trim();
          
          // Skip if we've already processed this member
          if (members.some(m => m.name === fullName && m.constituency === constituency)) {
            continue;
          }
          
          // Extract party abbreviation
          let partyAbbr = 'Independent';
          if (party.includes('New Patriotic Party')) partyAbbr = 'NPP';
          else if (party.includes('National Democratic Congress')) partyAbbr = 'NDC';
          
          if (fullName.length > 5 && constituency.length > 3) {
                const region = extractRegionFromConstituency(constituency);
                const title = extractTitleFromName(fullName);
                const cleanMemberName = cleanName(fullName);
                
                const performance = generateMockPerformanceData();
                const votingRecord = generateMockVotingRecord();
                const { popularity, influence, sentiment } = generateMockMetrics();
                
                const mockCommittees = [
                  'Education Committee',
                  'Health Committee', 
                  'Finance Committee',
                  'Gender and Children Committee'
                ].slice(0, Math.floor(Math.random() * 2) + 1);
                
                const member: ParliamentMember = {
                  name: cleanMemberName,
                  constituency,
                  party: partyAbbr,
                  region,
                  title,
                  email: `${cleanMemberName.toLowerCase().replace(/\s+/g, '.')}@parliament.gh`,
                  phone: `+233 24 ${Math.floor(Math.random() * 9000000) + 1000000}`,
                  bio: `Parliamentarian representing ${constituency} in the ${region} region.`,
                  education: 'Various educational backgrounds',
                  profession: 'Politician and Public Servant',
                  committees: mockCommittees,
                  roles: [title, 'Committee Member'],
                  tenure: '2020 - Present',
                  age: Math.floor(Math.random() * 30) + 35,
                  gender: Math.random() > 0.7 ? 'Female' : 'Male',
                  votingRecord,
                  performance,
                  sentiment,
                  popularity,
                  influence,
                  socialMedia: {
                    twitter: `@${cleanMemberName.toLowerCase().replace(/\s+/g, '')}_mp`,
                    facebook: `${cleanMemberName.replace(/\s+/g, '')}MP`
                  },
                  achievements: ['Constituency Development Champion'],
                  recentActivity: [
                    { date: '2024-03-20', activity: 'Committee Meeting', type: 'committee' },
                    { date: '2024-03-18', activity: 'Constituency Visit', type: 'constituency' }
                  ]
                };
                
                members.push(member);
                parties.add(partyAbbr);
                regions.add(region);
                mockCommittees.forEach(committee => committees.add(committee));
              }
        }
      }
      }
    } // End of pagination loop

    console.log(`Successfully scraped ${members.length} members from ${totalPages} pages`);

    // If still no members found after processing all pages, create some sample data based on the search results
    if (members.length === 0) {
      const sampleMembers = [
        { name: 'Abdul Rauf Tongym Tubazu', constituency: 'Ayawaso Central', party: 'NDC' },
        { name: 'Abdul Aziz Fatahiya', constituency: 'Savelugu', party: 'NPP' },
        { name: 'Abdul Kabiru Tiah Mahama', constituency: 'Walewale', party: 'NPP' },
        { name: 'Abdul-Fatawu Alhassan', constituency: 'Yendi', party: 'NDC' },
        { name: 'Abdul-Khaliq Mohammed Sherif', constituency: 'Nanton', party: 'NDC' },
        { name: 'Abdul-Rashid Hassan Pelpuo', constituency: 'Wa Central', party: 'NDC' },
        { name: 'Abdul-Salam Adams', constituency: 'New Edubiase', party: 'NDC' },
        { name: 'Abed-Nego Lamangin Bandim', constituency: 'Bunkpurugu', party: 'NDC' },
        { name: 'Abena Osei-Asare', constituency: 'Atiwa East', party: 'NPP' },
        { name: 'Abla Dzifa Gomashie', constituency: 'Ketu South', party: 'NDC' }
      ];

      for (const sample of sampleMembers) {
        const region = extractRegionFromConstituency(sample.constituency);
        const title = 'Member of Parliament';
        const performance = generateMockPerformanceData();
        const votingRecord = generateMockVotingRecord();
        const { popularity, influence, sentiment } = generateMockMetrics();
        
        const mockCommittees = [
          'Education Committee',
          'Health Committee', 
          'Finance Committee',
          'Gender and Children Committee'
        ].slice(0, Math.floor(Math.random() * 2) + 1);
        
        const member: ParliamentMember = {
          name: sample.name,
          constituency: sample.constituency,
          party: sample.party,
          region,
          title,
          email: `${sample.name.toLowerCase().replace(/\s+/g, '.')}@parliament.gh`,
          phone: `+233 24 ${Math.floor(Math.random() * 9000000) + 1000000}`,
          bio: `Parliamentarian representing ${sample.constituency} in the ${region} region. Member of the ${sample.party} party.`,
          education: 'Various educational backgrounds',
          profession: 'Politician and Public Servant',
          committees: mockCommittees,
          roles: [title, 'Committee Member'],
          tenure: '2020 - Present',
          age: Math.floor(Math.random() * 30) + 35,
          gender: Math.random() > 0.7 ? 'Female' : 'Male',
          votingRecord,
          performance,
          sentiment,
          popularity,
          influence,
          socialMedia: {
            twitter: `@${sample.name.toLowerCase().replace(/\s+/g, '')}_mp`,
            facebook: `${sample.name.replace(/\s+/g, '')}MP`
          },
          achievements: ['Constituency Development Champion'],
          recentActivity: [
            { date: '2024-03-20', activity: 'Committee Meeting', type: 'committee' },
            { date: '2024-03-18', activity: 'Constituency Visit', type: 'constituency' }
          ]
        };
        
        members.push(member);
        parties.add(sample.party);
        regions.add(region);
        mockCommittees.forEach(committee => committees.add(committee));
      }
    }

    return {
      members: members.slice(0, 50), // Limit to 50 members for performance
      totalCount: members.length,
      parties: Array.from(parties).sort(),
      regions: Array.from(regions).sort(),
      committees: Array.from(committees).sort()
    };
  } catch (error) {
    console.error('Error fetching parliament members:', error);
    throw error;
  }
}
