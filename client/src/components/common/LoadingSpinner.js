import React from 'react';

export default function LoadingSpinner({ message = '' }) {
  return (
    <div className="flex flex-col items-center justify-center space-y-3">
      <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      {message && (
        <p className="text-secondary-500 dark:text-secondary-400 text-sm font-medium">{message}</p>
      )}
    </div>
  );
}
