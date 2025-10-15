'use client';

import { useState, useEffect } from 'react';
import { 
  DocumentTextIcon, 
  CalendarIcon, 
  ArrowTopRightOnSquareIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

interface VotesProceedingsItem {
  date: string;
  title: string;
  url: string;
  formattedDate: string;
  dayOfWeek: string;
}

interface VotesProceedingsData {
  proceedings: VotesProceedingsItem[];
  totalPages: number;
  currentPage: number;
  lastUpdated: string;
}

export default function VotesProceedingsFeed() {
  const [proceedingsData, setProceedingsData] = useState<VotesProceedingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    let cancelled = false;
    async function loadProceedings() {
      try {
        setLoading(true);
        const res = await fetch(`/api/parliament/votes-proceedings?page=${currentPage}`, { cache: 'no-store' });
        const json = await res.json();
        if (!res.ok || !json?.success) throw new Error(json?.error || 'Failed');
        if (!cancelled) {
          setProceedingsData(json.data);
        }
      } catch (e: unknown) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load votes and proceedings');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadProceedings();
    return () => { cancelled = true; };
  }, [currentPage]);

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

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= (proceedingsData?.totalPages || 1)) {
      setCurrentPage(newPage);
    }
  };

  const refreshData = () => {
    setCurrentPage(1);
    setError(null);
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
          <DocumentTextIcon className="w-8 h-8 mx-auto" />
        </div>
        <p className="text-sm text-gray-600 mb-4">{error}</p>
        <button
          onClick={refreshData}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!proceedingsData || proceedingsData.proceedings.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 mb-2">
          <DocumentTextIcon className="w-8 h-8 mx-auto" />
        </div>
        <p className="text-sm text-gray-600">No votes and proceedings available.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header with refresh button */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Votes & Proceedings</h3>
        <button
          onClick={refreshData}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          title="Refresh data"
        >
          <ArrowPathIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Proceedings List */}
      <div className="space-y-3">
        {proceedingsData.proceedings.map((proceeding, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                    {proceeding.dayOfWeek}
                  </span>
                  <div className="flex items-center text-xs text-gray-500">
                    <CalendarIcon className="w-3 h-3 mr-1" />
                    {formatDate(proceeding.formattedDate)}
                  </div>
                </div>
                <h4 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">
                  {proceeding.title}
                </h4>
                <p className="text-xs text-gray-600">
                  {proceeding.date}
                </p>
              </div>
              <a
                href={proceeding.url}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-3 p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                title="View document"
              >
                <ArrowTopRightOnSquareIcon className="w-4 h-4" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {proceedingsData.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {proceedingsData.totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === proceedingsData.totalPages}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
          <div className="text-xs text-gray-500">
            Last updated: {new Date(proceedingsData.lastUpdated).toLocaleTimeString()}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-gray-200 text-center">
        <p className="text-xs text-gray-500">
          Data sourced from{' '}
          <a
            href="https://www.parliament.gh/docs?type=VP"
            target="_blank"
            rel="noopener noreferrer"
            className="text-red-600 hover:text-red-700 font-medium"
          >
            Parliament of Ghana Votes & Proceedings
          </a>
        </p>
      </div>
    </div>
  );
}
