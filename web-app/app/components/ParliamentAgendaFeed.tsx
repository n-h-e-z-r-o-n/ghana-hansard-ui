'use client';

import { useState, useEffect } from 'react';
import { 
  CalendarDaysIcon, 
  CalendarIcon, 
  ArrowTopRightOnSquareIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

interface AgendaItem {
  date: string;
  title: string;
  url: string;
  formattedDate: string;
  dayOfWeek: string;
  meetingType: string;
}

interface AgendaData {
  agendas: AgendaItem[];
  totalPages: number;
  currentPage: number;
  lastUpdated: string;
}

export default function ParliamentAgendaFeed() {
  const [agendaData, setAgendaData] = useState<AgendaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    let cancelled = false;
    async function loadAgenda() {
      try {
        setLoading(true);
        const res = await fetch(`/api/parliament/agenda?page=${currentPage}`, { cache: 'no-store' });
        const json = await res.json();
        if (!res.ok || !json?.success) throw new Error(json?.error || 'Failed');
        if (!cancelled) {
          setAgendaData(json.data);
        }
      } catch (e: unknown) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load parliament agenda');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadAgenda();
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

  const getMeetingTypeColor = (meetingType: string) => {
    const colors: Record<string, string> = {
      'First Meeting': 'bg-blue-100 text-blue-800',
      'Second Meeting': 'bg-green-100 text-green-800',
      'Third Meeting': 'bg-purple-100 text-purple-800',
      'Fourth Meeting': 'bg-orange-100 text-orange-800',
      'Fifth Meeting': 'bg-pink-100 text-pink-800',
      'Sixth Meeting': 'bg-indigo-100 text-indigo-800',
      'Seventh Meeting': 'bg-yellow-100 text-yellow-800',
      'Eighth Meeting': 'bg-red-100 text-red-800',
      'Ninth Meeting': 'bg-teal-100 text-teal-800',
      'Tenth Meeting': 'bg-cyan-100 text-cyan-800',
      'Parliamentary Meeting': 'bg-gray-100 text-gray-800'
    };
    return colors[meetingType] || colors['Parliamentary Meeting'];
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= (agendaData?.totalPages || 1)) {
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
          <CalendarDaysIcon className="w-8 h-8 mx-auto" />
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

  if (!agendaData || agendaData.agendas.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 mb-2">
          <CalendarDaysIcon className="w-8 h-8 mx-auto" />
        </div>
        <p className="text-sm text-gray-600">No agenda items available.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header with refresh button */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Parliamentary Agenda</h3>
        <button
          onClick={refreshData}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          title="Refresh data"
        >
          <ArrowPathIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Agenda List */}
      <div className="space-y-3">
        {agendaData.agendas.map((agenda, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMeetingTypeColor(agenda.meetingType)}`}>
                    {agenda.meetingType}
                  </span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                    {agenda.dayOfWeek}
                  </span>
                  <div className="flex items-center text-xs text-gray-500">
                    <CalendarIcon className="w-3 h-3 mr-1" />
                    {formatDate(agenda.formattedDate)}
                  </div>
                </div>
                <h4 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">
                  {agenda.title}
                </h4>
                <p className="text-xs text-gray-600">
                  {agenda.date}
                </p>
              </div>
              <a
                href={agenda.url}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-3 p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                title="View agenda document"
              >
                <ArrowTopRightOnSquareIcon className="w-4 h-4" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {agendaData.totalPages > 1 && (
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
              Page {currentPage} of {agendaData.totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === agendaData.totalPages}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
          <div className="text-xs text-gray-500">
            Last updated: {new Date(agendaData.lastUpdated).toLocaleTimeString()}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-gray-200 text-center">
        <p className="text-xs text-gray-500">
          Data sourced from{' '}
          <a
            href="https://www.parliament.gh/docs?type=AG"
            target="_blank"
            rel="noopener noreferrer"
            className="text-red-600 hover:text-red-700 font-medium"
          >
            Parliament of Ghana Agenda
          </a>
        </p>
      </div>
    </div>
  );
}
