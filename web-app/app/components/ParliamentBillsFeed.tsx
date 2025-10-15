'use client';

import { useState, useEffect } from 'react';
import { 
  DocumentTextIcon, 
  CalendarIcon, 
  UserIcon,
  ArrowTopRightOnSquareIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowPathIcon,
  TagIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface ParliamentBill {
  title: string;
  laidBy: string;
  laidOn: string;
  gazettedOn: string;
  url: string;
  billNumber: string;
  category: string;
  status: string;
  stage: string;
  priority: string;
  description: string;
  tags: string[];
  formattedLaidOn: string;
  formattedGazettedOn: string;
}

interface ParliamentBillsData {
  bills: ParliamentBill[];
  totalPages: number;
  currentPage: number;
  lastUpdated: string;
}

export default function ParliamentBillsFeed() {
  const [billsData, setBillsData] = useState<ParliamentBillsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    let cancelled = false;
    async function loadBills() {
      try {
        setLoading(true);
        const res = await fetch(`/api/parliament/bills?page=${currentPage}`, { cache: 'no-store' });
        const json = await res.json();
        if (!res.ok || !json?.success) throw new Error(json?.error || 'Failed');
        if (!cancelled) {
          setBillsData(json.data);
        }
      } catch (e: unknown) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load parliament bills');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadBills();
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

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'introduced': 'bg-blue-100 text-blue-800',
      'in-progress': 'bg-yellow-100 text-yellow-800',
      'passed': 'bg-green-100 text-green-800',
      'failed': 'bg-red-100 text-red-800'
    };
    return colors[status] || colors['introduced'];
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Education': 'bg-blue-100 text-blue-800',
      'Finance': 'bg-green-100 text-green-800',
      'Health': 'bg-pink-100 text-pink-800',
      'Infrastructure': 'bg-yellow-100 text-yellow-800',
      'Environment': 'bg-emerald-100 text-emerald-800',
      'Technology': 'bg-indigo-100 text-indigo-800',
      'Governance': 'bg-gray-100 text-gray-800',
      'Social': 'bg-orange-100 text-orange-800',
      'Economic': 'bg-purple-100 text-purple-800',
      'Legal': 'bg-red-100 text-red-800',
      'General': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors['General'];
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      'high': 'bg-red-100 text-red-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'normal': 'bg-gray-100 text-gray-800'
    };
    return colors[priority] || colors['normal'];
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= (billsData?.totalPages || 1)) {
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

  if (!billsData || billsData.bills.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 mb-2">
          <DocumentTextIcon className="w-8 h-8 mx-auto" />
        </div>
        <p className="text-sm text-gray-600">No bills available.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header with refresh button */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Parliamentary Bills</h3>
        <button
          onClick={refreshData}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          title="Refresh data"
        >
          <ArrowPathIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Bills List */}
      <div className="space-y-4">
        {billsData.bills.map((bill, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                {/* Bill Number and Status */}
                <div className="flex items-center space-x-2 mb-2">
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
                    {bill.billNumber}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(bill.status)}`}>
                    {bill.stage}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(bill.category)}`}>
                    {bill.category}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(bill.priority)}`}>
                    {bill.priority}
                  </span>
                </div>

                {/* Title */}
                <h4 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2">
                  {bill.title}
                </h4>

                {/* Description */}
                <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                  {bill.description}
                </p>

                {/* Laid By */}
                <div className="flex items-center text-xs text-gray-500 mb-2">
                  <UserIcon className="w-3 h-3 mr-1" />
                  <span className="truncate">{bill.laidBy}</span>
                </div>

                {/* Dates */}
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <div className="flex items-center">
                    <CalendarIcon className="w-3 h-3 mr-1" />
                    <span>Laid: {formatDate(bill.formattedLaidOn)}</span>
                  </div>
                  {bill.gazettedOn && (
                    <div className="flex items-center">
                      <ClockIcon className="w-3 h-3 mr-1" />
                      <span>Gazetted: {formatDate(bill.formattedGazettedOn)}</span>
                    </div>
                  )}
                </div>

                {/* Tags */}
                {bill.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {bill.tags.slice(0, 3).map((tag, tagIndex) => (
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
              </div>
              <a
                href={bill.url}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-3 p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                title="View bill document"
              >
                <ArrowTopRightOnSquareIcon className="w-4 h-4" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {billsData.totalPages > 1 && (
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
              Page {currentPage} of {billsData.totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === billsData.totalPages}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
          <div className="text-xs text-gray-500">
            Last updated: {new Date(billsData.lastUpdated).toLocaleTimeString()}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-gray-200 text-center">
        <p className="text-xs text-gray-500">
          Data sourced from{' '}
          <a
            href="https://www.parliament.gh/docs?type=Bills&OT"
            target="_blank"
            rel="noopener noreferrer"
            className="text-red-600 hover:text-red-700 font-medium"
          >
            Parliament of Ghana Bills
          </a>
        </p>
      </div>
    </div>
  );
}
