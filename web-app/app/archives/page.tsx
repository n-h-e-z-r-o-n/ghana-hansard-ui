'use client';

import { useState, useEffect } from 'react';
import { 
  ArchiveBoxIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  DocumentTextIcon,
  VideoCameraIcon,
  SpeakerWaveIcon,
  CalendarIcon,
  ClockIcon,
  UserGroupIcon,
  TagIcon,
  ArrowDownTrayIcon,
  ShareIcon,
  EyeIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  XMarkIcon,
  PlayIcon,
  DocumentIcon,
  PhotoIcon,
  MicrophoneIcon,
  BuildingOfficeIcon,
  FlagIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  HeartIcon,
  StarIcon,
  FireIcon,
  TrophyIcon,
  AdjustmentsHorizontalIcon,
  PlusIcon,
  BookOpenIcon,
  NewspaperIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import Navigation from '../components/Navigation';

// Mock data for archives
const mockArchives = [
  {
    id: '1',
    title: 'Constitution of Ghana 1992',
    type: 'constitution',
    category: 'Legal Documents',
    date: '1992-04-28',
    year: 1992,
    description: 'The Constitution of the Fourth Republic of Ghana, establishing the framework for democratic governance.',
    author: 'Constitutional Assembly',
    language: 'English',
    pages: 156,
    fileSize: '2.3 MB',
    format: 'PDF',
    status: 'public',
    tags: ['Constitution', 'Legal', 'Democracy', 'Governance', '1992'],
    keywords: ['constitution', 'democracy', 'governance', 'legal framework'],
    collection: 'Foundational Documents',
    accessLevel: 'Public',
    downloadCount: 15420,
    viewCount: 89230,
    rating: 4.8,
    thumbnail: '/api/placeholder/200/280',
    preview: 'We, the People of Ghana, in exercise of our natural and inalienable right to establish a framework of government...',
    relatedDocuments: ['2', '3', '4'],
    media: {
      audio: null,
      video: null,
      images: ['/api/placeholder/400/300']
    },
    metadata: {
      parliament: '1st Parliament',
      session: 'Constitutional Assembly',
      committee: 'Constitutional Review Committee',
      reference: 'CONST-1992-001'
    }
  },
  {
    id: '2',
    title: 'Hansard - First Parliament Session 1993',
    type: 'hansard',
    category: 'Parliamentary Records',
    date: '1993-01-07',
    year: 1993,
    description: 'Official record of the first session of the First Parliament of the Fourth Republic.',
    author: 'Parliament of Ghana',
    language: 'English',
    pages: 89,
    fileSize: '1.8 MB',
    format: 'PDF',
    status: 'public',
    tags: ['Hansard', 'Parliament', 'First Session', '1993', 'Historical'],
    keywords: ['hansard', 'parliament', 'session', 'debate', 'first republic'],
    collection: 'Parliamentary Records',
    accessLevel: 'Public',
    downloadCount: 8930,
    viewCount: 45670,
    rating: 4.6,
    thumbnail: '/api/placeholder/200/280',
    preview: 'The Speaker took the Chair and read prayers. The House then proceeded to the transaction of business...',
    relatedDocuments: ['1', '5', '6'],
    media: {
      audio: '/api/placeholder/audio/session-1.mp3',
      video: null,
      images: ['/api/placeholder/400/300', '/api/placeholder/400/300']
    },
    metadata: {
      parliament: '1st Parliament',
      session: 'First Session',
      committee: 'Plenary',
      reference: 'HANS-1993-001'
    }
  },
  {
    id: '3',
    title: 'Budget Statement 2000',
    type: 'budget',
    category: 'Financial Documents',
    date: '2000-02-15',
    year: 2000,
    description: 'Annual Budget Statement and Economic Policy of the Government of Ghana for the year 2000.',
    author: 'Ministry of Finance',
    language: 'English',
    pages: 234,
    fileSize: '4.1 MB',
    format: 'PDF',
    status: 'public',
    tags: ['Budget', 'Finance', 'Economic Policy', '2000', 'Government'],
    keywords: ['budget', 'finance', 'economic policy', 'government', 'fiscal'],
    collection: 'Budget Documents',
    accessLevel: 'Public',
    downloadCount: 12340,
    viewCount: 67890,
    rating: 4.4,
    thumbnail: '/api/placeholder/200/280',
    preview: 'Mr. Speaker, I beg to move, that this Honourable House approves the Financial Policy of the Government...',
    relatedDocuments: ['1', '7', '8'],
    media: {
      audio: '/api/placeholder/audio/budget-2000.mp3',
      video: '/api/placeholder/video/budget-2000.mp4',
      images: ['/api/placeholder/400/300']
    },
    metadata: {
      parliament: '2nd Parliament',
      session: 'Budget Session',
      committee: 'Finance Committee',
      reference: 'BUDG-2000-001'
    }
  },
  {
    id: '4',
    title: 'Committee Report on Education Reform 2005',
    type: 'report',
    category: 'Committee Reports',
    date: '2005-06-20',
    year: 2005,
    description: 'Comprehensive report on education sector reforms and recommendations for improvement.',
    author: 'Education Committee',
    language: 'English',
    pages: 178,
    fileSize: '3.2 MB',
    format: 'PDF',
    status: 'public',
    tags: ['Education', 'Reform', 'Committee Report', '2005', 'Policy'],
    keywords: ['education', 'reform', 'committee', 'policy', 'recommendations'],
    collection: 'Committee Reports',
    accessLevel: 'Public',
    downloadCount: 5670,
    viewCount: 23450,
    rating: 4.2,
    thumbnail: '/api/placeholder/200/280',
    preview: 'The Education Committee presents its findings and recommendations on the state of education in Ghana...',
    relatedDocuments: ['2', '9', '10'],
    media: {
      audio: null,
      video: null,
      images: ['/api/placeholder/400/300', '/api/placeholder/400/300']
    },
    metadata: {
      parliament: '3rd Parliament',
      session: 'Committee Session',
      committee: 'Education Committee',
      reference: 'REPT-2005-EDU-001'
    }
  },
  {
    id: '5',
    title: 'Parliamentary Debates - Healthcare Bill 2010',
    type: 'debate',
    category: 'Parliamentary Records',
    date: '2010-03-15',
    year: 2010,
    description: 'Full transcript of parliamentary debates on the National Health Insurance Bill.',
    author: 'Parliament of Ghana',
    language: 'English',
    pages: 145,
    fileSize: '2.7 MB',
    format: 'PDF',
    status: 'public',
    tags: ['Healthcare', 'Debate', 'Health Insurance', '2010', 'Bill'],
    keywords: ['healthcare', 'debate', 'health insurance', 'bill', 'parliament'],
    collection: 'Parliamentary Debates',
    accessLevel: 'Public',
    downloadCount: 7890,
    viewCount: 34560,
    rating: 4.5,
    thumbnail: '/api/placeholder/200/280',
    preview: 'The House resumed consideration of the National Health Insurance Bill. The Minister of Health...',
    relatedDocuments: ['2', '11', '12'],
    media: {
      audio: '/api/placeholder/audio/healthcare-debate.mp3',
      video: '/api/placeholder/video/healthcare-debate.mp4',
      images: ['/api/placeholder/400/300']
    },
    metadata: {
      parliament: '4th Parliament',
      session: 'Plenary Session',
      committee: 'Health Committee',
      reference: 'DEBT-2010-HEA-001'
    }
  }
];

const documentTypes = ['All', 'constitution', 'hansard', 'budget', 'report', 'debate', 'bill', 'motion', 'resolution'];
const categories = ['All', 'Legal Documents', 'Parliamentary Records', 'Financial Documents', 'Committee Reports', 'Government Papers', 'Historical Records'];
const collections = ['All', 'Foundational Documents', 'Parliamentary Records', 'Budget Documents', 'Committee Reports', 'Parliamentary Debates', 'Legal Framework'];
const accessLevels = ['All', 'Public', 'Restricted', 'Confidential'];
const years = ['All', '1992', '1993', '2000', '2005', '2010', '2015', '2020', '2024'];

const typeData = [
  { name: 'Parliamentary Records', value: 35, color: '#3B82F6' },
  { name: 'Legal Documents', value: 20, color: '#10B981' },
  { name: 'Financial Documents', value: 15, color: '#F59E0B' },
  { name: 'Committee Reports', value: 20, color: '#EF4444' },
  { name: 'Other', value: 10, color: '#8B5CF6' }
];

const yearlyData = [
  { year: '1992', documents: 5, downloads: 1200 },
  { year: '1993', documents: 8, downloads: 1800 },
  { year: '2000', documents: 12, downloads: 2500 },
  { year: '2005', documents: 15, downloads: 3200 },
  { year: '2010', documents: 18, downloads: 4100 },
  { year: '2015', documents: 22, downloads: 5200 },
  { year: '2020', documents: 25, downloads: 6800 },
  { year: '2024', documents: 30, downloads: 8900 }
];

const collectionData = [
  { name: 'Parliamentary Records', value: 40, color: '#3B82F6' },
  { name: 'Legal Framework', value: 25, color: '#10B981' },
  { name: 'Budget Documents', value: 20, color: '#F59E0B' },
  { name: 'Committee Reports', value: 15, color: '#EF4444' }
];

export default function ArchivesPage() {
  const [archives, setArchives] = useState(mockArchives);
  const [filteredArchives, setFilteredArchives] = useState(mockArchives);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCollection, setSelectedCollection] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedAccess, setSelectedAccess] = useState('All');
  const [sortBy, setSortBy] = useState('date');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);

  // Filter and search logic
  useEffect(() => {
    let filtered = archives.filter(archive => {
      const matchesSearch = archive.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           archive.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           archive.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
                           archive.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesType = selectedType === 'All' || archive.type === selectedType;
      const matchesCategory = selectedCategory === 'All' || archive.category === selectedCategory;
      const matchesCollection = selectedCollection === 'All' || archive.collection === selectedCollection;
      const matchesYear = selectedYear === 'All' || archive.year.toString() === selectedYear;
      const matchesAccess = selectedAccess === 'All' || archive.accessLevel === selectedAccess;
      
      return matchesSearch && matchesType && matchesCategory && matchesCollection && matchesYear && matchesAccess;
    });

    // Sort logic
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        case 'downloads':
          return b.downloadCount - a.downloadCount;
        case 'views':
          return b.viewCount - a.viewCount;
        case 'rating':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

    setFilteredArchives(filtered);
  }, [searchTerm, selectedType, selectedCategory, selectedCollection, selectedYear, selectedAccess, sortBy, archives]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'constitution': return <FlagIcon className="w-5 h-5" />;
      case 'hansard': return <DocumentTextIcon className="w-5 h-5" />;
      case 'budget': return <ChartBarIcon className="w-5 h-5" />;
      case 'report': return <ClipboardDocumentListIcon className="w-5 h-5" />;
      case 'debate': return <MicrophoneIcon className="w-5 h-5" />;
      case 'bill': return <DocumentIcon className="w-5 h-5" />;
      default: return <ArchiveBoxIcon className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'constitution': return 'text-blue-600 bg-blue-100';
      case 'hansard': return 'text-green-600 bg-green-100';
      case 'budget': return 'text-yellow-600 bg-yellow-100';
      case 'report': return 'text-purple-600 bg-purple-100';
      case 'debate': return 'text-red-600 bg-red-100';
      case 'bill': return 'text-indigo-600 bg-indigo-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getAccessColor = (access: string) => {
    switch (access) {
      case 'Public': return 'text-green-600 bg-green-100';
      case 'Restricted': return 'text-yellow-600 bg-yellow-100';
      case 'Confidential': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getPopularDocuments = () => {
    return filteredArchives.sort((a, b) => b.downloadCount - a.downloadCount).slice(0, 5);
  };

  const getRecentDocuments = () => {
    return filteredArchives.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);
  };

  return (
    <Navigation>
      <div className="p-6">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Parliamentary Archives</h1>
              <p className="text-gray-600">Explore historical documents, records, and parliamentary materials</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
                <ShareIcon className="w-4 h-4" />
                <span>Share</span>
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
                <ArrowDownTrayIcon className="w-4 h-4" />
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
                  placeholder="Search documents, titles, or keywords..."
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
              <option value="title">Sort by Title</option>
              <option value="downloads">Sort by Downloads</option>
              <option value="views">Sort by Views</option>
              <option value="rating">Sort by Rating</option>
            </select>

            {/* View Mode */}
            <div className="flex border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 text-sm ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 text-sm ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                List
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Document Type</label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {documentTypes.map(type => (
                      <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                    ))}
                  </select>
                </div>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Collection</label>
                  <select
                    value={selectedCollection}
                    onChange={(e) => setSelectedCollection(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {collections.map(collection => (
                      <option key={collection} value={collection}>{collection}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Access Level</label>
                  <select
                    value={selectedAccess}
                    onChange={(e) => setSelectedAccess(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {accessLevels.map(access => (
                      <option key={access} value={access}>{access}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Documents</p>
                <p className="text-2xl font-bold text-gray-900">{filteredArchives.length}</p>
              </div>
              <ArchiveBoxIcon className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Downloads</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredArchives.reduce((sum, archive) => sum + archive.downloadCount, 0).toLocaleString()}
                </p>
              </div>
              <ArrowDownTrayIcon className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredArchives.reduce((sum, archive) => sum + archive.viewCount, 0).toLocaleString()}
                </p>
              </div>
              <EyeIcon className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Rating</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(filteredArchives.reduce((sum, archive) => sum + archive.rating, 0) / filteredArchives.length || 0).toFixed(1)}
                </p>
              </div>
              <StarIcon className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Documents Grid/List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Documents</h2>
                <p className="text-sm text-gray-600">Showing {filteredArchives.length} documents</p>
              </div>
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6 p-6' : 'divide-y divide-gray-200'}>
                {filteredArchives.map((archive) => (
                  <div key={archive.id} className={viewMode === 'grid' ? 'bg-gray-50 rounded-lg p-4 hover:bg-gray-100 cursor-pointer' : 'p-6 hover:bg-gray-50 cursor-pointer'} onClick={() => setSelectedDocument(archive)}>
                    {viewMode === 'grid' ? (
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-2">
                            {getTypeIcon(archive.type)}
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(archive.type)}`}>
                              {archive.type}
                            </span>
                          </div>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getAccessColor(archive.accessLevel)}`}>
                            {archive.accessLevel}
                          </span>
                        </div>
                        <div className="w-full h-32 bg-gray-200 rounded flex items-center justify-center">
                          <DocumentTextIcon className="w-8 h-8 text-gray-400" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 text-sm line-clamp-2">{archive.title}</h3>
                          <p className="text-xs text-gray-600 mt-1">{archive.year} • {archive.pages} pages</p>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{archive.description}</p>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{archive.downloadCount.toLocaleString()} downloads</span>
                          <span>{archive.rating}★</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                            {getTypeIcon(archive.type)}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-lg font-medium text-gray-900">{archive.title}</h3>
                              <p className="text-sm text-gray-600">{archive.description}</p>
                              <p className="text-sm text-gray-500">{formatDate(archive.date)} • {archive.pages} pages • {archive.fileSize}</p>
                            </div>
                            <div className="flex flex-col items-end space-y-2">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(archive.type)}`}>
                                {archive.type}
                              </span>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getAccessColor(archive.accessLevel)}`}>
                                {archive.accessLevel}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-6 text-sm text-gray-500 mb-3">
                            <span>{archive.downloadCount.toLocaleString()} downloads</span>
                            <span>{archive.viewCount.toLocaleString()} views</span>
                            <span>{archive.rating}★ rating</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {archive.tags.slice(0, 3).map((tag, index) => (
                              <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                                {tag}
                              </span>
                            ))}
                            {archive.tags.length > 3 && (
                              <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                                +{archive.tags.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Document Type Distribution */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Types</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={typeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      dataKey="value"
                    >
                      {typeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2">
                {typeData.map((item, index) => (
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

            {/* Yearly Trends */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Trends</h3>
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={yearlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="year" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip />
                    <Line type="monotone" dataKey="documents" stroke="#3B82F6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Collection Distribution */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Collections</h3>
              <div className="space-y-3">
                {collectionData.map((collection, index) => (
                  <div key={collection.name} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{collection.name}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full" 
                          style={{ width: `${collection.value}%`, backgroundColor: collection.color }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{collection.value}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Document Detail Modal */}
        {selectedDocument && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {getTypeIcon(selectedDocument.type)}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{selectedDocument.title}</h2>
                      <p className="text-sm text-gray-600">{selectedDocument.category} • {selectedDocument.year}</p>
                      <p className="text-sm text-gray-500">{formatDate(selectedDocument.date)} • {selectedDocument.pages} pages</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedDocument(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Information</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Type:</span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(selectedDocument.type)}`}>
                          {selectedDocument.type}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Category:</span>
                        <span className="font-medium">{selectedDocument.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Collection:</span>
                        <span className="font-medium">{selectedDocument.collection}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Author:</span>
                        <span className="font-medium">{selectedDocument.author}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Language:</span>
                        <span className="font-medium">{selectedDocument.language}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">File Size:</span>
                        <span className="font-medium">{selectedDocument.fileSize}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Format:</span>
                        <span className="font-medium">{selectedDocument.format}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Access Level:</span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getAccessColor(selectedDocument.accessLevel)}`}>
                          {selectedDocument.accessLevel}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Downloads:</span>
                        <span className="font-medium">{selectedDocument.downloadCount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Views:</span>
                        <span className="font-medium">{selectedDocument.viewCount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Rating:</span>
                        <span className="font-medium">{selectedDocument.rating}★</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Reference:</span>
                        <span className="font-medium text-xs">{selectedDocument.metadata.reference}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
                  <p className="text-gray-700">{selectedDocument.description}</p>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-700 italic">"{selectedDocument.preview}"</p>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedDocument.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex space-x-4">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
                    <ArrowDownTrayIcon className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
                    <EyeIcon className="w-4 h-4" />
                    <span>Preview</span>
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
