import React from 'react';

const CATEGORIES = ['All', 'Flexibility', 'Strength', 'Relaxation', 'Balance', 'Meditation', 'Energy'];
const DIFFICULTIES = ['All', 'Beginner', 'Intermediate', 'Advanced'];

export default function CategoryFilter({ selectedCategory, selectedDifficulty, onCategoryChange, onDifficultyChange }) {
  return (
    <div className="space-y-4">
      {/* Category filter */}
      <div>
        <p className="text-sm font-semibold text-secondary-600 dark:text-secondary-400 mb-2">Category</p>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 ${
                selectedCategory === cat
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-secondary-100 dark:bg-secondary-700 text-secondary-700 dark:text-secondary-300 hover:bg-primary-100 dark:hover:bg-secondary-600 hover:text-primary-700 dark:hover:text-primary-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Difficulty filter */}
      <div>
        <p className="text-sm font-semibold text-secondary-600 dark:text-secondary-400 mb-2">Difficulty</p>
        <div className="flex flex-wrap gap-2">
          {DIFFICULTIES.map((diff) => (
            <button
              key={diff}
              onClick={() => onDifficultyChange(diff)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 ${
                selectedDifficulty === diff
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-secondary-100 dark:bg-secondary-700 text-secondary-700 dark:text-secondary-300 hover:bg-primary-100 dark:hover:bg-secondary-600 hover:text-primary-700 dark:hover:text-primary-300'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
