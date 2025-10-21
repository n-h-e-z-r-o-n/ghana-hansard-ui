'use client';

import { useState, useEffect } from 'react';
import { 
  UserGroupIcon, 
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';

interface ParliamentLeader {
  name: string;
  position: string;
  imageUrl?: string;
  bio?: string;
  contact?: string;
}

interface ParliamentLeadershipData {
  leaders: ParliamentLeader[];
  lastUpdated: string;
}

export default function ParliamentLeadership() {
  const [leadershipData, setLeadershipData] = useState<ParliamentLeadershipData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function loadLeadership() {
      try {
        setLoading(true);
        const res = await fetch('/api/parliament/leadership', { cache: 'no-store' });
        const json = await res.json();
        if (!res.ok || !json?.success) throw new Error(json?.error || 'Failed');
        if (!cancelled) {
          setLeadershipData(json.data);
        }
      } catch (e: unknown) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load leadership data');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadLeadership();
    return () => { cancelled = true; };
  }, []);

  const getPositionColor = (position: string) => {
    const positionLower = position.toLowerCase();
    if (positionLower.includes('speaker')) return 'bg-red-100 text-red-800';
    if (positionLower.includes('majority')) return 'bg-blue-100 text-blue-800';
    if (positionLower.includes('minority')) return 'bg-green-100 text-green-800';
    if (positionLower.includes('deputy')) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
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
          <UserGroupIcon className="w-8 h-8 mx-auto" />
        </div>
        <p className="text-sm text-gray-600">{error}</p>
      </div>
    );
  }

  if (!leadershipData || leadershipData.leaders.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 mb-2">
          <UserGroupIcon className="w-8 h-8 mx-auto" />
        </div>
        <p className="text-sm text-gray-600">No leadership information available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Leadership List */}
      {leadershipData.leaders.map((leader, index) => (
        <div key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
          {/* Avatar */}
          <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-green-100 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden relative border-2 border-white shadow-sm">
            {leader.imageUrl ? (
              <>
                <img
                  src={leader.imageUrl}
                  alt={leader.name}
                  className="w-12 h-12 rounded-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-sm bg-gradient-to-br from-red-500 to-green-500" style={{ display: 'none' }}>
                  {getInitials(leader.name)}
                </div>
              </>
            ) : (
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-sm bg-gradient-to-br from-red-500 to-green-500">
                {getInitials(leader.name)}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-gray-900 truncate">
              {leader.name}
            </h4>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPositionColor(leader.position)}`}>
                {leader.position}
              </span>
            </div>
            {leader.bio && (
              <p className="text-xs text-gray-600 mt-1 line-clamp-1">
                {leader.bio}
              </p>
            )}
          </div>

          {/* Icon */}
          <div className="flex-shrink-0">
            <BuildingOfficeIcon className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      ))}

      {/* Footer */}
      <div className="mt-3 pt-3 border-t border-gray-200 text-center">
        <p className="text-xs text-gray-500">
          Data from{' '}
          <a
            href="https://www.parliament.gh/gen?LD"
            target="_blank"
            rel="noopener noreferrer"
            className="text-red-600 hover:text-red-700 font-medium"
          >
            Parliament.gh
          </a>
        </p>
      </div>
    </div>
  );
}
