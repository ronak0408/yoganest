import React from 'react';

function CheckIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    </svg>
  );
}

export default function PostureFeedback({ message, type = 'info' }) {
  const isGood = type === 'success' || message?.startsWith('✅');

  return (
    <div
      className={`flex items-center space-x-3 p-4 rounded-lg font-medium text-sm transition-all duration-500 animate-fade-in ${
        isGood
          ? 'bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800'
          : 'bg-amber-50 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-800'
      }`}
    >
      <span className={isGood ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}>
        {isGood ? <CheckIcon /> : <WarningIcon />}
      </span>
      <span>{message}</span>
    </div>
  );
}
