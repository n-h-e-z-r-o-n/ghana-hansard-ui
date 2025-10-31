'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
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
const mockArchives: any[] = [];

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loadedPages, setLoadedPages] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const cancelRef = useRef(false);
  const [selectedType, setSelectedType] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCollection, setSelectedCollection] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedAccess, setSelectedAccess] = useState('All');
  const [sortBy, setSortBy] = useState('date');
  const [viewMode, setViewMode] = useState('table');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any | null>(null);
  const [exporting, setExporting] = useState(false);
  const [sharing, setSharing] = useState(false);

  useEffect(() => {
    cancelRef.current = false;
    const run = async () => {
      try {
        setLoading(true);
        setError('');
        setArchives([] as any);
        setLoadedPages(0);
        setHasMore(true);
        let page = 0;
        while (!cancelRef.current) {
          const res = await fetch(`/api/parliament/archives?page=${page}`, { cache: 'no-store' });
          if (!res.ok) {
            setError('Failed to load some pages');
            break;
          }
          let data: { items: { link: string; title: string; year: string }[]; hasMore: boolean } = { items: [], hasMore: false } as any;
          try {
            data = await res.json();
          } catch {
            data = { items: [], hasMore: false } as any;
          }
          const items = data.items || [];
          if (items.length) {
            const normalized = items.map((d, idx) => ({
              id: `gh-${page * 50 + idx + 1}`,
              title: d.title,
              type: 'hansard',
              category: 'Parliamentary Records',
              date: d.year ? `${d.year}-01-01` : '1970-01-01',
              year: d.year ? parseInt(d.year) : 0,
              description: d.title,
              author: 'Parliament of Ghana',
              language: 'English',
              pages: 0,
              fileSize: '',
              format: 'PDF',
              status: 'public',
              tags: [],
              keywords: [],
              collection: 'Parliamentary Records',
              accessLevel: 'Public',
              downloadCount: 0,
              viewCount: 0,
              rating: 0,
              thumbnail: '',
              preview: '',
              relatedDocuments: [],
              media: { audio: null, video: null, images: [] },
              metadata: { parliament: '', session: '', committee: '', reference: '', link: d.link },
            }));
            setArchives(prev => ([...(prev as any[]), ...normalized] as any));
            setLoadedPages(page + 1);
          }
          if (!data.hasMore) {
            setHasMore(false);
            break;
          }
          page += 1;
        }
      } catch {
        setError('Failed to load archives');
      } finally {
        setLoading(false);
      }
    };
    run();
    return () => { cancelRef.current = true; };
  }, []);

  const loadNextPage = async () => {
    if (loading || !hasMore) return;
    try {
      setLoading(true);
      setError('');
      const page = loadedPages;
      const res = await fetch(`/api/parliament/archives?page=${page}`, { cache: 'no-store' });
      if (!res.ok) {
        setError('Failed to load more');
        return;
      }
      const data: { items: { link: string; title: string; year: string }[]; hasMore: boolean } = await res.json();
      const items = data.items || [];
      if (items.length) {
        const normalized = items.map((d, idx) => ({
          id: `gh-${page * 50 + idx + 1}`,
          title: d.title,
          type: 'hansard',
          category: 'Parliamentary Records',
          date: d.year ? `${d.year}-01-01` : '1970-01-01',
          year: d.year ? parseInt(d.year) : 0,
          description: d.title,
          author: 'Parliament of Ghana',
          language: 'English',
          pages: 0,
          fileSize: '',
          format: 'PDF',
          status: 'public',
          tags: [],
          keywords: [],
          collection: 'Parliamentary Records',
          accessLevel: 'Public',
          downloadCount: 0,
          viewCount: 0,
          rating: 0,
          thumbnail: '',
          preview: '',
          relatedDocuments: [],
          media: { audio: null, video: null, images: [] },
          metadata: { parliament: '', session: '', committee: '', reference: '', link: d.link },
        }));
        setArchives(prev => ([...(prev as any[]), ...normalized] as any));
        setLoadedPages(page + 1);
      }
      setHasMore(!!data.hasMore);
    } catch {
      setError('Failed to load more');
    } finally {
      setLoading(false);
    }
  };

  const stopLoading = () => {
    cancelRef.current = true;
  };

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
      default: return 'text-gray-800 bg-gray-100';
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

  const toCSV = (rows: any[]) => {
    const esc = (v: any) => {
      const s = v == null ? '' : String(v);
      const needs = /[",\n]/.test(s);
      return needs ? '"' + s.replace(/"/g, '""') + '"' : s;
    };
    const headers = ['Title', 'Year', 'Link'];
    const lines = [headers.join(',')];
    for (const r of rows) {
      const link = (r as any).metadata?.link || '';
      lines.push([esc(r.title), esc(r.year || ''), esc(link)].join(','));
    }
    return lines.join('\n');
  };

  const handleExport = async () => {
    if (exporting) return;
    try {
      setExporting(true);
      const rows = (filteredArchives as any[]);
      const csv = toCSV(rows);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const ts = new Date().toISOString().slice(0,10);
      a.href = url;
      a.download = `ghana-parliament-archives-${ts}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  };

  const handleShare = async () => {
    if (sharing) return;
    try {
      setSharing(true);
      const shareData = {
        title: 'Ghana Parliamentary Archives',
        text: `Explore ${filteredArchives.length} parliamentary documents`,
        url: typeof window !== 'undefined' ? window.location.href : ''
      } as any;
      if (typeof navigator !== 'undefined' && 'share' in navigator) {
        await (navigator as any).share(shareData);
        return;
      }
      if (typeof navigator !== 'undefined' && shareData.url) {
        const nav = navigator as Navigator & { clipboard?: Clipboard };
        if (nav.clipboard) {
          await nav.clipboard.writeText(shareData.url);
          alert('Link copied to clipboard');
          return;
        }
      }
      alert('Sharing not supported on this device');
    } finally {
      setSharing(false);
    }
  };

  const pieColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#14B8A6', '#F97316', '#6366F1'];

  const computedTypeData = useMemo(() => {
    const map = new Map<string, number>();
    for (const a of filteredArchives) {
      const key = a.category || a.type || 'Other';
      map.set(key, (map.get(key) || 0) + 1);
    }
    const arr = Array.from(map.entries()).map(([name, value], idx) => ({ name, value, color: pieColors[idx % pieColors.length] }));
    // limit to top 6 + "Other"
    arr.sort((a, b) => b.value - a.value);
    if (arr.length <= 7) return arr;
    const top = arr.slice(0, 6);
    const rest = arr.slice(6).reduce((s, x) => s + x.value, 0);
    top.push({ name: 'Other', value: rest, color: pieColors[6 % pieColors.length] });
    return top;
  }, [filteredArchives]);

  const computedYearlyData = useMemo(() => {
    const map = new Map<string, number>();
    for (const a of filteredArchives) {
      const y = a.year && a.year > 0 ? String(a.year) : '';
      if (!y) continue;
      map.set(y, (map.get(y) || 0) + 1);
    }
    const arr = Array.from(map.entries()).map(([year, documents]) => ({ year, documents }));
    arr.sort((a, b) => parseInt(a.year, 10) - parseInt(b.year, 10));
    return arr;
  }, [filteredArchives]);

  const computedCollectionData = useMemo(() => {
    const map = new Map<string, number>();
    for (const a of filteredArchives) {
      const key = a.collection || 'Other';
      map.set(key, (map.get(key) || 0) + 1);
    }
    const total = Array.from(map.values()).reduce((s, v) => s + v, 0) || 1;
    const arr = Array.from(map.entries()).map(([name, count], idx) => ({ name, value: Math.round((count / total) * 100), color: pieColors[idx % pieColors.length] }));
    arr.sort((a, b) => b.value - a.value);
    return arr;
  }, [filteredArchives]);

  return (
    <Navigation>
      <div className="p-6">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Parliamentary Archives</h1>
              <p className="text-gray-900">Explore historical documents, records, and parliamentary materials</p>
            </div>
            <div className="flex items-center space-x-4">
              <button onClick={handleShare} disabled={sharing} className={`px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2 ${sharing ? 'opacity-60 cursor-not-allowed text-gray-700' : 'text-gray-900'}`}>
                <ShareIcon className="w-4 h-4" />
                <span>{sharing ? 'Sharing…' : 'Share'}</span>
              </button>
              <button onClick={handleExport} disabled={exporting} className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${exporting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white`}>
                <ArrowDownTrayIcon className="w-4 h-4" />
                <span>{exporting ? 'Exporting…' : 'Export'}</span>
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
                <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-3 text-gray-700" />
                <input
                  type="text"
                  placeholder="Search documents, titles, or keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
            >
              <FunnelIcon className="w-4 h-4" />
              <span>Filters</span>
              {showFilters ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
            </button>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="date">Sort by Date</option>
              <option value="title">Sort by Title</option>
              <option value="downloads">Sort by Downloads</option>
              <option value="views">Sort by Views</option>
              <option value="rating">Sort by Rating</option>
            </select>

            {/* View Mode */}
            <div className="flex border border-gray-400 rounded-lg overflow-hidden bg-white shadow-sm">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 text-sm ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-800 hover:bg-gray-100'}`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 text-sm ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-800 hover:bg-gray-100'}`}
              >
                List
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-2 text-sm ${viewMode === 'table' ? 'bg-blue-600 text-white' : 'text-gray-800 hover:bg-gray-100'}`}
              >
                Table
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Document Type</label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {documentTypes.map(type => (
                      <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Category</label>
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
                  <label className="block text-sm font-medium text-gray-900 mb-2">Collection</label>
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
                  <label className="block text-sm font-medium text-gray-900 mb-2">Year</label>
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
                  <label className="block text-sm font-medium text-gray-900 mb-2">Access Level</label>
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
                <p className="text-sm font-medium text-gray-900">Total Documents</p>
                <p className="text-2xl font-bold text-gray-900">{filteredArchives.length}</p>
              </div>
              <ArchiveBoxIcon className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Total Downloads</p>
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
                <p className="text-sm font-medium text-gray-900">Total Views</p>
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
                <p className="text-sm font-medium text-gray-900">Avg. Rating</p>
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
                <p className="text-sm text-gray-900">
                  {loading ? `Loading… (pages: ${loadedPages}, fetched: ${archives.length})` : `Showing ${filteredArchives.length} documents • Fetched ${archives.length}`}
                </p>
                {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
                <div className="mt-2 flex gap-2">
                  {loading && <button onClick={stopLoading} className="px-3 py-1.5 text-xs border border-gray-300 rounded hover:bg-gray-50">Stop loading</button>}
                  {!loading && hasMore && <button onClick={loadNextPage} className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">Load more</button>}
                </div>
              </div>
              {viewMode === 'table' ? (
                <div className="p-6 overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">Title</th>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">Year</th>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">Link</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredArchives.map((archive, idx) => (
                        <tr key={`${archive.id}-${(archive as any).metadata?.link || ''}-${idx}`} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900 max-w-xl">
                            <a href={(archive as any).metadata?.link || '#'} target="_blank" rel="noopener noreferrer" className="hover:underline">
                              {archive.title}
                            </a>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{archive.year || '-'}</td>
                          <td className="px-4 py-3 text-sm">
                            <a
                              href={(archive as any).metadata?.link || '#'}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Open
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6 p-6' : 'divide-y divide-gray-200'}>
                  {filteredArchives.map((archive, idx) => (
                    <div key={`${archive.id}-${(archive as any).metadata?.link || ''}-${idx}`} className={viewMode === 'grid' ? 'bg-gray-50 rounded-lg p-4 hover:bg-gray-100 cursor-pointer' : 'p-6 hover:bg-gray-50 cursor-pointer'} onClick={() => setSelectedDocument(archive)}>
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
                            <h3 className="font-medium text-gray-900 text-sm line-clamp-2">
                              <a href={(archive as any).metadata?.link || '#'} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                {archive.title}
                              </a>
                            </h3>
                            <p className="text-xs text-gray-600 mt-1">{archive.year} • {archive.pages} pages</p>
                            <p className="text-xs text-gray-700 mt-1 line-clamp-2">{archive.description}</p>
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
                                <h3 className="text-lg font-medium text-gray-900">
                                  <a href={(archive as any).metadata?.link || '#'} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                    {archive.title}
                                  </a>
                                </h3>
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
              )}
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
                      data={computedTypeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      dataKey="value"
                    >
                      {computedTypeData.map((entry, index) => (
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
                  <LineChart data={computedYearlyData}>
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
                {computedCollectionData.map((collection, index) => (
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
