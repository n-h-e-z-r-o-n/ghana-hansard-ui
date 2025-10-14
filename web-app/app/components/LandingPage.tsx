'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  MicrophoneIcon, 
  ChartBarIcon, 
  DocumentTextIcon, 
  UserGroupIcon,
  ArrowRightIcon,
  PlayIcon,
  CheckIcon,
  StarIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
  NewspaperIcon,
  CalendarIcon,
  DocumentIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import AIAssistant from './AIAssistant';
import ParliamentNewsFeed from './ParliamentNewsFeed';

export default function LandingPage() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState('');

  // Scroll effect for navigation
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll to sections
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const features = [
    {
      icon: MicrophoneIcon,
      title: 'AI Assistant with Voice',
      description: 'Interactive AI assistant with voice recognition, real-time chat, and intelligent parliamentary insights.'
    },
    {
      icon: ChartBarIcon,
      title: 'Interactive Analytics',
      description: 'Comprehensive dashboards with visual insights into parliamentary activities and trends.'
    },
    {
      icon: DocumentTextIcon,
      title: 'Legislative Tracking',
      description: 'Track bills, amendments, and legislative progress with detailed documentation.'
    },
    {
      icon: UserGroupIcon,
      title: 'Member Profiles',
      description: 'Detailed profiles of parliamentarians with voting records and participation metrics.'
    }
  ];

  const stats = [
    { label: 'Active Debates', value: '178' },
    { label: 'Parliamentary Members', value: '275' },
    { label: 'Bills Tracked', value: '1,247' },
    { label: 'AI Insights Generated', value: '2,500+' }
  ];

  const testimonials = [
    {
      name: 'Rt. Hon. Alban Bagbin',
      role: 'Speaker of Parliament',
      content: 'This platform has revolutionized how we track and analyze parliamentary proceedings.',
      rating: 5
    },
    {
      name: 'Dr. Cassiel Ato Forson',
      role: 'Minority Leader',
      content: 'The AI insights help us understand debate patterns and improve our legislative process.',
      rating: 5
    },
    {
      name: 'Osei Kyei-Mensah-Bonsu',
      role: 'Majority Leader',
      content: 'A game-changer for transparency and accountability in Ghana\'s Parliament.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Enhanced Navigation with Dynamic Effects */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/50' 
          : 'bg-white shadow-sm border-b border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo with Animation */}
            <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => scrollToSection('hero')}>
              <div className="w-8 h-8 rounded flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                <img 
                  src="/logo.png" 
                  alt="Ghana Parliamentary Hub Logo" 
                  className="w-8 h-8 rounded object-contain transition-all duration-300"
                />
              </div>
              <span className="text-xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-red-600 group-hover:to-green-600">
                Ghana Parliamentary Hub
              </span>
            </div>

            {/* Desktop Navigation with Hover Effects */}
            <div className="hidden lg:flex items-center space-x-2">
              <Link 
                href="/" 
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeNavItem === 'home' 
                    ? 'text-white bg-gradient-to-r from-red-600 to-green-600 shadow-lg' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
                onMouseEnter={() => setActiveNavItem('home')}
                onMouseLeave={() => setActiveNavItem('')}
              >
                <span className="relative z-10">Home</span>
                {activeNavItem === 'home' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-green-600 rounded-lg animate-pulse"></div>
                )}
              </Link>
              
              <Link 
                href="/debates" 
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeNavItem === 'debates' 
                    ? 'text-white bg-gradient-to-r from-red-600 to-green-600 shadow-lg' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
                onMouseEnter={() => setActiveNavItem('debates')}
                onMouseLeave={() => setActiveNavItem('')}
              >
                <span className="relative z-10">Debates</span>
                {activeNavItem === 'debates' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-green-600 rounded-lg animate-pulse"></div>
                )}
              </Link>
              
              <Link 
                href="/bills" 
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeNavItem === 'bills' 
                    ? 'text-white bg-gradient-to-r from-red-600 to-green-600 shadow-lg' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
                onMouseEnter={() => setActiveNavItem('bills')}
                onMouseLeave={() => setActiveNavItem('')}
              >
                <span className="relative z-10">Bills & Legislation</span>
                {activeNavItem === 'bills' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-green-600 rounded-lg animate-pulse"></div>
                )}
              </Link>
              
              <Link 
                href="/members" 
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeNavItem === 'members' 
                    ? 'text-white bg-gradient-to-r from-red-600 to-green-600 shadow-lg' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
                onMouseEnter={() => setActiveNavItem('members')}
                onMouseLeave={() => setActiveNavItem('')}
              >
                <span className="relative z-10">Members</span>
                {activeNavItem === 'members' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-green-600 rounded-lg animate-pulse"></div>
                )}
              </Link>
              
              {/* Enhanced Dropdown Menu */}
              <div className="relative" onMouseEnter={() => setIsDropdownOpen(true)} onMouseLeave={() => setIsDropdownOpen(false)}>
                <button className={`flex items-center space-x-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  isDropdownOpen 
                    ? 'text-white bg-gradient-to-r from-red-600 to-green-600 shadow-lg' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}>
                  <span>More</span>
                  <ChevronDownIcon className={`w-4 h-4 transition-all duration-300 ${isDropdownOpen ? 'rotate-180 scale-110' : ''}`} />
                </button>
                {isDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-gray-200/50 py-2 z-50 animate-in slide-in-from-top-2 duration-300">
                    <Link href="/schedule" className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-green-50 hover:text-gray-900 transition-all duration-200 group">
                      <CalendarIcon className="w-4 h-4 mr-3 text-gray-400 group-hover:text-red-600 transition-colors duration-200" />
                      <span>Schedule</span>
                    </Link>
                    <Link href="/archives" className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-green-50 hover:text-gray-900 transition-all duration-200 group">
                      <DocumentIcon className="w-4 h-4 mr-3 text-gray-400 group-hover:text-red-600 transition-colors duration-200" />
                      <span>Archives</span>
                    </Link>
                    <Link href="/analytics" className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-green-50 hover:text-gray-900 transition-all duration-200 group">
                      <ChartBarIcon className="w-4 h-4 mr-3 text-gray-400 group-hover:text-red-600 transition-colors duration-200" />
                      <span>Analytics</span>
                    </Link>
                    <Link href="/news" className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-green-50 hover:text-gray-900 transition-all duration-200 group">
                      <NewspaperIcon className="w-4 h-4 mr-3 text-gray-400 group-hover:text-red-600 transition-colors duration-200" />
                      <span>News & Updates</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced Desktop Auth Button */}
            <div className="hidden lg:flex items-center">
              <Link
                href="/auth"
                className="relative bg-gradient-to-r from-red-600 to-green-600 hover:from-red-700 hover:to-green-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg group overflow-hidden"
              >
                <span className="relative z-10">Get Started</span>
                <div className="absolute inset-0 bg-gradient-to-r from-red-700 to-green-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              </Link>
            </div>

            {/* Enhanced Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-300 hover:scale-110"
            >
              <div className="relative w-6 h-6">
                <Bars3Icon className={`w-6 h-6 absolute transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0 rotate-180' : 'opacity-100 rotate-0'}`} />
                <XMarkIcon className={`w-6 h-6 absolute transition-all duration-300 ${isMobileMenuOpen ? 'opacity-100 rotate-0' : 'opacity-0 rotate-180'}`} />
              </div>
            </button>
          </div>

          {/* Enhanced Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden border-t border-gray-200 py-4 animate-in slide-in-from-top-2 duration-300">
              <div className="space-y-1">
                <Link href="/" className="block px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gradient-to-r hover:from-red-50 hover:to-green-50 rounded-lg transition-all duration-200">
                  Home
                </Link>
                <Link href="/debates" className="block px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gradient-to-r hover:from-red-50 hover:to-green-50 rounded-lg transition-all duration-200">
                  Debates
                </Link>
                <Link href="/bills" className="block px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gradient-to-r hover:from-red-50 hover:to-green-50 rounded-lg transition-all duration-200">
                  Bills & Legislation
                </Link>
                <Link href="/members" className="block px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gradient-to-r hover:from-red-50 hover:to-green-50 rounded-lg transition-all duration-200">
                  Members
                </Link>
                <Link href="/schedule" className="block px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gradient-to-r hover:from-red-50 hover:to-green-50 rounded-lg transition-all duration-200">
                  Schedule
                </Link>
                <Link href="/archives" className="block px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gradient-to-r hover:from-red-50 hover:to-green-50 rounded-lg transition-all duration-200">
                  Archives
                </Link>
                <Link href="/analytics" className="block px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gradient-to-r hover:from-red-50 hover:to-green-50 rounded-lg transition-all duration-200">
                  Analytics
                </Link>
                <Link href="/news" className="block px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gradient-to-r hover:from-red-50 hover:to-green-50 rounded-lg transition-all duration-200">
                  News & Updates
                </Link>
                <div className="pt-4 border-t border-gray-200">
                  <Link
                    href="/auth"
                    className="block w-full text-center px-4 py-3 bg-gradient-to-r from-red-600 to-green-600 hover:from-red-700 hover:to-green-700 text-white rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg"
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="relative bg-gradient-to-br from-red-50 via-yellow-50 to-green-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Transforming Ghana's Parliament into an
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-yellow-500 to-green-600">
                {' '}Interactive Hub
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Experience AI-powered insights, voice-enabled analysis, and real-time tracking of parliamentary proceedings. 
              Making democracy more transparent and accessible for all Ghanaians.
            </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/auth"
                  className="bg-gradient-to-r from-red-600 to-green-600 hover:from-red-700 hover:to-green-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl"
                >
                  Get Started
                  <ArrowRightIcon className="ml-2 w-5 h-5" />
                </Link>
                <button
                  onClick={() => setIsVideoPlaying(true)}
                  className="border border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold transition-colors flex items-center justify-center hover:bg-gray-50"
                >
                  <PlayIcon className="mr-2 w-5 h-5" />
                  Watch Demo
                </button>
              </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-600 via-yellow-500 to-green-600 bg-clip-text text-transparent mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Modern Democracy
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform combines cutting-edge AI technology with user-friendly design to make parliamentary data accessible and actionable.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const colors = [
                'bg-red-100 text-red-600',
                'bg-yellow-100 text-yellow-600', 
                'bg-green-100 text-green-600',
                'bg-orange-100 text-orange-600'
              ];
              const colorClass = colors[index % colors.length];
              
              return (
                <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <div className={`w-12 h-12 ${colorClass.split(' ')[0]} rounded-lg flex items-center justify-center mb-4`}>
                    <feature.icon className={`w-6 h-6 ${colorClass.split(' ')[1]}`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* AI Assistant Showcase Section */}
      <section className="py-20 bg-gradient-to-br from-red-50 via-yellow-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Your AI Parliamentary Assistant
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get instant answers, voice-powered insights, and intelligent analysis of parliamentary proceedings. 
              Our AI assistant is always ready to help you navigate complex legislative information.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MicrophoneIcon className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Voice-Powered Interaction</h3>
                    <p className="text-gray-600">Speak naturally to ask questions about debates, bills, and parliamentary procedures. Our AI understands context and provides relevant answers.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <ChartBarIcon className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-Time Analysis</h3>
                    <p className="text-gray-600">Get instant insights on sentiment analysis, voting patterns, and legislative trends as they happen in Parliament.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <DocumentTextIcon className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Documentation</h3>
                    <p className="text-gray-600">Access comprehensive summaries, key points, and detailed explanations of complex legislative documents and proceedings.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-red-600 via-yellow-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <MicrophoneIcon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Assistant Active</h3>
                  <p className="text-gray-600">Click the floating assistant button to start chatting!</p>
                </div>
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-2">Try asking:</p>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• "What are the latest debates on education?"</li>
                      <li>• "Show me voting patterns for the NPP party"</li>
                      <li>• "Explain the current bill on healthcare reform"</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple steps to access comprehensive parliamentary insights
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">1</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Sign Up</h3>
              <p className="text-gray-600">Create your account to access the platform</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">2</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Explore</h3>
              <p className="text-gray-600">Browse debates, bills, and member profiles</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">3</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Analyze</h3>
              <p className="text-gray-600">Use AI insights to understand parliamentary trends</p>
            </div>
          </div>
        </div>
      </section>

      {/* Parliamentary News Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ParliamentNewsFeed />
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Parliamentarians
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See what our users say about the platform
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    
      {/* Contact Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-20">
            <div>
              <div className="mb-8">
                <p className="mb-3 font-semibold text-red-600">Connect</p>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Get in Touch</h2>
                <p className="text-lg text-gray-600">
                  We are here to assist you with your inquiries about parliamentary proceedings, legislative information, and platform support.
                </p>
              </div>
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Enter your email address"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <select
                    id="subject"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="technical">Technical Support</option>
                    <option value="parliamentary">Parliamentary Information</option>
                    <option value="feedback">Feedback</option>
                    <option value="partnership">Partnership</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Type your message here..."
                  ></textarea>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="terms"
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                  <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                    I agree to the <a href="#" className="text-red-600 hover:text-red-700 underline">Terms of Service</a> and <a href="#" className="text-red-600 hover:text-red-700 underline">Privacy Policy</a>
                  </label>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-red-600 to-green-600 hover:from-red-700 hover:to-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Send Message
                </button>
              </form>
            </div>
            <div>
              <div className="bg-white rounded-xl shadow-lg p-8 h-full">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h3>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Address</h4>
                      <p className="text-gray-600">Parliament House<br />Accra, Ghana</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Phone</h4>
                      <p className="text-gray-600">+233 30 123 4567</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Email</h4>
                      <p className="text-gray-600">info@ghanaparliament.gov.gh</p>
                    </div>
                  </div>
                </div>
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-4">Office Hours</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Monday - Friday</span>
                      <span>8:00 AM - 5:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturday</span>
                      <span>9:00 AM - 1:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunday</span>
                      <span>Closed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-red-600 via-yellow-500 to-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Parliamentary Transparency?
          </h2>
          <p className="text-xl text-yellow-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already using our platform to stay informed about Ghana's parliamentary proceedings.
          </p>
          <Link
            href="/auth"
            className="bg-white hover:bg-gray-100 text-red-600 px-8 py-4 rounded-lg text-lg font-semibold transition-colors inline-flex items-center shadow-lg hover:shadow-xl"
          >
            Get Started Today
            <ArrowRightIcon className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Redesigned Footer */}
      <footer className="bg-gray-900 text-white">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-4">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-red-600 via-yellow-500 to-green-600 rounded-lg flex items-center justify-center">
                  <div className="w-7 h-7 bg-white rounded flex items-center justify-center">
                    <div className="w-5 h-5 bg-gradient-to-r from-red-600 via-yellow-500 to-green-600 rounded"></div>
                  </div>
                </div>
                <span className="text-2xl font-bold">Ghana Parliamentary Hub</span>
              </div>
              <p className="text-gray-400 mb-8 text-lg leading-relaxed">
                Empowering transparency and accountability in Ghana's parliamentary democracy through AI-powered insights and real-time analytics.
              </p>
              
              {/* Newsletter Subscription */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
                <form className="space-y-3">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3 border border-gray-600 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-red-600 to-green-600 hover:from-red-700 hover:to-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300"
                  >
                    Subscribe to Newsletter
                  </button>
                </form>
                <p className="text-xs text-gray-500 mt-2">
                  Get the latest parliamentary updates and legislative insights.
              </p>
            </div>

              {/* Social Media */}
            <div>
                <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
                <div className="flex space-x-3">
                  <a href="#" className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors group">
                    <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                  </a>
                  <a href="#" className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors group">
                    <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                    </svg>
                  </a>
                  <a href="#" className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-800 transition-colors group">
                    <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                  <a href="#" className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors group">
                    <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="lg:col-span-2">
              <h3 className="text-lg font-semibold mb-6 text-white">Platform</h3>
              <ul className="space-y-4">
                <li><Link href="/debates" className="text-gray-400 hover:text-white transition-colors text-sm">Debates</Link></li>
                <li><Link href="/bills" className="text-gray-400 hover:text-white transition-colors text-sm">Bills & Legislation</Link></li>
                <li><Link href="/members" className="text-gray-400 hover:text-white transition-colors text-sm">Members</Link></li>
                <li><Link href="/schedule" className="text-gray-400 hover:text-white transition-colors text-sm">Schedule</Link></li>
                <li><Link href="/archives" className="text-gray-400 hover:text-white transition-colors text-sm">Archives</Link></li>
                <li><Link href="/analytics" className="text-gray-400 hover:text-white transition-colors text-sm">Analytics</Link></li>
              </ul>
            </div>

            {/* Resources */}
            <div className="lg:col-span-2">
              <h3 className="text-lg font-semibold mb-6 text-white">Resources</h3>
              <ul className="space-y-4">
                <li><Link href="/help" className="text-gray-400 hover:text-white transition-colors text-sm">Help Center</Link></li>
                <li><Link href="/docs" className="text-gray-400 hover:text-white transition-colors text-sm">Documentation</Link></li>
                <li><Link href="/api" className="text-gray-400 hover:text-white transition-colors text-sm">API</Link></li>
                <li><Link href="/news" className="text-gray-400 hover:text-white transition-colors text-sm">News & Updates</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors text-sm">Contact Us</Link></li>
                <li><Link href="/status" className="text-gray-400 hover:text-white transition-colors text-sm">Status</Link></li>
              </ul>
            </div>

            {/* Contact Information */}
            <div className="lg:col-span-4">
              <h3 className="text-lg font-semibold mb-6 text-white">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Address</h4>
                    <p className="text-gray-400 text-sm">Parliament House<br />Accra, Ghana</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Phone</h4>
                    <p className="text-gray-400 text-sm">+233 30 123 4567</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
            </div>
            <div>
                    <h4 className="font-semibold text-white mb-1">Email</h4>
                    <p className="text-gray-400 text-sm">info@ghanaparliament.gov.gh</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-center md:text-left">
                <p className="text-gray-400 text-sm">
                  &copy; 2024 Ghana Parliamentary Hub. All rights reserved.
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  Empowering democracy through technology and transparency.
                </p>
              </div>
              <div className="flex flex-wrap justify-center md:justify-end space-x-6">
                <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Terms of Service
                </Link>
                <Link href="/cookies" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Cookie Settings
                </Link>
                <Link href="/accessibility" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Accessibility
                </Link>
            </div>
          </div>
          </div>
        </div>
      </footer>

      {/* AI Assistant Widget */}
      <AIAssistant />

      {/* Video Modal */}
      {isVideoPlaying && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative w-full max-w-4xl mx-4">
            <button
              onClick={() => setIsVideoPlaying(false)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <XMarkIcon className="w-8 h-8" />
            </button>
            <div className="bg-white rounded-lg overflow-hidden">
              <video
                src="/video/watch Demo.mp4"
                controls
                autoPlay
                className="w-full h-auto"
                onEnded={() => setIsVideoPlaying(false)}
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
