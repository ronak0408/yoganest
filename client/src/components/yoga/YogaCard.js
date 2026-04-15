import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { userAPI } from '../../utils/api';
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

function HeartIcon({ filled }) {
  return (
    <svg className="w-5 h-5" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  );
}

export default function YogaCard({ module, onFavoriteToggle }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [favorited, setFavorited] = useState(module?.isFavorited || false);
  const [favLoading, setFavLoading] = useState(false);

  const category = module?.category?.toLowerCase() || 'default';
  const gradient = CATEGORY_GRADIENTS[category] || CATEGORY_GRADIENTS.default;

  const handleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setFavLoading(true);
    try {
      await userAPI.toggleFavorite(module._id);
      setFavorited((v) => !v);
      onFavoriteToggle?.();
    } catch (err) {
      // silently ignore
    } finally {
      setFavLoading(false);
    }
  };

  return (
    <Link to={`/modules/${module._id}`} className="block group">
      <div className="card overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-300">
        {/* Gradient image placeholder */}
        <div className={`h-40 bg-gradient-to-br ${gradient} flex items-center justify-center relative`}>
          <span className="text-5xl opacity-80">🧘</span>
          {/* Category badge */}
          <span className="absolute top-2 left-2 bg-white/20 text-white text-xs font-semibold px-2 py-0.5 rounded-full backdrop-blur-sm capitalize">
            {module?.category}
          </span>
          {/* Favorite button */}
          {isAuthenticated && (
            <button
              onClick={handleFavorite}
              disabled={favLoading}
              className={`absolute top-2 right-2 p-1.5 rounded-full transition-colors ${
                favorited
                  ? 'text-red-500 bg-white/30'
                  : 'text-white bg-white/20 hover:bg-white/30'
              }`}
              aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
            >
              <HeartIcon filled={favorited} />
            </button>
          )}
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <DifficultyBadge difficulty={module?.difficultyLevel} />
            <span className="text-xs text-secondary-500 dark:text-secondary-400 flex items-center space-x-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{module?.duration} min</span>
            </span>
          </div>
          <h3 className="font-semibold text-secondary-900 dark:text-white mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-1">
            {module?.title}
          </h3>
          <p className="text-secondary-500 dark:text-secondary-400 text-sm line-clamp-2 mb-3">
            {module?.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-primary-600 dark:text-primary-400 text-sm font-semibold group-hover:underline">
              Start Session →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
