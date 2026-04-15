import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import YogaCard from '../components/YogaCard';
import LoadingSpinner from '../components/LoadingSpinner';

const CATEGORIES = ['All', 'Flexibility', 'Strength', 'Relaxation', 'Balance', 'Meditation', 'Energy'];
const DIFFICULTIES = ['All', 'Beginner', 'Intermediate', 'Advanced'];

const CATEGORY_ICONS = {
  All: '🌟',
  Flexibility: '🤸',
  Strength: '💪',
  Relaxation: '🧘',
  Balance: '⚖️',
  Meditation: '🕯️',
  Energy: '⚡',
};

export default function Modules() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [difficulty, setDifficulty] = useState('All');

  useEffect(() => {
    api.get('/yoga/modules')
      .then(({ data }) => {
        const mods = Array.isArray(data) ? data : data.modules || [];
        setModules(mods);
      })
      .catch(() => setError('Failed to load modules. Please try again.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return modules.filter((m) => {
      const matchSearch = m.title?.toLowerCase().includes(search.toLowerCase()) ||
        m.description?.toLowerCase().includes(search.toLowerCase());
      const matchCategory = category === 'All' || m.category === category;
      const matchDifficulty = difficulty === 'All' || m.difficulty === difficulty;
      return matchSearch && matchCategory && matchDifficulty;
    });
  }, [modules, search, category, difficulty]);

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    if (cat !== 'All') {
      setSearchParams({ category: cat });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white dark:bg-gray-900 min-h-screen transition-colors duration-300">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Yoga <span className="text-green-600 dark:text-green-400">Modules</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Explore {modules.length} guided sessions for all levels and goals.
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6 animate-slide-up">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search modules by title or description..."
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            ✕
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="space-y-4 mb-8">
        {/* Category */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border-2 transition-all duration-200 ${
                category === cat
                  ? 'border-green-500 bg-green-500 text-white shadow-md'
                  : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-green-300 dark:hover:border-green-600 bg-white dark:bg-gray-800'
              }`}
            >
              {CATEGORY_ICONS[cat]} {cat}
            </button>
          ))}
        </div>

        {/* Difficulty */}
        <div className="flex flex-wrap gap-2">
          {DIFFICULTIES.map((diff) => (
            <button
              key={diff}
              onClick={() => setDifficulty(diff)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 ${
                difficulty === diff
                  ? diff === 'Beginner'
                    ? 'border-green-500 bg-green-500 text-white'
                    : diff === 'Intermediate'
                    ? 'border-yellow-500 bg-yellow-500 text-white'
                    : diff === 'Advanced'
                    ? 'border-red-500 bg-red-500 text-white'
                    : 'border-gray-500 bg-gray-500 text-white'
                  : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-400 bg-white dark:bg-gray-800'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      {!loading && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
          Showing <span className="font-semibold text-gray-700 dark:text-gray-200">{filtered.length}</span>{' '}
          of {modules.length} modules
          {search && ` matching "${search}"`}
        </p>
      )}

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300 text-sm">
          {error}
          <button
            onClick={() => window.location.reload()}
            className="ml-2 underline hover:no-underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <LoadingSpinner size="lg" message="Loading modules..." />
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((mod, i) => (
            <div key={mod._id} className="animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
              <YogaCard module={mod} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
            No modules found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
            {search
              ? `No results for "${search}". Try a different search term.`
              : 'No modules match the selected filters.'}
          </p>
          <button
            onClick={() => {
              setSearch('');
              setCategory('All');
              setDifficulty('All');
              setSearchParams({});
            }}
            className="px-5 py-2.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-xl transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
