import React, { useState, useMemo } from 'react';
import { yogaAPI } from '../utils/api';
import { useEffect } from 'react';
import YogaCard from '../components/yoga/YogaCard';
import CategoryFilter from '../components/yoga/CategoryFilter';

function SkeletonCard() {
  return (
    <div className="card overflow-hidden animate-pulse">
      <div className="h-40 bg-secondary-200 dark:bg-secondary-700" />
      <div className="p-4 space-y-3">
        <div className="flex justify-between">
          <div className="h-5 w-20 bg-secondary-200 dark:bg-secondary-700 rounded-full" />
          <div className="h-4 w-12 bg-secondary-200 dark:bg-secondary-700 rounded" />
        </div>
        <div className="h-5 w-3/4 bg-secondary-200 dark:bg-secondary-700 rounded" />
        <div className="h-4 w-full bg-secondary-200 dark:bg-secondary-700 rounded" />
        <div className="h-4 w-2/3 bg-secondary-200 dark:bg-secondary-700 rounded" />
      </div>
    </div>
  );
}

export default function Modules() {
  const [allModules, setAllModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');

  useEffect(() => {
    const fetchModules = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await yogaAPI.getAllModules();
        setAllModules(response.data.modules || response.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load modules. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchModules();
  }, []);

  const filteredModules = useMemo(() => {
    return allModules.filter((mod) => {
      const matchSearch =
        !search ||
        mod.title?.toLowerCase().includes(search.toLowerCase()) ||
        mod.description?.toLowerCase().includes(search.toLowerCase());
      const matchCategory =
        selectedCategory === 'All' ||
        mod.category?.toLowerCase() === selectedCategory.toLowerCase();
      const matchDifficulty =
        selectedDifficulty === 'All' ||
        mod.difficulty?.toLowerCase() === selectedDifficulty.toLowerCase();
      return matchSearch && matchCategory && matchDifficulty;
    });
  }, [allModules, search, selectedCategory, selectedDifficulty]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-secondary-900 dark:text-white mb-2">Yoga Modules</h1>
        <p className="text-secondary-500 dark:text-secondary-400">
          Explore our library of curated yoga sessions for every level and goal.
        </p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search modules..."
            className="input-field pl-10"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="card p-5 mb-8">
        <CategoryFilter
          selectedCategory={selectedCategory}
          selectedDifficulty={selectedDifficulty}
          onCategoryChange={setSelectedCategory}
          onDifficultyChange={setSelectedDifficulty}
        />
      </div>

      {/* Results count */}
      {!loading && !error && (
        <p className="text-secondary-500 dark:text-secondary-400 text-sm mb-5">
          {filteredModules.length} module{filteredModules.length !== 1 ? 's' : ''} found
        </p>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : error ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">😕</p>
          <p className="text-secondary-500 dark:text-secondary-400 text-lg">{error}</p>
          <button onClick={() => window.location.reload()} className="btn-primary mt-4">
            Try Again
          </button>
        </div>
      ) : filteredModules.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-secondary-500 dark:text-secondary-400 text-lg">No modules match your filters.</p>
          <button
            onClick={() => { setSearch(''); setSelectedCategory('All'); setSelectedDifficulty('All'); }}
            className="btn-secondary mt-4"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredModules.map((mod) => (
            <YogaCard key={mod._id} module={mod} />
          ))}
        </div>
      )}
    </div>
  );
}
