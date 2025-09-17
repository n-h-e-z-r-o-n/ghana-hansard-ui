'use client';

import { useState, useEffect } from 'react';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  CalendarIcon,
  ClockIcon,
  SpeakerWaveIcon,
  EyeIcon,
  ShareIcon,
  ArrowDownTrayIcon,
  PlayIcon,
  PauseIcon,
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  ChartBarIcon,
  TagIcon,
  FireIcon,
  StarIcon,
  HeartIcon,
  ThumbUpIcon,
  ThumbDownIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  XMarkIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import Navigation from '../components/Navigation';

// Mock data for debates
const mockDebates = [
  {
    id: '1',
    title: 'Education Review Bill - Second Reading',
    category: 'Education',
    date: '2024-01-15',
    time: '14:30',
    duration: '2h 45m',
    status: 'completed',
    participants: 45,
    views: 1250,
    sentiment: 'positive',
    sentimentScore: 78,
    description: 'Comprehensive review of the education system focusing on funding allocation, teacher training, and infrastructure development.',
    keyPoints: [
      'Increased funding for rural schools',
      'Teacher training program expansion',
      'Digital infrastructure improvements',
      'Special needs education support'
    ],
    speakers: [
      { name: 'Rt Hon. Jane Smith', role: 'Speaker', party: 'NPP', speakingTime: '15m' },
      { name: 'Dr. Sarah Williams', role: 'Minority Whip', party: 'NDC', speakingTime: '12m' },
      { name: 'Hon. Michael Brown', role: 'Minister of Education', party: 'NPP', speakingTime: '18m' }
    ],
    votes: { for: 120, against: 45, abstain: 15 },
    tags: ['Education', 'Funding', 'Infrastructure', 'Teachers'],
    transcript: 'This is a sample transcript of the debate...',
    highlights: [
      { timestamp: '00:15:30', text: 'Key point about funding allocation', speaker: 'Rt Hon. Jane Smith' },
      { timestamp: '01:22:15', text: 'Important discussion on teacher training', speaker: 'Dr. Sarah Williams' }
    ]
  },
  {
    id: '2',
    title: 'Healthcare Funding Division',
    category: 'Healthcare',
    date: '2024-01-12',
    time: '10:00',
    duration: '3h 10m',
    status: 'completed',
    participants: 52,
    views: 2100,
    sentiment: 'mixed',
    sentimentScore: 45,
    description: 'Heated debate on healthcare funding allocation with strong opposition from minority party.',
    keyPoints: [
      'Universal health coverage expansion',
      'Budget allocation disputes',
      'Rural healthcare access',
      'Medical equipment procurement'
    ],
    speakers: [
      { name: 'Dr. Sarah Williams', role: 'Minority Whip', party: 'NDC', speakingTime: '20m' },
      { name: 'Hon. David Johnson', role: 'Majority Leader', party: 'NPP', speakingTime: '16m' },
      { name: 'Rt Hon. Jane Smith', role: 'Speaker', party: 'NPP', speakingTime: '14m' }
    ],
    votes: { for: 95, against: 78, abstain: 7 },
    tags: ['Healthcare', 'Funding', 'Universal Coverage', 'Budget'],
    transcript: 'This is a sample transcript of the healthcare debate...',
    highlights: [
      { timestamp: '00:45:20', text: 'Critical discussion on budget allocation', speaker: 'Dr. Sarah Williams' },
      { timestamp: '02:15:45', text: 'Response to funding concerns', speaker: 'Hon. David Johnson' }
    ]
  },
  {
    id: '3',
    title: 'Question Time: Finance Minister',
    category: 'Economy',
    date: '2024-01-08',
    time: '15:00',
    duration: '1h 30m',
    status: 'completed',
    participants: 38,
    views: 980,
    sentiment: 'neutral',
    sentimentScore: 52,
    description: 'Weekly question session covering inflation, economic growth, and tax policies.',
    keyPoints: [
      'Inflation rate discussion',
      'Economic growth projections',
      'Tax policy review',
      'Currency stability measures'
    ],
    speakers: [
      { name: 'Hon. Michael Brown', role: 'Finance Minister', party: 'NPP', speakingTime: '25m' },
      { name: 'Dr. Sarah Williams', role: 'Minority Whip', party: 'NDC', speakingTime: '18m' }
    ],
    votes: { for: 0, against: 0, abstain: 0 },
    tags: ['Economy', 'Finance', 'Inflation', 'Tax Policy'],
    transcript: 'This is a sample transcript of the question time...',
    highlights: [
      { timestamp: '00:20:10', text: 'Inflation rate analysis', speaker: 'Hon. Michael Brown' },
      { timestamp: '01:05:30', text: 'Economic growth projections', speaker: 'Hon. Michael Brown' }
    ]
  },
  {
    id: '4',
    title: 'Climate Change Action Bill',
    category: 'Environment',
    date: '2024-01-05',
    time: '11:00',
    duration: '2h 15m',
    status: 'completed',
    participants: 41,
    views: 1560,
    sentiment: 'positive',
    sentimentScore: 82,
    description: 'Comprehensive climate action legislation with bipartisan support.',
    keyPoints: [
      'Carbon emission reduction targets',
      'Renewable energy incentives',
      'Environmental protection measures',
      'International climate commitments'
    ],
    speakers: [
      { name: 'Hon. David Johnson', role: 'Majority Leader', party: 'NPP', speakingTime: '22m' },
      { name: 'Dr. Sarah Williams', role: 'Minority Whip', party: 'NDC', speakingTime: '19m' },
      { name: 'Rt Hon. Jane Smith', role: 'Speaker', party: 'NPP', speakingTime: '16m' }
    ],
    votes: { for: 145, against: 25, abstain: 10 },
    tags: ['Environment', 'Climate Change', 'Renewable Energy', 'Sustainability'],
    transcript: 'This is a sample transcript of the climate change debate...',
    highlights: [
      { timestamp: '00:30:45', text: 'Carbon reduction targets discussion', speaker: 'Hon. David Johnson' },
      { timestamp: '01:45:20', text: 'Renewable energy incentives', speaker: 'Dr. Sarah Williams' }
    ]
  },
  {
    id: '5',
    title: 'Infrastructure Development Bill',
    category: 'Infrastructure',
    date: '2024-01-03',
    time: '09:30',
    duration: '2h 30m',
    status: 'completed',
    participants: 48,
    views: 1890,
    sentiment: 'positive',
    sentimentScore: 71,
    description: 'Major infrastructure development initiative focusing on roads, bridges, and public transportation.',
    keyPoints: [
      'Road network expansion',
      'Bridge construction projects',
      'Public transportation improvements',
      'Rural connectivity enhancement'
    ],
    speakers: [
      { name: 'Hon. Michael Brown', role: 'Minister of Infrastructure', party: 'NPP', speakingTime: '28m' },
      { name: 'Dr. Sarah Williams', role: 'Minority Whip', party: 'NDC', speakingTime: '21m' },
      { name: 'Hon. David Johnson', role: 'Majority Leader', party: 'NPP', speakingTime: '17m' }
    ],
    votes: { for: 132, against: 38, abstain: 20 },
    tags: ['Infrastructure', 'Roads', 'Transportation', 'Development'],
    transcript: 'This is a sample transcript of the infrastructure debate...',
    highlights: [
      { timestamp: '00:25:15', text: 'Road network expansion plans', speaker: 'Hon. Michael Brown' },
      { timestamp: '01:30:40', text: 'Public transportation improvements', speaker: 'Dr. Sarah Williams' }
    ]
  }
];

const categories = ['All', 'Education', 'Healthcare', 'Economy', 'Environment', 'Infrastructure', 'Security', 'Agriculture'];
const statuses = ['All', 'Live', 'Completed', 'Scheduled'];
const sentiments = ['All', 'Positive', 'Mixed', 'Negative', 'Neutral'];

const sentimentData = [
  { name: 'Positive', value: 45, color: '#10B981' },
  { name: 'Mixed', value: 25, color: '#F59E0B' },
  { name: 'Neutral', value: 20, color: '#6B7280' },
  { name: 'Negative', value: 10, color: '#EF4444' }
];

const debateTrendData = [
  { month: 'Jan', debates: 12, duration: 28, participants: 45 },
  { month: 'Feb', debates: 15, duration: 32, participants: 52 },
  { month: 'Mar', debates: 18, duration: 35, participants: 48 },
  { month: 'Apr', debates: 14, duration: 30, participants: 41 },
  { month: 'May', debates: 16, duration: 33, participants: 50 },
  { month: 'Jun', debates: 20, duration: 38, participants: 55 }
];

export default function DebatesPage() {
  const [debates, setDebates] = useState(mockDebates);
  const [filteredDebates, setFilteredDebates] = useState(mockDebates);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedSentiment, setSelectedSentiment] = useState('All');
  const [sortBy, setSortBy] = useState('date');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDebate, setSelectedDebate] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Filter and search logic
  useEffect(() => {
    let filtered = debates.filter(debate => {
      const matchesSearch = debate.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           debate.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           debate.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'All' || debate.category === selectedCategory;
      const matchesStatus = selectedStatus === 'All' || debate.status === selectedStatus.toLowerCase();
      const matchesSentiment = selectedSentiment === 'All' || debate.sentiment === selectedSentiment.toLowerCase();
      
      return matchesSearch && matchesCategory && matchesStatus && matchesSentiment;
    });

    // Sort logic
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'duration':
          return parseFloat(b.duration.replace('h', '').replace('m', '')) - parseFloat(a.duration.replace('h', '').replace('m', ''));
        case 'views':
          return b.views - a.views;
        case 'sentiment':
          return b.sentimentScore - a.sentimentScore;
        default:
          return 0;
      }
    });

    setFilteredDebates(filtered);
  }, [searchTerm, selectedCategory, selectedStatus, selectedSentiment, sortBy, debates]);

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600 bg-green-100';
      case 'mixed': return 'text-yellow-600 bg-yellow-100';
      case 'negative': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'text-red-600 bg-red-100';
      case 'completed': return 'text-green-600 bg-green-100';
      case 'scheduled': return 'text-blue-600 bg-blue-100';
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
              <h1 className="text-2xl font-bold text-gray-900">Parliamentary Debates</h1>
              <p className="text-gray-600">Explore, analyze, and engage with parliamentary proceedings</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <ChartBarIcon className="w-5 h-5" />
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
                <ShareIcon className="w-4 h-4" />
                <span>Export</span>
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
                  placeholder="Search debates, topics, or speakers..."
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
              <option value="date">Sort by Date</option>
              <option value="duration">Sort by Duration</option>
              <option value="views">Sort by Views</option>
              <option value="sentiment">Sort by Sentiment</option>
            </select>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {statuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sentiment</label>
                  <select
                    value={selectedSentiment}
                    onChange={(e) => setSelectedSentiment(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {sentiments.map(sentiment => (
                      <option key={sentiment} value={sentiment}>{sentiment}</option>
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
                <p className="text-sm font-medium text-gray-600">Total Debates</p>
                <p className="text-2xl font-bold text-gray-900">{filteredDebates.length}</p>
              </div>
              <ChatBubbleLeftRightIcon className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredDebates.reduce((sum, debate) => sum + debate.views, 0).toLocaleString()}
                </p>
              </div>
              <EyeIcon className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Duration</p>
                <p className="text-2xl font-bold text-gray-900">2h 32m</p>
              </div>
              <ClockIcon className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Sentiment</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(filteredDebates.reduce((sum, debate) => sum + debate.sentimentScore, 0) / filteredDebates.length) || 0}%
                </p>
              </div>
              <HeartIcon className="w-8 h-8 text-red-600" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Debates List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Debates</h2>
                <p className="text-sm text-gray-600">Showing {filteredDebates.length} debates</p>
              </div>
              <div className="divide-y divide-gray-200">
                {filteredDebates.map((debate) => (
                  <div key={debate.id} className="p-6 hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedDebate(debate)}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">{debate.title}</h3>
                        <p className="text-sm text-gray-600 mb-3">{debate.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <CalendarIcon className="w-4 h-4 mr-1" />
                            {new Date(debate.date).toLocaleDateString()}
                          </span>
                          <span className="flex items-center">
                            <ClockIcon className="w-4 h-4 mr-1" />
                            {debate.duration}
                          </span>
                          <span className="flex items-center">
                            <UserGroupIcon className="w-4 h-4 mr-1" />
                            {debate.participants} participants
                          </span>
                          <span className="flex items-center">
                            <EyeIcon className="w-4 h-4 mr-1" />
                            {debate.views} views
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSentimentColor(debate.sentiment)}`}>
                          {debate.sentiment}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(debate.status)}`}>
                          {debate.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {debate.tags.map((tag, index) => (
                          <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                          <PlayIcon className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                          <ShareIcon className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                          <ArrowDownTrayIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Sentiment Analysis */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sentiment Analysis</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sentimentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      dataKey="value"
                    >
                      {sentimentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2">
                {sentimentData.map((item, index) => (
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

            {/* Debate Trends */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Debate Trends</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={debateTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip />
                    <Line type="monotone" dataKey="debates" stroke="#3B82F6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Categories */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Categories</h3>
              <div className="space-y-3">
                {['Education', 'Healthcare', 'Infrastructure', 'Environment', 'Economy'].map((category, index) => (
                  <div key={category} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{category}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${80 - index * 15}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{12 - index * 2}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Debate Detail Modal */}
        {selectedDebate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">{selectedDebate.title}</h2>
                <button
                  onClick={() => setSelectedDebate(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Debate Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium">{new Date(selectedDebate.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">{selectedDebate.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Participants:</span>
                      <span className="font-medium">{selectedDebate.participants}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Views:</span>
                      <span className="font-medium">{selectedDebate.views}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sentiment:</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSentimentColor(selectedDebate.sentiment)}`}>
                        {selectedDebate.sentiment} ({selectedDebate.sentimentScore}%)
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Points</h3>
                  <ul className="space-y-2">
                    {selectedDebate.keyPoints.map((point, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span className="text-sm text-gray-700">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Speakers</h3>
                <div className="space-y-3">
                  {selectedDebate.speakers.map((speaker, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{speaker.name}</p>
                        <p className="text-sm text-gray-600">{speaker.role} • {speaker.party}</p>
                      </div>
                      <span className="text-sm text-gray-500">{speaker.speakingTime}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Voting Results</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{selectedDebate.votes.for}</p>
                    <p className="text-sm text-green-700">For</p>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <p className="text-2xl font-bold text-red-600">{selectedDebate.votes.against}</p>
                    <p className="text-sm text-red-700">Against</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-600">{selectedDebate.votes.abstain}</p>
                    <p className="text-sm text-gray-700">Abstain</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex space-x-4">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
                  <PlayIcon className="w-4 h-4" />
                  <span>Play Recording</span>
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
                  <ArrowDownTrayIcon className="w-4 h-4" />
                  <span>Download</span>
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
                  <ShareIcon className="w-4 h-4" />
                  <span>Share</span>
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
