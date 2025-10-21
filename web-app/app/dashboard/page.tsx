'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaceSmileIcon,
  FaceFrownIcon,
  ArrowPathIcon,
  MicrophoneIcon,
  UserGroupIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import Navigation from '../components/Navigation';
import ProtectedRoute from '../components/ProtectedRoute';
import DashboardNewsFeed from '../components/DashboardNewsFeed';
import ParliamentLeadership from '../components/ParliamentLeadership';
import LoadingSpinner, { CardSkeleton } from '../components/LoadingSpinner';
import ErrorBoundary from '../components/ErrorBoundary';





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
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [refreshKey]);

  const handleRefresh = () => {
    setIsLoading(true);
    setRefreshKey(prev => prev + 1);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <ProtectedRoute>
      <Navigation>
        <ErrorBoundary>
          <div className="p-6">
            {/* Welcome Banner */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-r from-red-600 via-yellow-500 to-green-600 text-white p-6 rounded-lg mb-6 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-black opacity-10"></div>
              <div className="relative z-10">
                <h2 className="text-2xl font-bold mb-2">Welcome to Your Parliamentary Dashboard</h2>
                <p className="text-yellow-100">Get AI-powered insights, voice-enabled analysis, and real-time tracking of parliamentary proceedings.</p>
              </div>
            </motion.div>

            {/* Key Metrics */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6"
            >
              <AnimatePresence mode="wait">
                {isLoading ? (
                  Array.from({ length: 4 }).map((_, index) => (
                    <motion.div key={`skeleton-${index}`} variants={itemVariants}>
                      <CardSkeleton />
                    </motion.div>
                  ))
                ) : (
                  [
                    { title: 'Total Debates', value: '178', change: '+12%', trend: 'up', icon: MicrophoneIcon },
                    { title: 'Active Members', value: '15', change: '+5%', trend: 'up', icon: UserGroupIcon },
                    { title: 'New Bills', value: '59', change: '-3%', trend: 'down', icon: ChartBarIcon },
                    { title: 'Avg. Duration', value: '29m', change: '+8%', trend: 'up', icon: ChartBarIcon },
                  ].map((metric, index) => (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      whileHover={{ scale: 1.02 }}
                      className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 card-hover"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-gray-500">{metric.title}</h3>
                        <metric.icon className="w-5 h-5 text-gray-400" />
                      </div>
                      <div className="flex items-center justify-between">
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.2 + index * 0.1 }}
                          className="text-2xl font-bold text-gray-900"
                        >
                          {metric.value}
                        </motion.span>
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + index * 0.1 }}
                          className={`flex items-center space-x-1 ${
                            metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {metric.trend === 'up' ? (
                            <ArrowPathIcon className="w-4 h-4" />
                          ) : (
                            <ArrowPathIcon className="w-4 h-4" />
                          )}
                          <span className="text-sm font-medium">{metric.change}</span>
                        </motion.div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">from last month</p>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Recent Debates */}
              <motion.div
                variants={itemVariants}
                className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Debates</h3>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-sm text-red-600 hover:text-red-700 transition-colors duration-200"
                  >
                    View All
                  </motion.button>
                </div>
                <div className="space-y-4">
                  {recentDebates.map((debate, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      whileHover={{ scale: 1.01 }}
                      className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0 hover:bg-gray-50 p-3 rounded-lg transition-colors duration-200"
                    >
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
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Parliament Leadership */}
              <motion.div
                variants={itemVariants}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
              >
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Parliament Leadership</h3>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleRefresh}
                      className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                      <ArrowPathIcon className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                    </motion.button>
                  </div>
                </div>
                <div className="h-80 overflow-y-auto">
                  <div className="p-4">
                    <AnimatePresence mode="wait">
                      {isLoading ? (
                        <div className="flex items-center justify-center h-32">
                          <LoadingSpinner text="Loading leadership..." />
                        </div>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5 }}
                        >
                          <ParliamentLeadership />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Latest from Parliament.gh */}
              <motion.div
                variants={itemVariants}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
              >
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">News</h3>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleRefresh}
                      className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                      <ArrowPathIcon className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                    </motion.button>
                  </div>
                </div>
                <div className="h-96 overflow-y-auto">
                  <div className="p-6">
                    <AnimatePresence mode="wait">
                      {isLoading ? (
                        <LoadingSpinner text="Loading news..." />
                      ) : (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5 }}
                        >
                          <DashboardNewsFeed />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>

              {/* Placeholder for future content */}
              <motion.div
                variants={itemVariants}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-center justify-center h-full">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                    className="text-center"
                  >
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4"
                    >
                      <ChartBarIcon className="w-8 h-8 text-gray-600" />
                    </motion.div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics</h3>
                    <p className="text-sm text-gray-600">Advanced parliamentary analytics coming soon</p>
                  </motion.div>
                </div>
              </motion.div>
            </div>

            {/* Additional Content Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Placeholder for future content */}
              <motion.div
                variants={itemVariants}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-center justify-center h-full">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                    className="text-center"
                  >
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="w-16 h-16 bg-gradient-to-br from-red-100 to-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                    >
                      <UserGroupIcon className="w-8 h-8 text-gray-600" />
                    </motion.div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Additional Content</h3>
                    <p className="text-sm text-gray-600">More parliamentary information coming soon</p>
                  </motion.div>
                </div>
              </motion.div>

              {/* Placeholder for future content */}
              <motion.div
                variants={itemVariants}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-center justify-center h-full">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
                    className="text-center"
                  >
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: -5 }}
                      className="w-16 h-16 bg-gradient-to-br from-yellow-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-4"
                    >
                      <ChartBarIcon className="w-8 h-8 text-gray-600" />
                    </motion.div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics</h3>
                    <p className="text-sm text-gray-600">Advanced parliamentary analytics coming soon</p>
                  </motion.div>
                </div>
              </motion.div>
            </div>

          </div>
        </ErrorBoundary>
      </Navigation>
    </ProtectedRoute>
  );
}
