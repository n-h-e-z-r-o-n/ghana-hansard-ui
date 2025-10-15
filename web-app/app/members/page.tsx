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
  HandThumbUpIcon,
  HandThumbDownIcon,
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
import { ParliamentMember } from '../lib/parliamentMembersScraper';

// Custom hook for fetching parliament members
function useParliamentMembers() {
  const [members, setMembers] = useState<ParliamentMember[]>([]);
  const [parties, setParties] = useState<string[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  const [committees, setCommittees] = useState<string[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function loadMembers() {
      try {
        setLoading(true);
        const res = await fetch('/api/parliament/members', { cache: 'no-store' });
        const json = await res.json();
        if (!res.ok || !json?.success) throw new Error(json?.error || 'Failed to load members');
        if (!cancelled) {
          setMembers(json.data.members || []);
          setParties(['All', ...(json.data.parties || [])]);
          setRegions(['All', ...(json.data.regions || [])]);
          setCommittees(['All', ...(json.data.committees || [])]);
          setRoles(['All', ...(json.data.roles || [])]);
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Failed to load members');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadMembers();
    return () => { cancelled = true; };
  }, []);

  return { members, parties, regions, committees, roles, loading, error };
}

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
  const { members, parties, regions, committees, roles, loading, error } = useParliamentMembers();
  const [filteredMembers, setFilteredMembers] = useState<ParliamentMember[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedParty, setSelectedParty] = useState('All');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedCommittee, setSelectedCommittee] = useState('All');
  const [selectedRole, setSelectedRole] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedMember, setSelectedMember] = useState<ParliamentMember | null>(null);

  // Filter and search logic
  useEffect(() => {
    let filtered = members.filter(member => {
      const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           member.constituency.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           member.party.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (member.committees && member.committees.some(committee => committee.toLowerCase().includes(searchTerm.toLowerCase())));
      
      const matchesParty = selectedParty === 'All' || member.party === selectedParty;
      const matchesRegion = selectedRegion === 'All' || member.region === selectedRegion;
      const matchesCommittee = selectedCommittee === 'All' || (member.committees && member.committees.includes(selectedCommittee));
      const matchesRole = selectedRole === 'All' || (member.roles && member.roles.includes(selectedRole));
      
      return matchesSearch && matchesParty && matchesRegion && matchesCommittee && matchesRole;
    });

    // Sort logic
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'attendance':
          return (b.votingRecord?.attendance || 0) - (a.votingRecord?.attendance || 0);
        case 'popularity':
          return (b.popularity || 0) - (a.popularity || 0);
        case 'influence':
          return (b.influence || 0) - (a.influence || 0);
        case 'bills':
          return (b.performance?.billsSponsored || 0) - (a.performance?.billsSponsored || 0);
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

  // Show loading state
  if (loading) {
    return (
      <Navigation>
        <div className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </Navigation>
    );
  }

  // Show error state
  if (error) {
    return (
      <Navigation>
        <div className="p-6">
          <div className="text-center">
            <div className="text-red-600 mb-4">
              <UserGroupIcon className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to Load Members</h3>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </Navigation>
    );
  }

  return (
    <Navigation>
      <div className="p-6">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Parliamentary Members</h1>
              <p className="text-gray-600">Explore, analyze, and connect with parliamentary representatives from Parliament of Ghana</p>
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
                  {filteredMembers.length > 0 ? Math.round(filteredMembers.reduce((sum, member) => sum + (member.votingRecord?.attendance || 0), 0) / filteredMembers.length) : 0}%
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
                  {filteredMembers.length > 0 ? Math.round(filteredMembers.reduce((sum, member) => sum + (member.popularity || 0), 0) / filteredMembers.length) : 0}%
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
                {filteredMembers.map((member, index) => (
                  <div key={`${member.name}-${member.constituency}-${index}`} className="p-6 hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedMember(member)}>
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                        {member.imageUrl ? (
                          <img
                            src={member.imageUrl}
                            alt={member.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            onError={(e) => {
                              // If image fails to load, show a fallback
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        <div className={`w-full h-full bg-gray-200 flex items-center justify-center ${member.imageUrl ? 'hidden' : ''}`}>
                          <UserIcon className="w-8 h-8 text-gray-400" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">{member.name}</h3>
                            <p className="text-sm text-gray-600">{member.title || 'Member of Parliament'}</p>
                            <p className="text-sm text-gray-500">{member.constituency}, {member.region || 'Unknown'}</p>
                          </div>
                          <div className="flex flex-col items-end space-y-2">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPartyColor(member.party)}`}>
                              {member.party}
                            </span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSentimentColor(member.sentiment || 'neutral')}`}>
                              {member.popularity || 0}% popular
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{member.bio || 'Parliamentarian representing their constituency.'}</p>
                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                          <span className="flex items-center">
                            <ClockIcon className="w-4 h-4 mr-1" />
                            {member.votingRecord?.attendance || 0}% attendance
                          </span>
                          <span className="flex items-center">
                            <DocumentTextIcon className="w-4 h-4 mr-1" />
                            {member.performance?.billsSponsored || 0} bills
                          </span>
                          <span className="flex items-center">
                            <MicrophoneIcon className="w-4 h-4 mr-1" />
                            {member.performance?.debatesParticipated || 0} debates
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {member.committees && member.committees.slice(0, 2).map((committee, committeeIndex) => (
                            <span key={committeeIndex} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                              {committee}
                            </span>
                          ))}
                          {member.committees && member.committees.length > 2 && (
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
                    <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0">
                      {selectedMember.imageUrl ? (
                        <img
                          src={selectedMember.imageUrl}
                          alt={selectedMember.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={(e) => {
                            // If image fails to load, show a fallback
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <div className={`w-full h-full bg-gray-200 flex items-center justify-center ${selectedMember.imageUrl ? 'hidden' : ''}`}>
                        <UserIcon className="w-10 h-10 text-gray-400" />
                      </div>
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
                        <span className="font-medium">{selectedMember.age || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Gender:</span>
                        <span className="font-medium">{selectedMember.gender || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tenure:</span>
                        <span className="font-medium">{selectedMember.tenure || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Education:</span>
                        <span className="font-medium text-right">{selectedMember.education || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Profession:</span>
                        <span className="font-medium">{selectedMember.profession || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Attendance:</span>
                        <span className="font-medium">{selectedMember.votingRecord?.attendance || 0}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Bills Sponsored:</span>
                        <span className="font-medium">{selectedMember.performance?.billsSponsored || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Bills Passed:</span>
                        <span className="font-medium">{selectedMember.performance?.billsPassed || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Debates Participated:</span>
                        <span className="font-medium">{selectedMember.performance?.debatesParticipated || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Speaking Time:</span>
                        <span className="font-medium">{selectedMember.performance?.speakingTime || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Popularity:</span>
                        <span className="font-medium">{selectedMember.popularity || 0}%</span>
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
                        {selectedMember.committees && selectedMember.committees.length > 0 ? (
                          selectedMember.committees.map((committee, index) => (
                            <li key={index} className="text-sm text-gray-600">• {committee}</li>
                          ))
                        ) : (
                          <li className="text-sm text-gray-500">No committee information available</li>
                        )}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Roles</h4>
                      <ul className="space-y-1">
                        {selectedMember.roles && selectedMember.roles.length > 0 ? (
                          selectedMember.roles.map((role, index) => (
                            <li key={index} className="text-sm text-gray-600">• {role}</li>
                          ))
                        ) : (
                          <li className="text-sm text-gray-500">No role information available</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <EnvelopeIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{selectedMember.email || 'N/A'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <PhoneIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{selectedMember.phone || 'N/A'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPinIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{selectedMember.constituency}, {selectedMember.region || 'Unknown'}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {selectedMember.recentActivity && selectedMember.recentActivity.length > 0 ? (
                      selectedMember.recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{activity.activity}</p>
                            <p className="text-xs text-gray-500">{new Date(activity.date).toLocaleDateString()}</p>
                          </div>
                          <span className="text-xs text-gray-500 capitalize">{activity.type}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No recent activity information available</p>
                    )}
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
