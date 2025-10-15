'use client';

import { useState, useEffect } from 'react';
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
  ThumbUpIcon,
  ThumbDownIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import Navigation from '../components/Navigation';
import VotesProceedingsFeed from '../components/VotesProceedingsFeed';
import ParliamentAgendaFeed from '../components/ParliamentAgendaFeed';
import ParliamentBillsFeed from '../components/ParliamentBillsFeed';

// Mock data for bills
const mockBills = [
  {
    id: '1',
    title: 'Education Reform Act 2024',
    billNumber: 'HB-2024-001',
    category: 'Education',
    status: 'passed',
    stage: 'Royal Assent',
    introducedDate: '2024-01-15',
    lastUpdated: '2024-03-20',
    sponsor: 'Hon. Michael Brown',
    sponsorParty: 'NPP',
    description: 'Comprehensive education reform focusing on curriculum modernization, teacher training, and infrastructure development.',
    summary: 'This bill aims to modernize Ghana\'s education system through curriculum updates, enhanced teacher training programs, and improved school infrastructure.',
    keyProvisions: [
      'Mandatory digital literacy curriculum for all schools',
      'Teacher training program expansion',
      'Rural school infrastructure development',
      'Special needs education funding increase'
    ],
    impact: {
      budget: 'GHS 2.5 billion over 5 years',
      beneficiaries: '2.3 million students',
      regions: 'All 16 regions',
      timeline: '5-year implementation'
    },
    voting: {
      firstReading: { for: 145, against: 35, abstain: 10 },
      secondReading: { for: 138, against: 42, abstain: 10 },
      thirdReading: { for: 142, against: 38, abstain: 10 }
    },
    timeline: [
      { date: '2024-01-15', event: 'Introduced', status: 'completed' },
      { date: '2024-01-22', event: 'First Reading', status: 'completed' },
      { date: '2024-02-05', event: 'Committee Review', status: 'completed' },
      { date: '2024-02-20', event: 'Second Reading', status: 'completed' },
      { date: '2024-03-10', event: 'Committee of the Whole', status: 'completed' },
      { date: '2024-03-15', event: 'Third Reading', status: 'completed' },
      { date: '2024-03-20', event: 'Royal Assent', status: 'completed' }
    ],
    tags: ['Education', 'Reform', 'Infrastructure', 'Teachers'],
    priority: 'high',
    complexity: 'high',
    publicSupport: 78,
    mediaCoverage: 85,
    committee: 'Education Committee',
    relatedBills: ['HB-2024-002', 'HB-2024-015'],
    documents: [
      { name: 'Bill Text', type: 'PDF', size: '2.3 MB' },
      { name: 'Explanatory Memorandum', type: 'PDF', size: '1.1 MB' },
      { name: 'Committee Report', type: 'PDF', size: '3.2 MB' }
    ]
  },
  {
    id: '2',
    title: 'Healthcare Access Bill 2024',
    billNumber: 'HB-2024-002',
    category: 'Healthcare',
    status: 'in-progress',
    stage: 'Committee Review',
    introducedDate: '2024-02-01',
    lastUpdated: '2024-03-18',
    sponsor: 'Dr. Sarah Williams',
    sponsorParty: 'NDC',
    description: 'Legislation to expand healthcare access and improve medical services across Ghana.',
    summary: 'This bill focuses on universal healthcare coverage, medical equipment procurement, and healthcare worker training.',
    keyProvisions: [
      'Universal health insurance expansion',
      'Medical equipment procurement program',
      'Healthcare worker training initiatives',
      'Rural healthcare facility development'
    ],
    impact: {
      budget: 'GHS 1.8 billion over 3 years',
      beneficiaries: '5.2 million citizens',
      regions: 'All 16 regions',
      timeline: '3-year implementation'
    },
    voting: {
      firstReading: { for: 120, against: 60, abstain: 10 },
      secondReading: { for: 0, against: 0, abstain: 0 },
      thirdReading: { for: 0, against: 0, abstain: 0 }
    },
    timeline: [
      { date: '2024-02-01', event: 'Introduced', status: 'completed' },
      { date: '2024-02-08', event: 'First Reading', status: 'completed' },
      { date: '2024-02-15', event: 'Committee Review', status: 'in-progress' },
      { date: '2024-03-25', event: 'Second Reading', status: 'pending' },
      { date: '2024-04-10', event: 'Committee of the Whole', status: 'pending' },
      { date: '2024-04-20', event: 'Third Reading', status: 'pending' },
      { date: '2024-04-25', event: 'Royal Assent', status: 'pending' }
    ],
    tags: ['Healthcare', 'Universal Coverage', 'Medical Equipment', 'Training'],
    priority: 'high',
    complexity: 'medium',
    publicSupport: 65,
    mediaCoverage: 72,
    committee: 'Health Committee',
    relatedBills: ['HB-2024-001', 'HB-2024-008'],
    documents: [
      { name: 'Bill Text', type: 'PDF', size: '1.8 MB' },
      { name: 'Explanatory Memorandum', type: 'PDF', size: '0.9 MB' },
      { name: 'Impact Assessment', type: 'PDF', size: '2.1 MB' }
    ]
  },
  {
    id: '3',
    title: 'Climate Action Bill 2024',
    billNumber: 'HB-2024-003',
    category: 'Environment',
    status: 'passed',
    stage: 'Royal Assent',
    introducedDate: '2024-01-20',
    lastUpdated: '2024-03-15',
    sponsor: 'Hon. David Johnson',
    sponsorParty: 'NPP',
    description: 'Comprehensive climate action legislation with carbon reduction targets and renewable energy incentives.',
    summary: 'This bill establishes carbon emission reduction targets, renewable energy incentives, and environmental protection measures.',
    keyProvisions: [
      'Carbon emission reduction targets',
      'Renewable energy incentives',
      'Environmental protection measures',
      'Climate adaptation funding'
    ],
    impact: {
      budget: 'GHS 3.2 billion over 7 years',
      beneficiaries: 'All citizens',
      regions: 'All 16 regions',
      timeline: '7-year implementation'
    },
    voting: {
      firstReading: { for: 155, against: 25, abstain: 10 },
      secondReading: { for: 148, against: 32, abstain: 10 },
      thirdReading: { for: 152, against: 28, abstain: 10 }
    },
    timeline: [
      { date: '2024-01-20', event: 'Introduced', status: 'completed' },
      { date: '2024-01-27', event: 'First Reading', status: 'completed' },
      { date: '2024-02-10', event: 'Committee Review', status: 'completed' },
      { date: '2024-02-25', event: 'Second Reading', status: 'completed' },
      { date: '2024-03-05', event: 'Committee of the Whole', status: 'completed' },
      { date: '2024-03-10', event: 'Third Reading', status: 'completed' },
      { date: '2024-03-15', event: 'Royal Assent', status: 'completed' }
    ],
    tags: ['Environment', 'Climate Change', 'Renewable Energy', 'Carbon Reduction'],
    priority: 'high',
    complexity: 'high',
    publicSupport: 82,
    mediaCoverage: 78,
    committee: 'Environment Committee',
    relatedBills: ['HB-2024-004', 'HB-2024-012'],
    documents: [
      { name: 'Bill Text', type: 'PDF', size: '2.8 MB' },
      { name: 'Explanatory Memorandum', type: 'PDF', size: '1.3 MB' },
      { name: 'Environmental Impact Assessment', type: 'PDF', size: '4.1 MB' }
    ]
  }
];

const categories = ['All', 'Education', 'Healthcare', 'Environment', 'Infrastructure', 'Economy', 'Security', 'Agriculture'];
const statuses = ['All', 'Introduced', 'In Progress', 'Passed', 'Failed', 'Withdrawn'];
const stages = ['All', 'Introduced', 'First Reading', 'Committee Review', 'Second Reading', 'Committee of the Whole', 'Third Reading', 'Royal Assent'];
const priorities = ['All', 'High', 'Medium', 'Low'];

const billStatusData = [
  { name: 'Introduced', value: 15, color: '#3B82F6' },
  { name: 'In Progress', value: 8, color: '#F59E0B' },
  { name: 'Passed', value: 12, color: '#10B981' },
  { name: 'Failed', value: 3, color: '#EF4444' }
];

const billTrendData = [
  { month: 'Jan', introduced: 5, passed: 3, failed: 1 },
  { month: 'Feb', introduced: 7, passed: 4, failed: 0 },
  { month: 'Mar', introduced: 6, passed: 5, failed: 2 },
  { month: 'Apr', introduced: 8, passed: 3, failed: 1 },
  { month: 'May', introduced: 4, passed: 6, failed: 0 },
  { month: 'Jun', introduced: 9, passed: 4, failed: 1 }
];

export default function BillsPage() {
  const [bills, setBills] = useState(mockBills);
  const [filteredBills, setFilteredBills] = useState(mockBills);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedStage, setSelectedStage] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [sortBy, setSortBy] = useState('date');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);

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
          return new Date(b.introducedDate).getTime() - new Date(a.introducedDate).getTime();
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
                  placeholder="Search bills, sponsors, or keywords..."
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
              <option value="status">Sort by Status</option>
              <option value="priority">Sort by Priority</option>
            </select>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stage</label>
                  <select
                    value={selectedStage}
                    onChange={(e) => setSelectedStage(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <div className="divide-y divide-gray-200">
                {filteredBills.map((bill) => (
                  <div key={bill.id} className="p-6 hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedBill(bill)}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-medium text-gray-900">{bill.title}</h3>
                          <span className="text-sm text-gray-500">({bill.billNumber})</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{bill.summary}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <CalendarIcon className="w-4 h-4 mr-1" />
                            {new Date(bill.introducedDate).toLocaleDateString()}
                          </span>
                          <span className="flex items-center">
                            <UserGroupIcon className="w-4 h-4 mr-1" />
                            {bill.sponsor}
                          </span>
                          <span className="flex items-center">
                            <ChartBarIcon className="w-4 h-4 mr-1" />
                            {bill.publicSupport}% support
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(bill.status)}`}>
                          {bill.status}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(bill.priority)}`}>
                          {bill.priority} priority
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getStageIcon(bill.stage)}
                        <span className="text-sm text-gray-600">{bill.stage}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {bill.tags.map((tag, index) => (
                          <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
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
                {['Education', 'Healthcare', 'Environment', 'Infrastructure', 'Economy'].map((category, index) => (
                  <div key={category} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{category}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${80 - index * 15}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{8 - index * 2}</span>
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

        {/* Real Parliament Bills Section */}
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Live Parliamentary Bills</h2>
              <p className="text-sm text-gray-600 mt-1">Real-time bills from Parliament of Ghana</p>
            </div>
            <div className="h-96 overflow-y-auto">
              <div className="p-6">
                <ParliamentBillsFeed />
              </div>
            </div>
          </div>
        </div>

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
