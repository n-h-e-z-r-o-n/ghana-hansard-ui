'use client';

import { useState, useEffect } from 'react';
import { 
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  UserGroupIcon,
  DocumentTextIcon,
  VideoCameraIcon,
  SpeakerWaveIcon,
  BellIcon,
  ShareIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PlayIcon,
  PauseIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  PlusIcon,
  EyeIcon,
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
  XMarkIcon
} from '@heroicons/react/24/outline';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import Navigation from '../components/Navigation';

// Mock data for parliamentary schedule
const mockSessions = [
  {
    id: '1',
    title: 'Plenary Session - Budget Debate',
    type: 'plenary',
    date: '2024-03-25',
    startTime: '10:00',
    endTime: '16:00',
    location: 'Parliament House, Accra',
    room: 'Chamber',
    status: 'scheduled',
    description: 'Debate on the 2024 National Budget and Economic Policy Statement',
    agenda: [
      'Opening Prayer and National Anthem',
      'Reading of Previous Day\'s Minutes',
      'Questions to Ministers',
      'Budget Presentation by Minister of Finance',
      'General Debate on Budget',
      'Committee Reports',
      'Voting on Budget Proposals'
    ],
    participants: [
      { name: 'Rt Hon. Jane Smith', role: 'Speaker', party: 'NPP' },
      { name: 'Hon. David Johnson', role: 'Majority Leader', party: 'NPP' },
      { name: 'Dr. Sarah Williams', role: 'Minority Whip', party: 'NDC' },
      { name: 'Hon. Michael Brown', role: 'Minister of Finance', party: 'NPP' }
    ],
    committees: ['Finance Committee', 'Economic Affairs Committee'],
    priority: 'high',
    publicAccess: true,
    liveStream: true,
    recording: true,
    documents: [
      { name: 'Budget Statement 2024', type: 'PDF', size: '2.3 MB' },
      { name: 'Economic Policy Document', type: 'PDF', size: '1.8 MB' },
      { name: 'Committee Report', type: 'PDF', size: '0.9 MB' }
    ],
    tags: ['Budget', 'Finance', 'Economic Policy', 'National Development'],
    expectedDuration: '6 hours',
    attendance: 275,
    capacity: 300,
    media: {
      liveStream: 'https://parliament.gh/live',
      recording: 'https://parliament.gh/recordings/session-1',
      photos: ['/api/placeholder/400/300', '/api/placeholder/400/300']
    }
  },
  {
    id: '2',
    title: 'Education Committee Meeting',
    type: 'committee',
    date: '2024-03-26',
    startTime: '14:00',
    endTime: '17:00',
    location: 'Parliament House, Accra',
    room: 'Committee Room 1',
    status: 'scheduled',
    description: 'Review of Education Sector Reforms and Teacher Training Programs',
    agenda: [
      'Welcome and Introductions',
      'Review of Previous Meeting Minutes',
      'Presentation on Teacher Training Reforms',
      'Discussion on Education Infrastructure',
      'Budget Allocation for Education',
      'Public Submissions',
      'Committee Recommendations'
    ],
    participants: [
      { name: 'Hon. Michael Brown', role: 'Committee Chair', party: 'NPP' },
      { name: 'Dr. Sarah Williams', role: 'Vice-Chair', party: 'NDC' },
      { name: 'Hon. Grace Mensah', role: 'Member', party: 'NDC' },
      { name: 'Prof. John Asante', role: 'External Expert', party: 'Independent' }
    ],
    committees: ['Education Committee'],
    priority: 'medium',
    publicAccess: false,
    liveStream: false,
    recording: true,
    documents: [
      { name: 'Education Reform Report', type: 'PDF', size: '3.1 MB' },
      { name: 'Teacher Training Analysis', type: 'PDF', size: '2.2 MB' }
    ],
    tags: ['Education', 'Teacher Training', 'Reforms', 'Infrastructure'],
    expectedDuration: '3 hours',
    attendance: 12,
    capacity: 15,
    media: {
      liveStream: null,
      recording: 'https://parliament.gh/recordings/education-committee-1',
      photos: []
    }
  },
  {
    id: '3',
    title: 'Health Committee Public Hearing',
    type: 'hearing',
    date: '2024-03-27',
    startTime: '09:00',
    endTime: '13:00',
    location: 'Parliament House, Accra',
    room: 'Conference Hall',
    status: 'live',
    description: 'Public hearing on Healthcare Access and Universal Health Coverage',
    agenda: [
      'Opening Remarks by Committee Chair',
      'Presentation by Ministry of Health',
      'Civil Society Organizations Testimonies',
      'Healthcare Workers Union Presentation',
      'Public Questions and Comments',
      'Expert Panel Discussion',
      'Committee Deliberations'
    ],
    participants: [
      { name: 'Dr. Sarah Williams', role: 'Committee Chair', party: 'NDC' },
      { name: 'Hon. David Johnson', role: 'Member', party: 'NPP' },
      { name: 'Dr. Kwame Nkrumah', role: 'Health Minister', party: 'NPP' },
      { name: 'Ms. Ama Serwaa', role: 'CSO Representative', party: 'Independent' }
    ],
    committees: ['Health Committee'],
    priority: 'high',
    publicAccess: true,
    liveStream: true,
    recording: true,
    documents: [
      { name: 'Universal Health Coverage Report', type: 'PDF', size: '4.2 MB' },
      { name: 'Healthcare Access Survey', type: 'PDF', size: '2.8 MB' },
      { name: 'CSO Submissions', type: 'PDF', size: '1.5 MB' }
    ],
    tags: ['Health', 'Universal Coverage', 'Public Hearing', 'Healthcare Access'],
    expectedDuration: '4 hours',
    attendance: 45,
    capacity: 50,
    media: {
      liveStream: 'https://parliament.gh/live/health-hearing',
      recording: 'https://parliament.gh/recordings/health-hearing-1',
      photos: ['/api/placeholder/400/300']
    }
  },
  {
    id: '4',
    title: 'Constitutional Review Committee',
    type: 'committee',
    date: '2024-03-28',
    startTime: '10:00',
    endTime: '15:00',
    location: 'Parliament House, Accra',
    room: 'Committee Room 2',
    status: 'scheduled',
    description: 'Review of Constitutional Amendments and Electoral Reforms',
    agenda: [
      'Constitutional Review Progress Report',
      'Electoral Commission Presentation',
      'Legal Expert Consultations',
      'Public Submissions Review',
      'Draft Amendment Discussions',
      'Timeline for Constitutional Changes'
    ],
    participants: [
      { name: 'Rt Hon. Jane Smith', role: 'Committee Chair', party: 'NPP' },
      { name: 'Hon. David Johnson', role: 'Member', party: 'NPP' },
      { name: 'Dr. Sarah Williams', role: 'Member', party: 'NDC' },
      { name: 'Justice Kwame Asante', role: 'Legal Expert', party: 'Independent' }
    ],
    committees: ['Constitutional Committee'],
    priority: 'high',
    publicAccess: false,
    liveStream: false,
    recording: true,
    documents: [
      { name: 'Constitutional Review Report', type: 'PDF', size: '5.1 MB' },
      { name: 'Electoral Reform Proposals', type: 'PDF', size: '3.2 MB' },
      { name: 'Legal Expert Opinions', type: 'PDF', size: '2.1 MB' }
    ],
    tags: ['Constitution', 'Electoral Reform', 'Legal', 'Democracy'],
    expectedDuration: '5 hours',
    attendance: 8,
    capacity: 10,
    media: {
      liveStream: null,
      recording: 'https://parliament.gh/recordings/constitutional-review-1',
      photos: []
    }
  },
  {
    id: '5',
    title: 'Youth and Sports Committee',
    type: 'committee',
    date: '2024-03-29',
    startTime: '11:00',
    endTime: '14:00',
    location: 'Parliament House, Accra',
    room: 'Committee Room 3',
    status: 'scheduled',
    description: 'Discussion on Youth Development Programs and Sports Infrastructure',
    agenda: [
      'Youth Development Policy Review',
      'Sports Infrastructure Assessment',
      'Youth Employment Programs',
      'Sports Ministry Budget Allocation',
      'Youth Organization Presentations',
      'Committee Recommendations'
    ],
    participants: [
      { name: 'Hon. Grace Mensah', role: 'Committee Chair', party: 'NDC' },
      { name: 'Hon. Michael Brown', role: 'Member', party: 'NPP' },
      { name: 'Mr. Kwame Appiah', role: 'Youth Minister', party: 'NPP' },
      { name: 'Ms. Akosua Mensah', role: 'Youth Representative', party: 'Independent' }
    ],
    committees: ['Youth and Sports Committee'],
    priority: 'medium',
    publicAccess: false,
    liveStream: false,
    recording: true,
    documents: [
      { name: 'Youth Development Report', type: 'PDF', size: '2.7 MB' },
      { name: 'Sports Infrastructure Plan', type: 'PDF', size: '1.9 MB' }
    ],
    tags: ['Youth', 'Sports', 'Development', 'Infrastructure'],
    expectedDuration: '3 hours',
    attendance: 10,
    capacity: 12,
    media: {
      liveStream: null,
      recording: 'https://parliament.gh/recordings/youth-sports-1',
      photos: []
    }
  }
];

const sessionTypes = ['All', 'plenary', 'committee', 'hearing', 'special'];
const priorities = ['All', 'high', 'medium', 'low'];
const statuses = ['All', 'scheduled', 'live', 'completed', 'cancelled'];
const rooms = ['All', 'Chamber', 'Committee Room 1', 'Committee Room 2', 'Committee Room 3', 'Conference Hall'];

const sessionTypeData = [
  { name: 'Plenary Sessions', value: 35, color: '#3B82F6' },
  { name: 'Committee Meetings', value: 45, color: '#10B981' },
  { name: 'Public Hearings', value: 15, color: '#F59E0B' },
  { name: 'Special Events', value: 5, color: '#EF4444' }
];

const priorityData = [
  { name: 'High Priority', value: 25, color: '#EF4444' },
  { name: 'Medium Priority', value: 50, color: '#F59E0B' },
  { name: 'Low Priority', value: 25, color: '#10B981' }
];

const weeklyData = [
  { day: 'Mon', sessions: 3, attendance: 45 },
  { day: 'Tue', sessions: 4, attendance: 52 },
  { day: 'Wed', sessions: 2, attendance: 38 },
  { day: 'Thu', sessions: 5, attendance: 67 },
  { day: 'Fri', sessions: 3, attendance: 41 },
  { day: 'Sat', sessions: 1, attendance: 15 },
  { day: 'Sun', sessions: 0, attendance: 0 }
];

export default function SchedulePage() {
  const [sessions, setSessions] = useState(mockSessions);
  const [filteredSessions, setFilteredSessions] = useState(mockSessions);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedRoom, setSelectedRoom] = useState('All');
  const [viewMode, setViewMode] = useState('list');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Filter and search logic
  useEffect(() => {
    let filtered = sessions.filter(session => {
      const matchesSearch = session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           session.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           session.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesType = selectedType === 'All' || session.type === selectedType;
      const matchesPriority = selectedPriority === 'All' || session.priority === selectedPriority;
      const matchesStatus = selectedStatus === 'All' || session.status === selectedStatus;
      const matchesRoom = selectedRoom === 'All' || session.room === selectedRoom;
      
      return matchesSearch && matchesType && matchesPriority && matchesStatus && matchesRoom;
    });

    setFilteredSessions(filtered);
  }, [searchTerm, selectedType, selectedPriority, selectedStatus, selectedRoom, sessions]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'text-blue-600 bg-blue-100';
      case 'live': return 'text-red-600 bg-red-100';
      case 'completed': return 'text-green-600 bg-green-100';
      case 'cancelled': return 'text-gray-600 bg-gray-100';
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'plenary': return <BuildingOfficeIcon className="w-5 h-5" />;
      case 'committee': return <UserGroupIcon className="w-5 h-5" />;
      case 'hearing': return <MicrophoneIcon className="w-5 h-5" />;
      case 'special': return <StarIcon className="w-5 h-5" />;
      default: return <CalendarIcon className="w-5 h-5" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getUpcomingSessions = () => {
    const today = new Date();
    return filteredSessions.filter(session => new Date(session.date) >= today).slice(0, 3);
  };

  const getLiveSessions = () => {
    return filteredSessions.filter(session => session.status === 'live');
  };

  return (
    <Navigation>
      <div className="p-6">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Parliamentary Schedule</h1>
              <p className="text-gray-600">View and manage parliamentary sessions, meetings, and events</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
                <BellIcon className="w-4 h-4" />
                <span>Notifications</span>
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

        {/* Live Sessions Alert */}
        {getLiveSessions().length > 0 && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  {getLiveSessions().length} Live Session{getLiveSessions().length > 1 ? 's' : ''} Currently Active
                </h3>
                <p className="text-sm text-red-700">
                  {getLiveSessions().map(session => session.title).join(', ')}
                </p>
              </div>
              <div className="ml-auto">
                <button className="text-red-600 hover:text-red-800">
                  <PlayIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search sessions, topics, or participants..."
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

            {/* View Mode */}
            <div className="flex border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 text-sm ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                List
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`px-3 py-2 text-sm ${viewMode === 'calendar' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                Calendar
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Session Type</label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {sessionTypes.map(type => (
                      <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
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
                      <option key={priority} value={priority}>{priority.charAt(0).toUpperCase() + priority.slice(1)}</option>
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
                      <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Room</label>
                  <select
                    value={selectedRoom}
                    onChange={(e) => setSelectedRoom(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {rooms.map(room => (
                      <option key={room} value={room}>{room}</option>
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
                <p className="text-sm font-medium text-gray-600">Total Sessions</p>
                <p className="text-2xl font-bold text-gray-900">{filteredSessions.length}</p>
              </div>
              <CalendarIcon className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Live Sessions</p>
                <p className="text-2xl font-bold text-red-600">{getLiveSessions().length}</p>
              </div>
              <PlayIcon className="w-8 h-8 text-red-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Upcoming</p>
                <p className="text-2xl font-bold text-green-600">{getUpcomingSessions().length}</p>
              </div>
              <ClockIcon className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Public Access</p>
                <p className="text-2xl font-bold text-purple-600">
                  {filteredSessions.filter(session => session.publicAccess).length}
                </p>
              </div>
              <EyeIcon className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sessions List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Sessions</h2>
                <p className="text-sm text-gray-600">Showing {filteredSessions.length} sessions</p>
              </div>
              <div className="divide-y divide-gray-200">
                {filteredSessions.map((session) => (
                  <div key={session.id} className="p-6 hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedSession(session)}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          {getTypeIcon(session.type)}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900">{session.title}</h3>
                          <p className="text-sm text-gray-600">{session.description}</p>
                          <p className="text-sm text-gray-500">{formatDate(session.date)} • {session.startTime} - {session.endTime}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(session.status)}`}>
                          {session.status}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(session.priority)}`}>
                          {session.priority} priority
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-500 mb-3">
                      <span className="flex items-center">
                        <MapPinIcon className="w-4 h-4 mr-1" />
                        {session.location} • {session.room}
                      </span>
                      <span className="flex items-center">
                        <ClockIcon className="w-4 h-4 mr-1" />
                        {session.expectedDuration}
                      </span>
                      <span className="flex items-center">
                        <UserGroupIcon className="w-4 h-4 mr-1" />
                        {session.attendance}/{session.capacity} attendees
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {session.tags.slice(0, 3).map((tag, index) => (
                          <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                            {tag}
                          </span>
                        ))}
                        {session.tags.length > 3 && (
                          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                            +{session.tags.length - 3} more
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        {session.liveStream && (
                          <span className="flex items-center text-red-600 text-xs">
                            <VideoCameraIcon className="w-4 h-4 mr-1" />
                            Live
                          </span>
                        )}
                        {session.publicAccess && (
                          <span className="flex items-center text-green-600 text-xs">
                            <EyeIcon className="w-4 h-4 mr-1" />
                            Public
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Session Type Distribution */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Session Types</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sessionTypeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      dataKey="value"
                    >
                      {sessionTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2">
                {sessionTypeData.map((item, index) => (
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

            {/* Weekly Activity */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Activity</h3>
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="day" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip />
                    <Bar dataKey="sessions" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Priority Distribution */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Priority Levels</h3>
              <div className="space-y-3">
                {priorityData.map((priority, index) => (
                  <div key={priority.name} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{priority.name}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full" 
                          style={{ width: `${priority.value}%`, backgroundColor: priority.color }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{priority.value}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Session Detail Modal */}
        {selectedSession && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {getTypeIcon(selectedSession.type)}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{selectedSession.title}</h2>
                      <p className="text-sm text-gray-600">{formatDate(selectedSession.date)} • {selectedSession.startTime} - {selectedSession.endTime}</p>
                      <p className="text-sm text-gray-500">{selectedSession.location} • {selectedSession.room}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedSession(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Session Details</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Type:</span>
                        <span className="font-medium capitalize">{selectedSession.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedSession.status)}`}>
                          {selectedSession.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Priority:</span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(selectedSession.priority)}`}>
                          {selectedSession.priority}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Duration:</span>
                        <span className="font-medium">{selectedSession.expectedDuration}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Attendance:</span>
                        <span className="font-medium">{selectedSession.attendance}/{selectedSession.capacity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Public Access:</span>
                        <span className={`font-medium ${selectedSession.publicAccess ? 'text-green-600' : 'text-red-600'}`}>
                          {selectedSession.publicAccess ? 'Yes' : 'No'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Participants</h3>
                    <div className="space-y-2">
                      {selectedSession.participants.map((participant, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{participant.name}</p>
                            <p className="text-xs text-gray-600">{participant.role}</p>
                          </div>
                          <span className="text-xs text-gray-500">{participant.party}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Agenda</h3>
                  <ul className="space-y-2">
                    {selectedSession.agenda.map((item, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-blue-600 font-bold">{index + 1}.</span>
                        <span className="text-sm text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Documents</h3>
                  <div className="space-y-2">
                    {selectedSession.documents.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <DocumentTextIcon className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-900">{doc.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">{doc.type}</span>
                          <span className="text-xs text-gray-500">{doc.size}</span>
                          <button className="text-blue-600 hover:text-blue-800">
                            <ArrowDownTrayIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex space-x-4">
                  {selectedSession.liveStream && (
                    <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center space-x-2">
                      <PlayIcon className="w-4 h-4" />
                      <span>Watch Live</span>
                    </button>
                  )}
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
                    <BellIcon className="w-4 h-4" />
                    <span>Set Reminder</span>
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
