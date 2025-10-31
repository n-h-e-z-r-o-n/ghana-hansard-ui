'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  DocumentTextIcon,
  ClockIcon,
  UserGroupIcon,
  ChartBarIcon,
  EyeIcon,
  ShareIcon,
  ArrowDownTrayIcon,
  BellIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  PlayIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  AdjustmentsHorizontalIcon,
  TagIcon,
  CalendarIcon,
  FireIcon,
  StarIcon,
  HeartIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import dynamic from 'next/dynamic';
const Navigation = dynamic(() => import('../components/Navigation'), { ssr: false });
import VotesProceedingsFeed from '../components/VotesProceedingsFeed';
import ParliamentAgendaFeed from '../components/ParliamentAgendaFeed';
import ParliamentBillsFeed from '../components/ParliamentBillsFeed';

const categories = ['All', 'Education', 'Healthcare', 'Environment', 'Infrastructure', 'Economy', 'Security', 'Agriculture'];
const statuses = ['All', 'Introduced', 'In Progress', 'Passed', 'Failed', 'Withdrawn'];
const stages = ['All', 'Introduced', 'First Reading', 'Committee Review', 'Second Reading', 'Committee of the Whole', 'Third Reading', 'Royal Assent'];
const priorities = ['All', 'High', 'Medium', 'Low'];

export default function BillsPage() {
  const [bills, setBills] = useState<any[]>([]);
  const [filteredBills, setFilteredBills] = useState<any[]>([]);
  const [loadingLive, setLoadingLive] = useState(true);
  const [errorLive, setErrorLive] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedStage, setSelectedStage] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [sortBy, setSortBy] = useState('date');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBill, setSelectedBill] = useState<any | null>(null);

  const handleExport = () => {
    try {
      if (!filteredBills || filteredBills.length === 0) {
        alert('No bills to export. Adjust your filters or try again.');
        return;
      }
      const headers = [
        'title',
        'billNumber',
        'category',
        'status',
        'stage',
        'priority',
        'laidBy',
        'formattedLaidOn',
        'formattedGazettedOn',
        'url',
        'tags'
      ];

      const escapeCSV = (val: any) => {
        if (val === null || val === undefined) return '';
        const str = String(val);
        if (str.includes('"') || str.includes(',') || str.includes('\n')) {
          return '"' + str.replace(/"/g, '""') + '"';
        }
        return str;
      };

      const rows = filteredBills.map((b) => {
        const row = [
          b.title,
          b.billNumber,
          b.category,
          b.status,
          b.stage,
          b.priority,
          b.laidBy,
          b.formattedLaidOn,
          b.formattedGazettedOn,
          b.url,
          Array.isArray(b.tags) ? b.tags.join('|') : ''
        ];
        return row.map(escapeCSV).join(',');
      });

      const csv = [headers.join(','), ...rows].join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const ts = new Date().toISOString().replace(/[:.]/g, '-');
      a.href = url;
      a.download = `bills-export-${ts}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Export failed', e);
      alert('Failed to export bills. Please try again.');
    }
  };

  // Load live parliamentary bills (all pages)
  useEffect(() => {
    let cancelled = false;
    async function loadAllBills() {
      try {
        setLoadingLive(true);
        setErrorLive(null);
        // First fetch page 1 to get totalPages
        const res1 = await fetch(`/api/parliament/bills?page=1`, { cache: 'no-store' });
        const json1 = await res1.json();
        if (!res1.ok || !json1?.success) throw new Error(json1?.error || 'Failed to load bills');
        const { bills: firstPageBills, totalPages } = json1.data;

        let allBills = [...firstPageBills];
        // Fetch the remaining pages in parallel (if any)
        const pagePromises = [] as Promise<any>[];
        for (let p = 2; p <= totalPages; p++) {
          pagePromises.push(fetch(`/api/parliament/bills?page=${p}`, { cache: 'no-store' }).then(r => r.json()));
        }
        const pages = await Promise.all(pagePromises);
        pages.forEach(j => {
          if (j?.success && Array.isArray(j.data?.bills)) {
            allBills = allBills.concat(j.data.bills);
          }
        });

        if (!cancelled) {
          setBills(allBills);
          setFilteredBills(allBills);
        }
      } catch (e: unknown) {
        if (!cancelled) setErrorLive(e instanceof Error ? e.message : 'Failed to load parliament bills');
      } finally {
        if (!cancelled) setLoadingLive(false);
      }
    }
    loadAllBills();
    return () => { cancelled = true; };
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = bills.filter(bill => {
      const matchesSearch = bill.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           bill.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           bill.billNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           bill.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'All' || bill.category === selectedCategory;
      const matchesStatus = selectedStatus === 'All' || bill.status === selectedStatus.toLowerCase().replace(' ', '-');
      const matchesStage = selectedStage === 'All' || bill.stage === selectedStage;
      const matchesPriority = selectedPriority === 'All' || bill.priority === selectedPriority.toLowerCase();
      
      return matchesSearch && matchesCategory && matchesStatus && matchesStage && matchesPriority;
    });

    // Sort logic
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.formattedLaidOn).getTime() - new Date(a.formattedLaidOn).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        case 'status':
          return a.status.localeCompare(b.status);
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        default:
          return 0;
      }
    });

    setFilteredBills(filtered);
  }, [searchTerm, selectedCategory, selectedStatus, selectedStage, selectedPriority, sortBy, bills]);

  // Derived analytics for charts from filteredBills
  const billStatusData = useMemo(() => {
    const counts: Record<string, number> = { 'introduced': 0, 'in-progress': 0, 'passed': 0, 'failed': 0 };
    filteredBills.forEach(b => {
      if (counts[b.status] !== undefined) counts[b.status] += 1;
      else counts['introduced'] += 1; // fallback bucket
    });
    return [
      { name: 'Introduced', value: counts['introduced'], color: '#3B82F6' },
      { name: 'In Progress', value: counts['in-progress'], color: '#F59E0B' },
      { name: 'Passed', value: counts['passed'], color: '#10B981' },
      { name: 'Failed', value: counts['failed'], color: '#EF4444' },
    ];
  }, [filteredBills]);

  const billTrendData = useMemo(() => {
    // Build last 6 months window
    const now = new Date();
    const months: { key: string; label: string }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = d.toLocaleString('en-US', { month: 'short' });
      months.push({ key, label });
    }

    const counts = months.map(m => ({ month: m.label, introduced: 0, passed: 0, failed: 0 }));

    const monthKey = (isoDate: string) => {
      if (!isoDate) return '';
      // isoDate expected like 'YYYY-MM-DD'
      const [y, m] = isoDate.split('-');
      return `${y}-${m}`;
    };

    filteredBills.forEach(b => {
      const key = monthKey(b.formattedLaidOn);
      const idx = months.findIndex(m => m.key === key);
      if (idx >= 0) {
        counts[idx].introduced += 1;
        if (b.status === 'passed') counts[idx].passed += 1;
        if (b.status === 'failed') counts[idx].failed += 1;
      }
    });

    return counts;
  }, [filteredBills]);

  const topCategoriesData = useMemo(() => {
    const map = new Map<string, number>();
    filteredBills.forEach(b => {
      map.set(b.category, (map.get(b.category) || 0) + 1);
    });
    const arr = Array.from(map.entries()).map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    const max = arr[0]?.count || 1;
    return arr.map(item => ({ ...item, percent: Math.round((item.count / max) * 100) }));
  }, [filteredBills]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return 'text-green-600 bg-green-100';
      case 'in-progress': return 'text-blue-600 bg-blue-100';
      case 'failed': return 'text-red-600 bg-red-100';
      case 'introduced': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStageIcon = (stage: string) => {
    switch (stage) {
      case 'Introduced': return <DocumentTextIcon className="w-4 h-4" />;
      case 'First Reading': return <EyeIcon className="w-4 h-4" />;
      case 'Committee Review': return <UserGroupIcon className="w-4 h-4" />;
      case 'Second Reading': return <ChartBarIcon className="w-4 h-4" />;
      case 'Committee of the Whole': return <UserGroupIcon className="w-4 h-4" />;
      case 'Third Reading': return <CheckCircleIcon className="w-4 h-4" />;
      case 'Royal Assent': return <StarIcon className="w-4 h-4" />;
      default: return <ClockIcon className="w-4 h-4" />;
    }
  };

  return (
    <Navigation>
      <div className="p-6">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Bills & Legislation</h1>
              <p className="text-gray-600">Track, analyze, and monitor parliamentary legislation</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
                <BellIcon className="w-4 h-4" />
                <span>Alerts</span>
              </button>
              <button onClick={handleExport} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2 disabled:opacity-60" disabled={filteredBills.length === 0}>
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
                <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-3 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search bills, sponsors, or keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white text-gray-900 placeholder-gray-500 border border-gray-400 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                />
              </div>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-3 py-2 bg-gray-100 text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-200 flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <FunnelIcon className="w-4 h-4" />
              <span>Filters</span>
              {showFilters ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
            </button>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 bg-white text-gray-900 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
            >
              <option value="date">Sort by Date</option>
              <option value="title">Sort by Title</option>
              <option value="status">Sort by Status</option>
              <option value="priority">Sort by Priority</option>
            </select>
          </div>

          {/* Active filters (chips) */}
          {(searchTerm || selectedCategory !== 'All' || selectedStatus !== 'All' || selectedStage !== 'All' || selectedPriority !== 'All') && (
            <div className="mt-4 flex flex-wrap gap-2 text-sm">
              {searchTerm && (
                <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  Search: "{searchTerm}"
                  <button onClick={() => setSearchTerm('')} className="hover:text-blue-900">×</button>
                </span>
              )}
              {selectedCategory !== 'All' && (
                <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-gray-100 text-gray-800 border border-gray-300">
                  Category: {selectedCategory}
                  <button onClick={() => setSelectedCategory('All')} className="hover:text-gray-900">×</button>
                </span>
              )}
              {selectedStatus !== 'All' && (
                <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-gray-100 text-gray-800 border border-gray-300">
                  Status: {selectedStatus}
                  <button onClick={() => setSelectedStatus('All')} className="hover:text-gray-900">×</button>
                </span>
              )}
              {selectedStage !== 'All' && (
                <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-gray-100 text-gray-800 border border-gray-300">
                  Stage: {selectedStage}
                  <button onClick={() => setSelectedStage('All')} className="hover:text-gray-900">×</button>
                </span>
              )}
              {selectedPriority !== 'All' && (
                <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-gray-100 text-gray-800 border border-gray-300">
                  Priority: {selectedPriority}
                  <button onClick={() => setSelectedPriority('All')} className="hover:text-gray-900">×</button>
                </span>
              )}
            </div>
          )}

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
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
                    className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                  >
                    {statuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stage</label>
                  <select
                    value={selectedStage}
                    onChange={(e) => setSelectedStage(e.target.value)}
                    className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                  >
                    {stages.map(stage => (
                      <option key={stage} value={stage}>{stage}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    value={selectedPriority}
                    onChange={(e) => setSelectedPriority(e.target.value)}
                    className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                  >
                    {priorities.map(priority => (
                      <option key={priority} value={priority}>{priority}</option>
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
                <p className="text-sm font-medium text-gray-600">Total Bills</p>
                <p className="text-2xl font-bold text-gray-900">{filteredBills.length}</p>
              </div>
              <DocumentTextIcon className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Passed Bills</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredBills.filter(bill => bill.status === 'passed').length}
                </p>
              </div>
              <CheckCircleIcon className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredBills.filter(bill => bill.status === 'in-progress').length}
                </p>
              </div>
              <ClockIcon className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round((filteredBills.filter(bill => bill.status === 'passed').length / filteredBills.length) * 100) || 0}%
                </p>
              </div>
              <ChartBarIcon className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bills List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Bills</h2>
                <p className="text-sm text-gray-600">Showing {filteredBills.length} bills</p>
              </div>
              <div className="p-6">
                <ParliamentBillsFeed bills={filteredBills} />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Bill Status Distribution */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Bill Status</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={billStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      dataKey="value"
                    >
                      {billStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2">
                {billStatusData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-sm text-gray-600">{item.name}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bill Trends */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Bill Trends</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={billTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip />
                    <Area type="monotone" dataKey="introduced" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="passed" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="failed" stackId="1" stroke="#EF4444" fill="#EF4444" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Categories */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Categories</h3>
              <div className="space-y-3">
                {topCategoriesData.map((item, index) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{item.name}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${item.percent}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{item.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bill Detail Modal */}
        {selectedBill && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedBill.title}</h2>
                  <p className="text-sm text-gray-600">{selectedBill.billNumber}</p>
                </div>
                <button
                  onClick={() => setSelectedBill(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Bill Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedBill.status)}`}>
                        {selectedBill.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Stage:</span>
                      <span className="font-medium">{selectedBill.stage}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sponsor:</span>
                      <span className="font-medium">{selectedBill.sponsor} ({selectedBill.sponsorParty})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Committee:</span>
                      <span className="font-medium">{selectedBill.committee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Priority:</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(selectedBill.priority)}`}>
                        {selectedBill.priority}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Public Support:</span>
                      <span className="font-medium">{selectedBill.publicSupport}%</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Impact Assessment</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Budget:</span>
                      <span className="font-medium">{selectedBill.impact.budget}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Beneficiaries:</span>
                      <span className="font-medium">{selectedBill.impact.beneficiaries}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Regions:</span>
                      <span className="font-medium">{selectedBill.impact.regions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Timeline:</span>
                      <span className="font-medium">{selectedBill.impact.timeline}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Provisions</h3>
                <ul className="space-y-2">
                  {selectedBill.keyProvisions.map((provision, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-sm text-gray-700">{provision}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Legislative Timeline</h3>
                <div className="space-y-3">
                  {selectedBill.timeline.map((event, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        event.status === 'completed' ? 'bg-green-500' : 
                        event.status === 'in-progress' ? 'bg-yellow-500' : 'bg-gray-300'
                      }`}></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{event.event}</p>
                        <p className="text-xs text-gray-500">{new Date(event.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Voting Records</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{selectedBill.voting.firstReading.for}</p>
                    <p className="text-sm text-green-700">First Reading - For</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{selectedBill.voting.secondReading.for}</p>
                    <p className="text-sm text-blue-700">Second Reading - For</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">{selectedBill.voting.thirdReading.for}</p>
                    <p className="text-sm text-purple-700">Third Reading - For</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex space-x-4">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
                  <ArrowDownTrayIcon className="w-4 h-4" />
                  <span>Download Documents</span>
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
                  <ShareIcon className="w-4 h-4" />
                  <span>Share Bill</span>
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
                  <BellIcon className="w-4 h-4" />
                  <span>Set Alert</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        )}



        {/* Parliamentary Documents Section */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Votes & Proceedings Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Votes & Proceedings</h2>
              <p className="text-sm text-gray-600 mt-1">Official records of parliamentary sessions and voting</p>
            </div>
            <div className="h-96 overflow-y-auto">
              <div className="p-6">
                <VotesProceedingsFeed />
              </div>
            </div>
          </div>

          {/* Parliamentary Agenda Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Parliamentary Agenda</h2>
              <p className="text-sm text-gray-600 mt-1">Scheduled meetings and parliamentary business</p>
            </div>
            <div className="h-96 overflow-y-auto">
              <div className="p-6">
                <ParliamentAgendaFeed />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Navigation>
  );
}
