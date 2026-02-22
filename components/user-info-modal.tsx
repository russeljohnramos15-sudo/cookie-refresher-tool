'use client';

import { X, Copy, Check } from 'lucide-react';
import { useState } from 'react';

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

interface UserInfoModalProps {
  user: UserData;
  newCookie: string;
  cookieRefreshed: boolean;
  onClose: () => void;
}

export function UserInfoModal({ user, newCookie, cookieRefreshed, onClose }: UserInfoModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(newCookie);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = newCookie;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const stats = [
    { label: 'Robux', value: user.robux },
    { label: 'Pending Robux', value: user.pendingRobux },
    { label: 'Summary', value: user.summary },
    { label: "User's RAP", value: user.rap },
    { label: 'Credit', value: user.credit },
    { label: 'Groups Owned', value: user.groupsOwned },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        role="presentation"
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-[#1a1a2e] rounded-2xl shadow-2xl border border-gray-800 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* User Avatar and Name */}
        <div className="flex flex-col items-center pt-8 pb-4 px-6">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={`${user.displayName}'s avatar`}
              className="w-20 h-20 rounded-full border-2 border-gray-700 mb-3"
              crossOrigin="anonymous"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center mb-3">
              <span className="text-2xl text-gray-400 font-bold">
                {user.displayName.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <h2 className="text-xl font-bold text-white">{user.displayName}</h2>
          <p className="text-gray-400 text-sm">@{user.name}</p>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="mt-3 flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors border border-gray-700"
          >
            {copied ? (
              <>
                {'Copied'}
                <Check className="w-4 h-4 text-green-400" />
              </>
            ) : (
              <>
                {'Copy'}
                <Copy className="w-4 h-4" />
              </>
            )}
          </button>

          {cookieRefreshed && (
            <p className="mt-2 text-xs text-green-400 font-medium">
              Cookie refreshed successfully
            </p>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-px bg-gray-800/50 mx-6 rounded-lg overflow-hidden mb-6">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-[#1a1a2e] p-3 text-center">
              <p className="text-gray-400 text-xs font-medium">{stat.label}</p>
              <p className="text-white font-bold text-lg">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
