import React from 'react';
import { Link } from 'react-router-dom';
import DifficultyBadge from '../common/DifficultyBadge';

const CATEGORY_GRADIENTS = {
  flexibility: 'from-blue-400 to-indigo-500',
  strength: 'from-orange-400 to-red-500',
  relaxation: 'from-purple-400 to-pink-500',
  balance: 'from-teal-400 to-cyan-500',
  meditation: 'from-violet-400 to-purple-600',
  energy: 'from-yellow-400 to-orange-500',
  default: 'from-primary-400 to-primary-600',
};

export default function RecommendationCard({ module }) {
  const category = module?.category?.toLowerCase() || 'default';
  const gradient = CATEGORY_GRADIENTS[category] || CATEGORY_GRADIENTS.default;

  return (
    <Link to={`/modules/${module?._id}`} className="block group">
      <div className="card flex items-center space-x-3 p-3 group-hover:scale-[1.01] transform transition-transform duration-200">
        <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0`}>
          <span className="text-2xl">🧘</span>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-secondary-900 dark:text-white text-sm group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-1">
            {module?.title}
          </h4>
          <div className="flex items-center space-x-2 mt-0.5">
            <DifficultyBadge difficulty={module?.difficulty} />
            <span className="text-xs text-secondary-400 dark:text-secondary-500">{module?.duration} min</span>
          </div>
        </div>
        <svg className="w-4 h-4 text-secondary-400 dark:text-secondary-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}
