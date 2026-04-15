import React from 'react';

export default function LoadingSpinner({ size = 'md', message = '' }) {
  const sizes = {
    sm: 'h-6 w-6 border-2',
    md: 'h-10 w-10 border-4',
    lg: 'h-16 w-16 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] gap-4">
      <div
        className={`${sizes[size]} rounded-full border-green-200 border-t-green-600 animate-spin`}
      />
      {message && (
        <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">{message}</p>
      )}
    </div>
  );
}
