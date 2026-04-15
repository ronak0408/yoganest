import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../utils/api';

const CATEGORY_GRADIENTS = {
  Flexibility: 'from-purple-400 to-indigo-500',
  Strength: 'from-orange-400 to-red-500',
  Relaxation: 'from-blue-400 to-cyan-500',
  Balance: 'from-yellow-400 to-amber-500',
  Meditation: 'from-teal-400 to-emerald-500',
  Energy: 'from-pink-400 to-rose-500',
  default: 'from-green-400 to-emerald-500',
};

const DIFFICULTY_STYLES = {
  Beginner: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  Intermediate: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
  Advanced: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
};

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          xmlns="http://www.w3.org/2000/svg"
          className={`h-3.5 w-3.5 ${
            star <= Math.round(rating || 0)
              ? 'text-yellow-400'
              : 'text-gray-300 dark:text-gray-600'
          }`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      {rating && (
        <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
          {Number(rating).toFixed(1)}
        </span>
      )}
    </div>
  );
}

export default function YogaCard({ module, onFavoriteToggle }) {
  const { isAuthenticated } = useAuth();
  const [isFav, setIsFav] = useState(module.isFavorite || false);
  const [favLoading, setFavLoading] = useState(false);

  const gradient = CATEGORY_GRADIENTS[module.category] || CATEGORY_GRADIENTS.default;
  const difficultyStyle = DIFFICULTY_STYLES[module.difficulty] || '';

  const handleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated || favLoading) return;

    setFavLoading(true);
    try {
      await api.post('/user/favorites', { moduleId: module._id });
      const next = !isFav;
      setIsFav(next);
      if (onFavoriteToggle) onFavoriteToggle(module._id, next);
    } catch {
      // silently fail
    } finally {
      setFavLoading(false);
    }
  };

  return (
    <div className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 dark:border-gray-700 flex flex-col">
      {/* Image / Gradient Banner */}
      <div className={`relative h-40 bg-gradient-to-br ${gradient} flex items-center justify-center`}>
        <span className="text-5xl opacity-80 group-hover:scale-110 transition-transform duration-300">
          {module.category === 'Flexibility' ? '🤸' :
           module.category === 'Strength' ? '💪' :
           module.category === 'Relaxation' ? '🧘' :
           module.category === 'Balance' ? '⚖️' :
           module.category === 'Meditation' ? '🕯️' :
           module.category === 'Energy' ? '⚡' : '🧘'}
        </span>

        {/* Favorite button */}
        {isAuthenticated && (
          <button
            onClick={handleFavorite}
            disabled={favLoading}
            className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
              isFav
                ? 'bg-red-500 text-white shadow-md'
                : 'bg-white/80 text-gray-400 hover:bg-white hover:text-red-400'
            }`}
            aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
          </button>
        )}

        {/* Category badge */}
        <span className="absolute bottom-3 left-3 px-2 py-0.5 bg-white/90 dark:bg-gray-900/80 text-xs font-medium text-gray-700 dark:text-gray-200 rounded-full shadow-sm">
          {module.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-snug line-clamp-2 flex-1">
            {module.title}
          </h3>
          <span className={`shrink-0 px-2 py-0.5 text-xs font-medium rounded-full ${difficultyStyle}`}>
            {module.difficulty}
          </span>
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3 leading-relaxed">
          {module.description}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-3">
          <span className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {module.duration} min
          </span>
          {module.calories && (
            <span className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
              </svg>
              {module.calories} kcal
            </span>
          )}
        </div>

        <div className="mb-4">
          <StarRating rating={module.rating} />
        </div>

        <div className="mt-auto">
          <Link
            to={`/modules/${module._id}`}
            className="block w-full text-center px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 rounded-xl transition-colors duration-200 group-hover:shadow-md"
          >
            Start Session
          </Link>
        </div>
      </div>
    </div>
  );
}
