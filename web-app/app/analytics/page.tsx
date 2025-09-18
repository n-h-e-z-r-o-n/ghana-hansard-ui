'use client';

import { useState, useEffect } from 'react';
import { 
  ChartBarIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  ShareIcon,
  CalendarIcon,
  ClockIcon,
  UserGroupIcon,
  DocumentTextIcon,
  MicrophoneIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  EyeIcon,
  FireIcon,
  StarIcon,
  TrophyIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  AdjustmentsHorizontalIcon,
  ArrowPathIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  AreaChart, 
  Area,
  ScatterChart,
  Scatter,
  XAxis as ScatterXAxis,
  YAxis as ScatterYAxis,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart
} from 'recharts';
import Navigation from '../components/Navigation';

// Mock data for analytics
const debateTrends = [
  { month: 'Jan', debates: 120, bills: 45, attendance: 85 },
  { month: 'Feb', debates: 160, bills: 65, attendance: 88 },
  { month: 'Mar', debates: 140, bills: 50, attendance: 82 },
  { month: 'Apr', debates: 170, bills: 55, attendance: 90 },
  { month: 'May', debates: 150, bills: 40, attendance: 87 },
  { month: 'Jun', debates: 130, bills: 35, attendance: 84 },
  { month: 'Jul', debates: 180, bills: 70, attendance: 92 },
  { month: 'Aug', debates: 165, bills: 60, attendance: 89 }
];

const sentimentAnalysis = [
  { name: 'Positive', value: 45, color: '#10B981' },
  { name: 'Neutral', value: 35, color: '#6B7280' },
  { name: 'Negative', value: 20, color: '#EF4444' }
];

const partyPerformance = [
  { party: 'NPP', debates: 85, bills: 32, attendance: 88, efficiency: 92 },
  { party: 'NDC', debates: 78, bills: 28, attendance: 85, efficiency: 89 },
  { party: 'Independent', debates: 17, bills: 5, attendance: 82, efficiency: 85 }
];

const topSpeakers = [
  { name: 'Rt Hon. Jane Smith', party: 'NPP', speakingTime: 45.5, debates: 24, efficiency: 95 },
  { name: 'Hon. David Johnson', party: 'NPP', speakingTime: 38.2, debates: 19, efficiency: 92 },
  { name: 'Dr. Sarah Williams', party: 'NDC', speakingTime: 35.8, debates: 17, efficiency: 88 },
  { name: 'Hon. Michael Brown', party: 'NPP', speakingTime: 32.1, debates: 15, efficiency: 85 },
  { name: 'Hon. Grace Mensah', party: 'NDC', speakingTime: 28.9, debates: 12, efficiency: 82 }
];

const committeeActivity = [
  { committee: 'Education', meetings: 15, bills: 8, efficiency: 92 },
  { committee: 'Health', meetings: 12, bills: 6, efficiency: 88 },
  { committee: 'Finance', meetings: 18, bills: 12, efficiency: 95 },
  { committee: 'Constitutional', meetings: 8, bills: 3, efficiency: 85 },
  { committee: 'Youth & Sports', meetings: 10, bills: 4, efficiency: 80 }
];

const votingPatterns = [
  { bill: 'Education Reform', npp: 45, ndc: 12, independent: 3, total: 60 },
  { bill: 'Healthcare Funding', npp: 38, ndc: 18, independent: 2, total: 58 },
  { bill: 'Infrastructure Bill', npp: 42, ndc: 15, independent: 4, total: 61 },
  { bill: 'Climate Change', npp: 35, ndc: 22, independent: 5, total: 62 },
  { bill: 'Economic Policy', npp: 48, ndc: 8, independent: 1, total: 57 }
];

const regionalDistribution = [
  { region: 'Greater Accra', members: 25, debates: 45, bills: 18 },
  { region: 'Ashanti', members: 20, debates: 38, bills: 15 },
  { region: 'Northern', members: 15, debates: 28, bills: 12 },
  { region: 'Central', members: 12, debates: 22, bills: 9 },
  { region: 'Volta', members: 10, debates: 18, bills: 7 },
  { region: 'Other', members: 18, debates: 32, bills: 14 }
];

const timeAnalysis = [
  { hour: '9:00', activity: 15 },
  { hour: '10:00', activity: 45 },
  { hour: '11:00', activity: 60 },
  { hour: '12:00', activity: 35 },
  { hour: '13:00', activity: 20 },
  { hour: '14:00', activity: 55 },
  { hour: '15:00', activity: 70 },
  { hour: '16:00', activity: 40 },
  { hour: '17:00', activity: 25 }
];

const efficiencyMetrics = [
  { category: 'Debate Efficiency', score: 88, trend: 'up' },
  { category: 'Bill Processing', score: 92, trend: 'up' },
  { category: 'Attendance Rate', score: 87, trend: 'down' },
  { category: 'Cross-party Collaboration', score: 75, trend: 'up' },
  { category: 'Public Engagement', score: 82, trend: 'up' }
];

const kpiData = [
  { title: 'Total Debates', value: '1,245', change: '+12%', trend: 'up', icon: MicrophoneIcon, color: 'blue' },
  { title: 'Bills Passed', value: '89', change: '+8%', trend: 'up', icon: DocumentTextIcon, color: 'green' },
  { title: 'Avg. Attendance', value: '87%', change: '-2%', trend: 'down', icon: UserGroupIcon, color: 'yellow' },
  { title: 'Efficiency Score', value: '92%', change: '+5%', trend: 'up', icon: TrophyIcon, color: 'purple' }
];

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const [selectedView, setSelectedView] = useState('overview');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedParty, setSelectedParty] = useState('All');
  const [selectedCommittee, setSelectedCommittee] = useState('All');
  const [selectedRegion, setSelectedRegion] = useState('All');

  const periods = [
    { value: '1month', label: 'Last Month' },
    { value: '3months', label: 'Last 3 Months' },
    { value: '6months', label: 'Last 6 Months' },
    { value: '1year', label: 'Last Year' },
    { value: 'all', label: 'All Time' }
  ];

  const views = [
    { value: 'overview', label: 'Overview' },
    { value: 'debates', label: 'Debates' },
    { value: 'bills', label: 'Bills' },
    { value: 'members', label: 'Members' },
    { value: 'committees', label: 'Committees' }
  ];

  const parties = ['All', 'NPP', 'NDC', 'Independent'];
  const committees = ['All', 'Education', 'Health', 'Finance', 'Constitutional', 'Youth & Sports'];
  const regions = ['All', 'Greater Accra', 'Ashanti', 'Northern', 'Central', 'Volta', 'Other'];

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? (
      <ArrowUpIcon className="w-4 h-4 text-green-500" />
    ) : (
      <ArrowDownIcon className="w-4 h-4 text-red-500" />
    );
  };

  const getTrendColor = (trend: string) => {
    return trend === 'up' ? 'text-green-600' : 'text-red-600';
  };

  const getKpiColor = (color: string) => {
    const colors = {
      blue: 'text-blue-600 bg-blue-100',
      green: 'text-green-600 bg-green-100',
      yellow: 'text-yellow-600 bg-yellow-100',
      purple: 'text-purple-600 bg-purple-100'
    };
    return colors[color as keyof typeof colors] || 'text-gray-600 bg-gray-100';
  };

  return (
    <Navigation>
      <div className="p-6">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Parliamentary Analytics</h1>
              <p className="text-gray-600">Comprehensive insights and data visualization for parliamentary activities</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
                <ArrowPathIcon className="w-4 h-4" />
                <span>Refresh</span>
              </button>
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

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Period Selection */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Time Period</label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {periods.map(period => (
                  <option key={period.value} value={period.value}>{period.label}</option>
                ))}
              </select>
            </div>

            {/* View Selection */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">View</label>
              <select
                value={selectedView}
                onChange={(e) => setSelectedView(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {views.map(view => (
                  <option key={view.value} value={view.value}>{view.label}</option>
                ))}
              </select>
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
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              </div>
            </div>
          )}
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {kpiData.map((kpi, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                  <div className="flex items-center mt-2">
                    {getTrendIcon(kpi.trend)}
                    <span className={`text-sm font-medium ml-1 ${getTrendColor(kpi.trend)}`}>
                      {kpi.change}
                    </span>
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getKpiColor(kpi.color)}`}>
                  <kpi.icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Debate Trends Chart */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Debate Trends</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <CalendarIcon className="w-4 h-4" />
                <span>Last 8 months</span>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={debateTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#666" />
                  <YAxis yAxisId="left" stroke="#666" />
                  <YAxis yAxisId="right" orientation="right" stroke="#666" />
                  <Tooltip />
                  <Bar yAxisId="left" dataKey="debates" fill="#3B82F6" name="Debates" />
                  <Line yAxisId="right" type="monotone" dataKey="attendance" stroke="#10B981" strokeWidth={2} name="Attendance %" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Sentiment Analysis */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Sentiment Analysis</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <FireIcon className="w-4 h-4" />
                <span>Real-time</span>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sentimentAnalysis}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    dataKey="value"
                  >
                    {sentimentAnalysis.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {sentimentAnalysis.map((item, index) => (
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
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Party Performance */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Party Performance</h3>
            <div className="space-y-4">
              {partyPerformance.map((party, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{party.party}</p>
                    <p className="text-sm text-gray-500">{party.debates} debates, {party.bills} bills</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{party.efficiency}%</p>
                    <p className="text-xs text-gray-500">efficiency</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Speakers */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Speakers</h3>
            <div className="space-y-4">
              {topSpeakers.map((speaker, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{speaker.name}</p>
                    <p className="text-sm text-gray-500">{speaker.party} • {speaker.debates} debates</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{speaker.speakingTime}h</p>
                    <p className="text-xs text-gray-500">speaking time</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Committee Activity */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Committee Activity</h3>
            <div className="space-y-4">
              {committeeActivity.map((committee, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{committee.committee}</p>
                    <p className="text-sm text-gray-500">{committee.meetings} meetings</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{committee.efficiency}%</p>
                    <p className="text-xs text-gray-500">efficiency</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Voting Patterns */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Voting Patterns by Bill</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={votingPatterns}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="bill" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip />
                <Bar dataKey="npp" stackId="a" fill="#3B82F6" name="NPP" />
                <Bar dataKey="ndc" stackId="a" fill="#10B981" name="NDC" />
                <Bar dataKey="independent" stackId="a" fill="#6B7280" name="Independent" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Regional Distribution & Time Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Regional Distribution */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Regional Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={regionalDistribution} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" stroke="#666" />
                  <YAxis dataKey="region" type="category" stroke="#666" />
                  <Tooltip />
                  <Bar dataKey="members" fill="#3B82F6" name="Members" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Time Analysis */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Activity Pattern</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timeAnalysis}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="hour" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip />
                  <Area type="monotone" dataKey="activity" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Efficiency Metrics */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Efficiency Metrics</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={efficiencyMetrics}>
                <PolarGrid />
                <PolarAngleAxis dataKey="category" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar
                  name="Efficiency"
                  dataKey="score"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </Navigation>
  );
}
