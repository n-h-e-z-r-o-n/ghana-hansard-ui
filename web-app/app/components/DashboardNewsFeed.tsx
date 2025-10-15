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

export default function DashboardNewsFeed() {
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
      } catch (e: unknown) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load news');
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
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-2">
          <NewspaperIcon className="w-8 h-8 mx-auto" />
        </div>
        <p className="text-sm text-gray-600">{error}</p>
      </div>
    );
  }

  if (!newsData || newsData.news.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 mb-2">
          <NewspaperIcon className="w-8 h-8 mx-auto" />
        </div>
        <p className="text-sm text-gray-600">No news available at the moment.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Compact Filter Toggle */}
      <div className="mb-4 flex justify-end">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-1 px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          aria-pressed={showFilters}
        >
          <FunnelIcon className="w-4 h-4" />
          <span>Filter</span>
          {showFilters ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
        </button>
      </div>

      {/* Category Filters */}
      {showFilters && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex flex-wrap gap-1">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
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
                  className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
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

      {/* Single Column News List */}
      <div className="space-y-4">
        {newsData.news.slice(0, 6).map((item, index) => (
          <article key={index} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-sm transition-shadow">
            <div className="flex">
              {/* Image */}
              <div className="w-24 h-24 bg-gray-200 flex-shrink-0">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.imageAlt || item.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        parent.innerHTML = `
                          <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-100 to-green-100">
                            <div class="text-center">
                              <div class="text-lg font-bold text-gray-600">📰</div>
                            </div>
                          </div>
                        `;
                      }
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-100 to-green-100">
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-600">📰</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1">
                      {item.title}
                    </h3>
                    <div className="flex items-center text-xs text-gray-500 mb-2">
                      <CalendarIcon className="w-3 h-3 mr-1" />
                      {formatDate(item.date)}
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ml-2 flex-shrink-0 ${getCategoryColor(item.category)}`}>
                    {item.category}
                  </span>
                </div>

                <p className="text-xs text-gray-600 line-clamp-2 mb-3">
                  {item.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {item.tags.slice(0, 2).map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-gray-100 text-gray-700"
                      >
                        <TagIcon className="w-2.5 h-2.5 mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-red-600 hover:text-red-700 text-xs font-medium transition-colors"
                  >
                    Read more
                    <ArrowTopRightOnSquareIcon className="w-3 h-3 ml-1" />
                  </a>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-gray-200 text-center">
        <p className="text-xs text-gray-500">
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
