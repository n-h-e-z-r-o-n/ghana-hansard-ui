'use client';

import { useState, useEffect } from 'react';
import { 
  NewspaperIcon, 
  CalendarIcon, 
  TagIcon,
  ArrowTopRightOnSquareIcon,
  FunnelIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';

interface ParliamentNewsItem {
  title: string;
  url: string;
  date: string;
  description: string;
  category: string;
  tags: string[];
  imageUrl?: string;
  imageAlt?: string;
}

interface ParliamentNewsData {
  news: ParliamentNewsItem[];
  categories: string[];
  total: number;
}

export default function ParliamentNewsFeed() {
  const [newsData, setNewsData] = useState<ParliamentNewsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function loadNews() {
      try {
        setLoading(true);
        const categoryParam = selectedCategory !== 'all' ? `?category=${selectedCategory}` : '';
        const res = await fetch(`/api/parliament/news${categoryParam}`, { cache: 'no-store' });
        const json = await res.json();
        if (!res.ok || !json?.success) throw new Error(json?.error || 'Failed');
        if (!cancelled) {
          setNewsData(json.data);
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Failed to load news');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadNews();
    return () => { cancelled = true; };
  }, [selectedCategory]);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Education': 'bg-blue-100 text-blue-800',
      'Economy': 'bg-green-100 text-green-800',
      'Security': 'bg-red-100 text-red-800',
      'Health': 'bg-pink-100 text-pink-800',
      'Infrastructure': 'bg-yellow-100 text-yellow-800',
      'Environment': 'bg-emerald-100 text-emerald-800',
      'International': 'bg-purple-100 text-purple-800',
      'Technology': 'bg-indigo-100 text-indigo-800',
      'Governance': 'bg-gray-100 text-gray-800',
      'Social': 'bg-orange-100 text-orange-800',
      'General': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors['General'];
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <NewspaperIcon className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to Load News</h3>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!newsData || newsData.news.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center">
          <div className="text-gray-400 mb-4">
            <NewspaperIcon className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No News Available</h3>
          <p className="text-gray-600">Check back later for the latest parliamentary updates.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-green-600 rounded-lg flex items-center justify-center">
            <NewspaperIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Latest Parliamentary News</h2>
            <p className="text-sm text-gray-600">Live updates from Parliament of Ghana</p>
          </div>
        </div>
        
        {/* Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <FunnelIcon className="w-4 h-4" />
          <span className="text-sm font-medium">Filter</span>
          {showFilters ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
        </button>
      </div>

      {/* Category Filters */}
      {showFilters && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              All ({newsData.total})
            </button>
            {newsData.categories.map((category) => {
              const count = newsData.news.filter(item => item.category === category).length;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-red-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {category} ({count})
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {newsData.news.map((item, index) => (
          <article key={index} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
            {/* Image */}
            {item.imageUrl && (
              <div className="relative h-48 bg-gray-200">
                <img
                  src={item.imageUrl}
                  alt={item.imageAlt || item.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Hide image if it fails to load
                    e.currentTarget.style.display = 'none';
                  }}
                />
                {/* Category Badge Overlay */}
                <div className="absolute top-3 left-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
                    {item.category}
                  </span>
                </div>
              </div>
            )}

            <div className="p-6">
              {/* Category Badge (if no image) */}
              {!item.imageUrl && (
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
                    {item.category}
                  </span>
                  <div className="flex items-center text-xs text-gray-500">
                    <CalendarIcon className="w-3 h-3 mr-1" />
                    {formatDate(item.date)}
                  </div>
                </div>
              )}

              {/* Date (if image exists) */}
              {item.imageUrl && (
                <div className="flex items-center text-xs text-gray-500 mb-3">
                  <CalendarIcon className="w-3 h-3 mr-1" />
                  {formatDate(item.date)}
                </div>
              )}

              {/* Title */}
              <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {item.description}
              </p>

              {/* Tags */}
              {item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {item.tags.slice(0, 3).map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700"
                    >
                      <TagIcon className="w-3 h-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Read More Link */}
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
              >
                Read more
                <ArrowTopRightOnSquareIcon className="w-4 h-4 ml-1" />
              </a>
            </div>
          </article>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-gray-200 text-center">
        <p className="text-sm text-gray-600">
          Data sourced from{' '}
          <a
            href="https://www.parliament.gh/news"
            target="_blank"
            rel="noopener noreferrer"
            className="text-red-600 hover:text-red-700 font-medium"
          >
            Parliament of Ghana News
          </a>
        </p>
      </div>
    </div>
  );
}
