'use client';

import { useState, useEffect } from 'react';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  UserGroupIcon,
  ChartBarIcon,
  CalendarIcon,
  EyeIcon,
  ShareIcon,
  ArrowDownTrayIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  XMarkIcon,
  AdjustmentsHorizontalIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  StarIcon,
  HeartIcon,
  ThumbUpIcon,
  ThumbDownIcon,
  ClockIcon,
  DocumentTextIcon,
  MicrophoneIcon,
  FireIcon,
  TrophyIcon,
  UserIcon,
  BuildingOfficeIcon,
  FlagIcon
} from '@heroicons/react/24/outline';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, ScatterChart, Scatter, XAxis as ScatterXAxis, YAxis as ScatterYAxis } from 'recharts';
import Navigation from '../components/Navigation';

// Mock data for members
const mockMembers = [
  {
    id: '1',
    name: 'Rt Hon. Jane Smith',
    title: 'Speaker of Parliament',
    party: 'NPP',
    constituency: 'Accra Central',
    region: 'Greater Accra',
    email: 'jane.smith@parliament.gh',
    phone: '+233 24 123 4567',
    image: '/api/placeholder/150/150',
    bio: 'Experienced parliamentarian with 15 years of service. Former Minister of Education and advocate for youth development.',
    education: 'PhD in Political Science, University of Ghana',
    profession: 'Academic and Politician',
    committees: ['Education Committee', 'Constitutional Committee'],
    roles: ['Speaker', 'Committee Chair'],
    tenure: '2016 - Present',
    age: 52,
    gender: 'Female',
    votingRecord: {
      totalVotes: 245,
      attendance: 98.5,
      partyLoyalty: 95.2,
      crossPartyVotes: 12
    },
    performance: {
      billsSponsored: 18,
      billsPassed: 14,
      debatesParticipated: 156,
      speakingTime: '45h 30m',
      questionsAsked: 89,
      answersGiven: 234
    },
    socialMedia: {
      twitter: '@janesmith_mp',
      facebook: 'JaneSmithMP',
      linkedin: 'jane-smith-speaker'
    },
    achievements: [
      'Speaker of the Year 2023',
      'Education Reform Champion',
      'Youth Development Advocate'
    ],
    recentActivity: [
      { date: '2024-03-20', activity: 'Chaired Education Committee Meeting', type: 'committee' },
      { date: '2024-03-18', activity: 'Spoke on Healthcare Bill', type: 'debate' },
      { date: '2024-03-15', activity: 'Attended Constituency Meeting', type: 'constituency' }
    ],
    sentiment: 'positive',
    popularity: 87,
    influence: 92
  },
  {
    id: '2',
    name: 'Hon. David Johnson',
    title: 'Majority Leader',
    party: 'NPP',
    constituency: 'Kumasi Central',
    region: 'Ashanti',
    email: 'david.johnson@parliament.gh',
    phone: '+233 24 234 5678',
    image: '/api/placeholder/150/150',
    bio: 'Dynamic leader with strong economic background. Former banker and finance expert with focus on economic development.',
    education: 'MBA Finance, University of Cape Coast',
    profession: 'Banker and Politician',
    committees: ['Finance Committee', 'Economic Affairs Committee'],
    roles: ['Majority Leader', 'Committee Member'],
    tenure: '2012 - Present',
    age: 48,
    gender: 'Male',
    votingRecord: {
      totalVotes: 298,
      attendance: 96.8,
      partyLoyalty: 98.1,
      crossPartyVotes: 6
    },
    performance: {
      billsSponsored: 24,
      billsPassed: 19,
      debatesParticipated: 189,
      speakingTime: '52h 15m',
      questionsAsked: 67,
      answersGiven: 198
    },
    socialMedia: {
      twitter: '@davidjohnson_mp',
      facebook: 'DavidJohnsonMP',
      linkedin: 'david-johnson-leader'
    },
    achievements: [
      'Economic Policy Leader',
      'Finance Committee Chair',
      'Budget Reform Champion'
    ],
    recentActivity: [
      { date: '2024-03-19', activity: 'Led Budget Debate', type: 'debate' },
      { date: '2024-03-17', activity: 'Finance Committee Meeting', type: 'committee' },
      { date: '2024-03-14', activity: 'Constituency Town Hall', type: 'constituency' }
    ],
    sentiment: 'positive',
    popularity: 82,
    influence: 89
  },
  {
    id: '3',
    name: 'Dr. Sarah Williams',
    title: 'Minority Whip',
    party: 'NDC',
    constituency: 'Tamale North',
    region: 'Northern',
    email: 'sarah.williams@parliament.gh',
    phone: '+233 24 345 6789',
    image: '/api/placeholder/150/150',
    bio: 'Medical doctor and healthcare advocate. Strong voice for healthcare reform and rural development.',
    education: 'MD Medicine, University of Ghana Medical School',
    profession: 'Medical Doctor and Politician',
    committees: ['Health Committee', 'Rural Development Committee'],
    roles: ['Minority Whip', 'Committee Vice-Chair'],
    tenure: '2016 - Present',
    age: 45,
    gender: 'Female',
    votingRecord: {
      totalVotes: 267,
      attendance: 94.2,
      partyLoyalty: 92.3,
      crossPartyVotes: 18
    },
    performance: {
      billsSponsored: 16,
      billsPassed: 11,
      debatesParticipated: 178,
      speakingTime: '48h 20m',
      questionsAsked: 95,
      answersGiven: 156
    },
    socialMedia: {
      twitter: '@sarahwilliams_mp',
      facebook: 'SarahWilliamsMP',
      linkedin: 'sarah-williams-doctor'
    },
    achievements: [
      'Healthcare Reform Advocate',
      'Rural Health Champion',
      'Women in Politics Award'
    ],
    recentActivity: [
      { date: '2024-03-21', activity: 'Health Committee Hearing', type: 'committee' },
      { date: '2024-03-19', activity: 'Healthcare Bill Debate', type: 'debate' },
      { date: '2024-03-16', activity: 'Rural Health Outreach', type: 'constituency' }
    ],
    sentiment: 'positive',
    popularity: 85,
    influence: 78
  },
  {
    id: '4',
    name: 'Hon. Michael Brown',
    title: 'Minister of Education',
    party: 'NPP',
    constituency: 'Cape Coast South',
    region: 'Central',
    email: 'michael.brown@parliament.gh',
    phone: '+233 24 456 7890',
    image: '/api/placeholder/150/150',
    bio: 'Former university professor and education expert. Passionate about educational reform and teacher development.',
    education: 'PhD Education, University of Cambridge',
    profession: 'Professor and Politician',
    committees: ['Education Committee', 'Science and Technology Committee'],
    roles: ['Minister', 'Committee Member'],
    tenure: '2020 - Present',
    age: 55,
    gender: 'Male',
    votingRecord: {
      totalVotes: 189,
      attendance: 91.5,
      partyLoyalty: 97.8,
      crossPartyVotes: 4
    },
    performance: {
      billsSponsored: 12,
      billsPassed: 9,
      debatesParticipated: 134,
      speakingTime: '38h 45m',
      questionsAsked: 45,
      answersGiven: 167
    },
    socialMedia: {
      twitter: '@michaelbrown_mp',
      facebook: 'MichaelBrownMP',
      linkedin: 'michael-brown-education'
    },
    achievements: [
      'Education Reform Leader',
      'Teacher Development Champion',
      'Academic Excellence Award'
    ],
    recentActivity: [
      { date: '2024-03-22', activity: 'Education Policy Announcement', type: 'ministerial' },
      { date: '2024-03-20', activity: 'Education Committee Meeting', type: 'committee' },
      { date: '2024-03-18', activity: 'School Visit Program', type: 'constituency' }
    ],
    sentiment: 'positive',
    popularity: 79,
    influence: 85
  },
  {
    id: '5',
    name: 'Hon. Grace Mensah',
    title: 'MP',
    party: 'NDC',
    constituency: 'Ho Central',
    region: 'Volta',
    email: 'grace.mensah@parliament.gh',
    phone: '+233 24 567 8901',
    image: '/api/placeholder/150/150',
    bio: 'Young parliamentarian and women\'s rights advocate. Focus on gender equality and youth empowerment.',
    education: 'MSc Development Studies, University of Ghana',
    profession: 'Development Specialist and Politician',
    committees: ['Gender and Children Committee', 'Youth and Sports Committee'],
    roles: ['Committee Member', 'Women\'s Caucus Leader'],
    tenure: '2020 - Present',
    age: 38,
    gender: 'Female',
    votingRecord: {
      totalVotes: 201,
      attendance: 89.3,
      partyLoyalty: 88.7,
      crossPartyVotes: 23
    },
    performance: {
      billsSponsored: 8,
      billsPassed: 5,
      debatesParticipated: 112,
      speakingTime: '28h 15m',
      questionsAsked: 78,
      answersGiven: 89
    },
    socialMedia: {
      twitter: '@gracemensah_mp',
      facebook: 'GraceMensahMP',
      linkedin: 'grace-mensah-development'
    },
    achievements: [
      'Women\'s Rights Champion',
      'Youth Empowerment Leader',
      'Gender Equality Advocate'
    ],
    recentActivity: [
      { date: '2024-03-21', activity: 'Gender Committee Meeting', type: 'committee' },
      { date: '2024-03-18', activity: 'Women\'s Rights Debate', type: 'debate' },
      { date: '2024-03-15', activity: 'Youth Empowerment Workshop', type: 'constituency' }
    ],
    sentiment: 'positive',
    popularity: 76,
    influence: 72
  }
];

const parties = ['All', 'NPP', 'NDC', 'Independent'];
const regions = ['All', 'Greater Accra', 'Ashanti', 'Northern', 'Central', 'Volta', 'Western', 'Eastern', 'Upper East', 'Upper West', 'Brong-Ahafo'];
const committees = ['All', 'Education Committee', 'Health Committee', 'Finance Committee', 'Gender and Children Committee', 'Constitutional Committee', 'Economic Affairs Committee'];
const roles = ['All', 'Speaker', 'Majority Leader', 'Minority Whip', 'Minister', 'Committee Chair', 'Committee Member', 'MP'];

const partyData = [
  { name: 'NPP', value: 45, color: '#3B82F6' },
  { name: 'NDC', value: 40, color: '#10B981' },
  { name: 'Independent', value: 15, color: '#6B7280' }
];

const regionData = [
  { name: 'Greater Accra', value: 25, color: '#3B82F6' },
  { name: 'Ashanti', value: 20, color: '#10B981' },
  { name: 'Northern', value: 15, color: '#F59E0B' },
  { name: 'Central', value: 12, color: '#EF4444' },
  { name: 'Volta', value: 10, color: '#8B5CF6' },
  { name: 'Other', value: 18, color: '#6B7280' }
];

const performanceData = [
  { name: 'High Performers', value: 35, color: '#10B981' },
  { name: 'Average', value: 45, color: '#F59E0B' },
  { name: 'Low Performers', value: 20, color: '#EF4444' }
];

export default function MembersPage() {
  const [members, setMembers] = useState(mockMembers);
  const [filteredMembers, setFilteredMembers] = useState(mockMembers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedParty, setSelectedParty] = useState('All');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedCommittee, setSelectedCommittee] = useState('All');
  const [selectedRole, setSelectedRole] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  // Filter and search logic
  useEffect(() => {
    let filtered = members.filter(member => {
      const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           member.constituency.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           member.party.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           member.committees.some(committee => committee.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesParty = selectedParty === 'All' || member.party === selectedParty;
      const matchesRegion = selectedRegion === 'All' || member.region === selectedRegion;
      const matchesCommittee = selectedCommittee === 'All' || member.committees.includes(selectedCommittee);
      const matchesRole = selectedRole === 'All' || member.roles.includes(selectedRole);
      
      return matchesSearch && matchesParty && matchesRegion && matchesCommittee && matchesRole;
    });

    // Sort logic
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'attendance':
          return b.votingRecord.attendance - a.votingRecord.attendance;
        case 'popularity':
          return b.popularity - a.popularity;
        case 'influence':
          return b.influence - a.influence;
        case 'bills':
          return b.performance.billsSponsored - a.performance.billsSponsored;
        default:
          return 0;
      }
    });

    setFilteredMembers(filtered);
  }, [searchTerm, selectedParty, selectedRegion, selectedCommittee, selectedRole, sortBy, members]);

  const getPartyColor = (party: string) => {
    switch (party) {
      case 'NPP': return 'text-blue-600 bg-blue-100';
      case 'NDC': return 'text-green-600 bg-green-100';
      case 'Independent': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600 bg-green-100';
      case 'neutral': return 'text-yellow-600 bg-yellow-100';
      case 'negative': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <Navigation>
      <div className="p-6">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Parliamentary Members</h1>
              <p className="text-gray-600">Explore, analyze, and connect with parliamentary representatives</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
                <ShareIcon className="w-4 h-4" />
                <span>Export</span>
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
                <ArrowDownTrayIcon className="w-4 h-4" />
                <span>Download</span>
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search members, constituencies, or parties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
            >
              <FunnelIcon className="w-4 h-4" />
              <span>Filters</span>
              {showFilters ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
            </button>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="name">Sort by Name</option>
              <option value="attendance">Sort by Attendance</option>
              <option value="popularity">Sort by Popularity</option>
              <option value="influence">Sort by Influence</option>
              <option value="bills">Sort by Bills Sponsored</option>
            </select>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Party</label>
                  <select
                    value={selectedParty}
                    onChange={(e) => setSelectedParty(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {parties.map(party => (
                      <option key={party} value={party}>{party}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
                  <select
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {regions.map(region => (
                      <option key={region} value={region}>{region}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Committee</label>
                  <select
                    value={selectedCommittee}
                    onChange={(e) => setSelectedCommittee(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {committees.map(committee => (
                      <option key={committee} value={committee}>{committee}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {roles.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Members</p>
                <p className="text-2xl font-bold text-gray-900">{filteredMembers.length}</p>
              </div>
              <UserGroupIcon className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Attendance</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(filteredMembers.reduce((sum, member) => sum + member.votingRecord.attendance, 0) / filteredMembers.length) || 0}%
                </p>
              </div>
              <ChartBarIcon className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Female Members</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredMembers.filter(member => member.gender === 'Female').length}
                </p>
              </div>
              <HeartIcon className="w-8 h-8 text-pink-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Popularity</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(filteredMembers.reduce((sum, member) => sum + member.popularity, 0) / filteredMembers.length) || 0}%
                </p>
              </div>
              <StarIcon className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Members List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Members</h2>
                <p className="text-sm text-gray-600">Showing {filteredMembers.length} members</p>
              </div>
              <div className="divide-y divide-gray-200">
                {filteredMembers.map((member) => (
                  <div key={member.id} className="p-6 hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedMember(member)}>
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                        <UserIcon className="w-8 h-8 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">{member.name}</h3>
                            <p className="text-sm text-gray-600">{member.title}</p>
                            <p className="text-sm text-gray-500">{member.constituency}, {member.region}</p>
                          </div>
                          <div className="flex flex-col items-end space-y-2">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPartyColor(member.party)}`}>
                              {member.party}
                            </span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSentimentColor(member.sentiment)}`}>
                              {member.popularity}% popular
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{member.bio}</p>
                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                          <span className="flex items-center">
                            <ClockIcon className="w-4 h-4 mr-1" />
                            {member.votingRecord.attendance}% attendance
                          </span>
                          <span className="flex items-center">
                            <DocumentTextIcon className="w-4 h-4 mr-1" />
                            {member.performance.billsSponsored} bills
                          </span>
                          <span className="flex items-center">
                            <MicrophoneIcon className="w-4 h-4 mr-1" />
                            {member.performance.debatesParticipated} debates
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {member.committees.slice(0, 2).map((committee, index) => (
                            <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                              {committee}
                            </span>
                          ))}
                          {member.committees.length > 2 && (
                            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                              +{member.committees.length - 2} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Party Distribution */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Party Distribution</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={partyData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      dataKey="value"
                    >
                      {partyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2">
                {partyData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-sm text-gray-600">{item.name}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Regional Distribution */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Regional Distribution</h3>
              <div className="space-y-3">
                {regionData.map((region, index) => (
                  <div key={region.name} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{region.name}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full" 
                          style={{ width: `${region.value}%`, backgroundColor: region.color }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{region.value}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Analysis */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Analysis</h3>
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Member Detail Modal */}
        {selectedMember && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                      <UserIcon className="w-10 h-10 text-gray-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{selectedMember.name}</h2>
                      <p className="text-sm text-gray-600">{selectedMember.title}</p>
                      <p className="text-sm text-gray-500">{selectedMember.constituency}, {selectedMember.region}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedMember(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Party:</span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPartyColor(selectedMember.party)}`}>
                          {selectedMember.party}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Age:</span>
                        <span className="font-medium">{selectedMember.age}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Gender:</span>
                        <span className="font-medium">{selectedMember.gender}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tenure:</span>
                        <span className="font-medium">{selectedMember.tenure}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Education:</span>
                        <span className="font-medium text-right">{selectedMember.education}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Profession:</span>
                        <span className="font-medium">{selectedMember.profession}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Attendance:</span>
                        <span className="font-medium">{selectedMember.votingRecord.attendance}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Bills Sponsored:</span>
                        <span className="font-medium">{selectedMember.performance.billsSponsored}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Bills Passed:</span>
                        <span className="font-medium">{selectedMember.performance.billsPassed}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Debates Participated:</span>
                        <span className="font-medium">{selectedMember.performance.debatesParticipated}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Speaking Time:</span>
                        <span className="font-medium">{selectedMember.performance.speakingTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Popularity:</span>
                        <span className="font-medium">{selectedMember.popularity}%</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Committees & Roles</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Committees</h4>
                      <ul className="space-y-1">
                        {selectedMember.committees.map((committee, index) => (
                          <li key={index} className="text-sm text-gray-600">• {committee}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Roles</h4>
                      <ul className="space-y-1">
                        {selectedMember.roles.map((role, index) => (
                          <li key={index} className="text-sm text-gray-600">• {role}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <EnvelopeIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{selectedMember.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <PhoneIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{selectedMember.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPinIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{selectedMember.constituency}, {selectedMember.region}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {selectedMember.recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{activity.activity}</p>
                          <p className="text-xs text-gray-500">{new Date(activity.date).toLocaleDateString()}</p>
                        </div>
                        <span className="text-xs text-gray-500 capitalize">{activity.type}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex space-x-4">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
                    <EnvelopeIcon className="w-4 h-4" />
                    <span>Contact</span>
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
                    <ShareIcon className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
                    <ArrowDownTrayIcon className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Navigation>
  );
}
