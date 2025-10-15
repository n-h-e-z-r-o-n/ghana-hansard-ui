// Direct test of the scraper functionality
const { fetchParliamentMembers } = require('./app/lib/parliamentMembersScraper.ts');

async function testScraperDirect() {
  try {
    console.log('Testing Parliament Members Scraper Directly...');
    console.log('==============================================');
    
    const result = await fetchParliamentMembers();
    
    console.log(`✅ Scraper Result: Success`);
    console.log(`📊 Total Members: ${result.members.length}`);
    console.log(`🏛️ Parties: ${result.parties.join(', ')}`);
    console.log(`🗺️ Regions: ${result.regions.slice(0, 5).join(', ')}...`);
    
    // Show first few members
    console.log('\n👥 First 5 Members:');
    result.members.slice(0, 5).forEach((member, index) => {
      console.log(`${index + 1}. ${member.name} - ${member.constituency} (${member.party})`);
    });
    
    // Show last few members
    console.log('\n👥 Last 5 Members:');
    result.members.slice(-5).forEach((member, index) => {
      console.log(`${result.members.length - 4 + index}. ${member.name} - ${member.constituency} (${member.party})`);
    });
    
    // Check for specific members from page 3
    const page3Members = result.members.filter(member => 
      member.name.includes('Emmanuel Kofi Ntekuni') ||
      member.name.includes('Emmanuel Kwaku Boam') ||
      member.name.includes('Emmanuel Tobbin') ||
      member.name.includes('Eric Afful') ||
      member.name.includes('Francis Asenso-Boakye')
    );
    
    if (page3Members.length > 0) {
      console.log('\n✅ Found members from page 3:');
      page3Members.forEach(member => {
        console.log(`   - ${member.name} (${member.constituency}) - ${member.party}`);
      });
    } else {
      console.log('\n⚠️ No members from page 3 found - pagination may not be working');
    }
    
    // Check for members with specific constituencies from page 3
    const page3Constituencies = result.members.filter(member => 
      member.constituency.includes('Pru West') ||
      member.constituency.includes('Pru-East') ||
      member.constituency.includes('Anyaa-Sowutuom') ||
      member.constituency.includes('Amenfi West') ||
      member.constituency.includes('Ashaiman')
    );
    
    if (page3Constituencies.length > 0) {
      console.log('\n✅ Found constituencies from page 3:');
      page3Constituencies.forEach(member => {
        console.log(`   - ${member.name} (${member.constituency}) - ${member.party}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Scraper Error:', error.message);
  }
}

testScraperDirect();
