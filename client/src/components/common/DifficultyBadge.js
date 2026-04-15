import React from 'react';

const DIFFICULTY_STYLES = {
  beginner: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  intermediate: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
  advanced: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

export default function DifficultyBadge({ difficulty = 'beginner' }) {
  const key = difficulty.toLowerCase();
  const style = DIFFICULTY_STYLES[key] || DIFFICULTY_STYLES.beginner;
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${style}`}>
      {difficulty}
    </span>
  );
}
