import { NextRequest, NextResponse } from 'next/server';
import { fetchParliamentMembers } from '../../../lib/parliamentMembersScraper';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const party = searchParams.get('party');
    const region = searchParams.get('region');
    const committee = searchParams.get('committee');
    const role = searchParams.get('role');
    const search = searchParams.get('search');

    console.log('Fetching parliament members...');
    const data = await fetchParliamentMembers();

    // Apply filters if provided
    let filteredMembers = data.members;

    if (party && party !== 'All') {
      filteredMembers = filteredMembers.filter(member => member.party === party);
    }

    if (region && region !== 'All') {
      filteredMembers = filteredMembers.filter(member => member.region === region);
    }

    if (committee && committee !== 'All') {
      filteredMembers = filteredMembers.filter(member => 
        member.committees?.includes(committee)
      );
    }

    if (role && role !== 'All') {
      filteredMembers = filteredMembers.filter(member => 
        member.roles?.includes(role)
      );
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredMembers = filteredMembers.filter(member =>
        member.name.toLowerCase().includes(searchLower) ||
        member.constituency.toLowerCase().includes(searchLower) ||
        member.party.toLowerCase().includes(searchLower) ||
        member.committees?.some(committee => committee.toLowerCase().includes(searchLower))
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        members: filteredMembers,
        totalCount: filteredMembers.length,
        parties: data.parties,
        regions: data.regions,
        committees: data.committees,
        roles: ['Speaker', 'Majority Leader', 'Minority Whip', 'Minister', 'Committee Chair', 'Committee Member', 'MP']
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in parliament members API:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch parliament members',
        data: null
      },
      { status: 500 }
    );
  }
}
