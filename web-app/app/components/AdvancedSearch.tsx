'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MagnifyingGlassIcon,
  XMarkIcon,
  FunnelIcon,
  CalendarIcon,
  TagIcon,
  UserGroupIcon,
  DocumentTextIcon,
  MicrophoneIcon,
} from '@heroicons/react/24/outline';

interface SearchResult {
  id: string;
  title: string;
  type: 'debate' | 'bill' | 'member' | 'news';
  description: string;
  date?: string;
  category?: string;
  relevance: number;
}

interface AdvancedSearchProps {
  onSearch: (query: string, filters: SearchFilters) => void;
  placeholder?: string;
  className?: string;
}

interface SearchFilters {
  type: string[];
  dateRange: string;
  category: string[];
  party: string[];
}

const mockSearchResults: SearchResult[] = [
  {
    id: '1',
    title: 'Education Reform Bill 2024',
    type: 'bill',
    description: 'Comprehensive education reform focusing on curriculum modernization',
    date: '2024-01-15',
    category: 'Education',
    relevance: 95
  },
  {
    id: '2',
    title: 'Healthcare Funding Debate',
    type: 'debate',
    description: 'Parliamentary debate on healthcare funding allocation',
    date: '2024-01-12',
    category: 'Healthcare',
    relevance: 88
  },
  {
    id: '3',
    title: 'Rt. Hon. Alban Bagbin',
    type: 'member',
    description: 'Speaker of Parliament',
    category: 'Leadership',
    relevance: 92
  }
];

const searchTypes = [
  { value: 'all', label: 'All', icon: MagnifyingGlassIcon },
  { value: 'debates', label: 'Debates', icon: MicrophoneIcon },
  { value: 'bills', label: 'Bills', icon: DocumentTextIcon },
  { value: 'members', label: 'Members', icon: UserGroupIcon },
  { value: 'news', label: 'News', icon: TagIcon }
];

const categories = [
  'Education', 'Healthcare', 'Economy', 'Infrastructure', 
  'Environment', 'Security', 'Agriculture', 'Technology'
];

const parties = ['NPP', 'NDC', 'Independent', 'Other'];

export default function AdvancedSearch({ 
  onSearch, 
  placeholder = "Search debates, bills, members, or news...",
  className = ""
}: AdvancedSearchProps) {
  const [query, setQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [filters, setFilters] = useState<SearchFilters>({
    type: ['all'],
    dateRange: 'all',
    category: [],
    party: []
  });
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Generate suggestions based on query
  useEffect(() => {
    if (query.length > 2) {
      const filtered = mockSearchResults.filter(result =>
        result.title.toLowerCase().includes(query.toLowerCase()) ||
        result.description.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query]);

  const handleSearch = () => {
    onSearch(query, filters);
    setShowSuggestions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (selectedSuggestion >= 0 && suggestions[selectedSuggestion]) {
        const suggestion = suggestions[selectedSuggestion];
        setQuery(suggestion.title);
        setShowSuggestions(false);
        onSearch(suggestion.title, filters);
      } else {
        handleSearch();
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedSuggestion(prev => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedSuggestion(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setSelectedSuggestion(-1);
    }
  };

  const handleSuggestionClick = (suggestion: SearchResult) => {
    setQuery(suggestion.title);
    setShowSuggestions(false);
    onSearch(suggestion.title, filters);
  };

  const toggleFilter = (filterType: keyof SearchFilters, value: string) => {
    setFilters(prev => {
      const currentValues = prev[filterType] as string[];
      if (filterType === 'type' && value === 'all') {
        return { ...prev, [filterType]: ['all'] };
      }
      if (filterType === 'type' && currentValues.includes('all')) {
        return { ...prev, [filterType]: [value] };
      }
      if (currentValues.includes(value)) {
        return { 
          ...prev, 
          [filterType]: currentValues.filter(v => v !== value)
        };
      } else {
        return { 
          ...prev, 
          [filterType]: [...currentValues, value]
        };
      }
    });
  };

  const getTypeIcon = (type: string) => {
    const typeConfig = searchTypes.find(t => t.value === type);
    return typeConfig ? typeConfig.icon : MagnifyingGlassIcon;
  };

  const getTypeColor = (type: string) => {
    const colors = {
      debate: 'bg-blue-100 text-blue-700',
      bill: 'bg-green-100 text-green-700',
      member: 'bg-purple-100 text-purple-700',
      news: 'bg-orange-100 text-orange-700'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* Main Search Input */}
      <div className="relative">
        <div className="flex items-center bg-white rounded-lg shadow-sm border border-gray-200 focus-within:ring-2 focus-within:ring-red-500 focus-within:border-transparent transition-all duration-200">
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 ml-4" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => query.length > 2 && setShowSuggestions(true)}
            placeholder={placeholder}
            className="flex-1 px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none"
          />
          <div className="flex items-center space-x-2 pr-4">
            {query && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                onClick={() => setQuery('')}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <XMarkIcon className="w-4 h-4" />
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsExpanded(!isExpanded)}
              className={`p-2 rounded-md transition-colors duration-200 ${
                isExpanded 
                  ? 'bg-red-100 text-red-600' 
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
              }`}
            >
              <FunnelIcon className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSearch}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200"
            >
              Search
            </motion.button>
          </div>
        </div>

        {/* Search Suggestions */}
        <AnimatePresence>
          {showSuggestions && suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-80 overflow-y-auto"
            >
              {suggestions.map((suggestion, index) => {
                const IconComponent = getTypeIcon(suggestion.type);
                return (
                  <motion.div
                    key={suggestion.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className={`p-4 cursor-pointer transition-colors duration-200 ${
                      selectedSuggestion === index 
                        ? 'bg-red-50 border-l-4 border-red-500' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${getTypeColor(suggestion.type)}`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {suggestion.title}
                          </h4>
                          <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(suggestion.type)}`}>
                            {suggestion.type}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {suggestion.description}
                        </p>
                        {suggestion.date && (
                          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                            <div className="flex items-center space-x-1">
                              <CalendarIcon className="w-3 h-3" />
                              <span>{suggestion.date}</span>
                            </div>
                            {suggestion.category && (
                              <div className="flex items-center space-x-1">
                                <TagIcon className="w-3 h-3" />
                                <span>{suggestion.category}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="text-xs text-gray-400">
                        {suggestion.relevance}%
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Advanced Filters */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Search Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Search Type
                </label>
                <div className="space-y-2">
                  {searchTypes.map((type) => {
                    const IconComponent = type.icon;
                    return (
                      <motion.label
                        key={type.value}
                        whileHover={{ scale: 1.02 }}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={filters.type.includes(type.value)}
                          onChange={() => toggleFilter('type', type.value)}
                          className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                        />
                        <IconComponent className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700">{type.label}</span>
                      </motion.label>
                    );
                  })}
                </div>
              </div>

              {/* Date Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Date Range
                </label>
                <select
                  value={filters.dateRange}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="quarter">This Quarter</option>
                  <option value="year">This Year</option>
                </select>
              </div>

              {/* Categories */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Categories
                </label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {categories.map((category) => (
                    <motion.label
                      key={category}
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={filters.category.includes(category)}
                        onChange={() => toggleFilter('category', category)}
                        className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                      />
                      <span className="text-sm text-gray-700">{category}</span>
                    </motion.label>
                  ))}
                </div>
              </div>

              {/* Political Parties */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Political Parties
                </label>
                <div className="space-y-2">
                  {parties.map((party) => (
                    <motion.label
                      key={party}
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={filters.party.includes(party)}
                        onChange={() => toggleFilter('party', party)}
                        className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                      />
                      <span className="text-sm text-gray-700">{party}</span>
                    </motion.label>
                  ))}
                </div>
              </div>
            </div>

            {/* Filter Actions */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilters({
                  type: ['all'],
                  dateRange: 'all',
                  category: [],
                  party: []
                })}
                className="text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
              >
                Clear All Filters
              </motion.button>
              <div className="flex items-center space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsExpanded(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSearch}
                  className="px-6 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors duration-200"
                >
                  Apply Filters
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
