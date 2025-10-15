'use client';

import { 
  ArrowUpIcon,
  ArrowDownIcon,
  FaceSmileIcon,
  FaceFrownIcon,
  ArrowPathIcon,
  MicrophoneIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Navigation from '../components/Navigation';
import ProtectedRoute from '../components/ProtectedRoute';
import DashboardNewsFeed from '../components/DashboardNewsFeed';
import ParliamentLeadership from '../components/ParliamentLeadership';


const debateData = [
  { month: 'Jan', debates: 120, bills: 45 },
  { month: 'Feb', debates: 160, bills: 65 },
  { month: 'Mar', debates: 140, bills: 50 },
  { month: 'Apr', debates: 170, bills: 55 },
  { month: 'May', debates: 150, bills: 40 },
  { month: 'Jun', debates: 130, bills: 35 },
];


const topSpeakers = [
  { initials: 'JS', name: 'Rt Hon. Jane Smith', title: 'Speaker of Parliament', count: 24, color: 'bg-red-500' },
  { initials: 'DJ', name: 'David Johnson MP', title: 'Majority Leader', count: 19, color: 'bg-gray-500' },
  { initials: 'SW', name: 'Dr. Sarah Williams', title: 'Minority Whip', count: 17, color: 'bg-green-500' },
  { initials: 'MB', name: 'Michael Brown MP', title: 'Minister of Health', count: 15, color: 'bg-gray-500' },
];

const recentDebates = [
  {
    title: 'Education Review Bill',
    category: 'Education',
    date: '15 June 2023',
    duration: '2h 45m',
    sentiment: 'positive',
    description: 'This bill focused on expanding funding for schools and improving teacher training. The debate saw bipartisan support for increased education budgets but disagreement on allocation methods.'
  },
  {
    title: 'Healthcare Funding Division',
    category: 'Healthcare',
    date: '12 June 2023',
    duration: '3h 10m',
    sentiment: 'negative',
    description: 'The division of Healthcare Funding focused on expanding universal health coverage. Heated exchanges occurred over budget priorities between government and opposition members.'
  },
  {
    title: 'Question Time: Finance Minister',
    category: 'Economy',
    date: '8 June 2023',
    duration: '1h 30m',
    sentiment: 'neutral',
    description: 'Weekly question session covered inflation, economic growth projections, and tax policies. The Minister faced tough questions but provided detailed responses on most issues.'
  }
];



export default function Dashboard() {
  return (
    <ProtectedRoute>
      <Navigation>
      <div className="p-6">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-red-600 via-yellow-500 to-green-600 text-white p-6 rounded-lg mb-6">
            <h2 className="text-2xl font-bold mb-2">Welcome to Your Parliamentary Dashboard</h2>
            <p className="text-yellow-100">Get AI-powered insights, voice-enabled analysis, and real-time tracking of parliamentary proceedings.</p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {[
              { title: 'Total Debates', value: '178', change: '+12%', trend: 'up' },
              { title: 'Active Members', value: '15', change: '+5%', trend: 'up' },
              { title: 'New Bills', value: '59', change: '-3%', trend: 'down' },
              { title: 'Avg. Duration', value: '29m', change: '+8%', trend: 'up' },
            ].map((metric, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-sm font-medium text-gray-500 mb-1">{metric.title}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900">{metric.value}</span>
                  <div className={`flex items-center space-x-1 ${
                    metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {metric.trend === 'up' ? (
                      <ArrowUpIcon className="w-4 h-4" />
                    ) : (
                      <ArrowDownIcon className="w-4 h-4" />
                    )}
                    <span className="text-sm font-medium">{metric.change}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">from last month</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Debate Activity Trend */}
            <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Debate Activity Trend</h3>
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md">Monthly</button>
                  <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-md">Export</button>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={debateData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip />
                    <Line type="monotone" dataKey="debates" stroke="#8B5CF6" strokeWidth={2} />
                    <Line type="monotone" dataKey="bills" stroke="#10B981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Speakers */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Top Speakers</h3>
                <button className="text-sm text-red-600 hover:text-red-700">View All</button>
              </div>
              <div className="space-y-4">
                {topSpeakers.map((speaker, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className={`w-10 h-10 ${speaker.color} rounded-full flex items-center justify-center text-white font-semibold text-sm`}>
                      {speaker.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{speaker.name}</p>
                      <p className="text-xs text-gray-500 truncate">{speaker.title}</p>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-500">
                      <MicrophoneIcon className="w-4 h-4" />
                      <span className="text-sm font-medium">{speaker.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Recent Debates */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Recent Debates</h3>
                <button className="text-sm text-red-600 hover:text-red-700">View All</button>
              </div>
              <div className="space-y-4">
                {recentDebates.map((debate, index) => (
                  <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{debate.title}</h4>
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full">{debate.category}</span>
                        {debate.sentiment === 'positive' && <FaceSmileIcon className="w-4 h-4 text-green-500" />}
                        {debate.sentiment === 'negative' && <FaceFrownIcon className="w-4 h-4 text-red-500" />}
                        {debate.sentiment === 'neutral' && <div className="w-4 h-4 bg-gray-500 rounded-full"></div>}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-xs text-gray-500 mb-2">
                      <span>{debate.date}</span>
                      <span>{debate.duration}</span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{debate.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Latest from Parliament.gh */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">News</h3>
                  <ArrowPathIcon className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600" />
                </div>
              </div>
              <div className="h-96 overflow-y-auto">
                <div className="p-6">
                  <DashboardNewsFeed />
                </div>
              </div>
            </div>
          </div>

          {/* Parliament Leadership Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Parliament Leadership */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Parliament Leadership</h3>
                  <ArrowPathIcon className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600" />
                </div>
              </div>
              <div className="h-96 overflow-y-auto">
                <div className="p-6">
                  <ParliamentLeadership />
                </div>
              </div>
            </div>

            {/* Placeholder for future content */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <UserGroupIcon className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Additional Content</h3>
                  <p className="text-sm text-gray-600">More parliamentary information coming soon</p>
                </div>
              </div>
            </div>
          </div>

      </div>
      </Navigation>
    </ProtectedRoute>
  );
}
