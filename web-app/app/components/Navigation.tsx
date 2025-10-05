'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  HomeIcon, 
  MicrophoneIcon, 
  DocumentTextIcon, 
  UserGroupIcon, 
  ChartBarIcon, 
  CalendarIcon, 
  FolderIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  BellIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import AIAssistant from './AIAssistant';
import { useAuth } from '../contexts/AuthContext';

interface NavigationProps {
  children: React.ReactNode;
}

export default function Navigation({ children }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navigationItems = [
    { 
      icon: HomeIcon, 
      label: 'Dashboard', 
      href: '/dashboard',
      description: 'Overview and analytics'
    },
    { 
      icon: MicrophoneIcon, 
      label: 'Debates', 
      href: '/debates',
      description: 'Parliamentary debates'
    },
    { 
      icon: DocumentTextIcon, 
      label: 'Bills & Legislation', 
      href: '/bills',
      description: 'Legislative tracking'
    },
    { 
      icon: UserGroupIcon, 
      label: 'Members', 
      href: '/members',
      description: 'Parliamentary members'
    },
    { 
      icon: ChartBarIcon, 
      label: 'Analytics', 
      href: '/analytics',
      description: 'Data insights'
    },
    { 
      icon: CalendarIcon, 
      label: 'Schedule', 
      href: '/schedule',
      description: 'Parliamentary calendar'
    },
    { 
      icon: FolderIcon, 
      label: 'Archives', 
      href: '/archives',
      description: 'Historical records'
    }
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
    console.log('Searching for:', searchQuery);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <nav className="p-4 space-y-2">
              {navigationItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors ${
                    isActive(item.href)
                      ? 'bg-red-100 text-red-700'
                      : 'text-gray-600 hover:bg-gray-100 transition-colors duration-200'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  <div>
                    <span className="text-sm font-medium">{item.label}</span>
                    <p className="text-xs text-gray-500">{item.description}</p>
                  </div>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-gradient-to-r from-red-600 via-yellow-500 to-green-600 text-white shadow-lg">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and title */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden text-white hover:text-yellow-200 transition-colors duration-200"
              >
                <Bars3Icon className="w-6 h-6" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-yellow-400 rounded flex items-center justify-center">
                  <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
                    <div className="w-4 h-4 border border-yellow-400"></div>
                  </div>
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold">Ghana Parliamentary Hub</h1>
                  <p className="text-sm text-yellow-100">Interactive, Voice-Enabled Analytics Platform</p>
                </div>
              </div>
            </div>

            {/* Search bar */}
            <div className="flex-1 max-w-lg mx-4 hidden md:block">
              <form onSubmit={handleSearch} className="relative">
                <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" />
                <input
                  type="text"
                  placeholder="Search debates, bills, or members..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white bg-opacity-30 text-gray-800 placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:bg-white focus:bg-opacity-40"
                />
              </form>
            </div>

            {/* Right side actions */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="relative p-2 bg-green-600 text-white hover:bg-green-700 rounded-lg transition-all duration-200">
                <BellIcon className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User menu */}
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 bg-green-600 px-3 py-2 rounded-lg hover:bg-green-700 transition-all duration-200"
                >
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-sm font-semibold text-green-600">
                    {user?.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <ChevronDownIcon className="w-4 h-4 text-white" />
                </button>

                {/* User dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-green-50 rounded-lg shadow-lg py-1 z-50 border border-green-200">
                    <div className="px-4 py-2 border-b border-green-200 bg-green-100">
                      <p className="text-sm font-medium text-green-900">User</p>
                      <p className="text-xs text-green-700">{user?.email}</p>
                    </div>
                    <Link
                      href="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-green-100 transition-colors duration-200"
                    >
                      <Cog6ToothIcon className="w-4 h-4 mr-3" />
                      Settings
                    </Link>
                    <button 
                      onClick={logout}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-green-100 transition-colors duration-200"
                    >
                      <ArrowRightOnRectangleIcon className="w-4 h-4 mr-3" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 bg-white shadow-lg min-h-screen">
          <div className="p-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Navigation</h2>
            <nav className="space-y-2">
              {navigationItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive(item.href)
                      ? 'bg-red-100 text-red-700'
                      : 'text-gray-600 hover:bg-gray-100 transition-colors duration-200'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <div className="flex-1">
                    <span className="text-sm font-medium">{item.label}</span>
                    <p className="text-xs text-gray-500">{item.description}</p>
                  </div>
                </Link>
              ))}
            </nav>

            {/* Filters Section */}
            <div className="mt-8">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Quick Filters</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm">
                    <option>Last 30 days</option>
                    <option>Last 3 months</option>
                    <option>Last year</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Party</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm">
                    <option>All Parties</option>
                    <option>NPP</option>
                    <option>NDC</option>
                    <option>Independent</option>
                  </select>
                </div>
              </div>
            </div>

          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>
      </div>

      {/* AI Assistant Widget */}
      <AIAssistant />
    </div>
  );
}
