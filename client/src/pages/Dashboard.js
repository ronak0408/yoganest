import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../utils/api';
import YogaCard from '../components/YogaCard';
import LoadingSpinner from '../components/LoadingSpinner';

function StatCard({ icon, label, value, color }) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow`}>
      <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center text-2xl mb-3 shadow-sm`}>
        {icon}
      </div>
      <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
      <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{label}</div>
    </div>
  );
}

function QuickLinkCard({ icon, title, desc, to, color }) {
  return (
    <Link
      to={to}
      className={`group bg-gradient-to-br ${color} rounded-2xl p-5 text-white hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200`}
    >
      <div className="text-3xl mb-3">{icon}</div>
      <div className="font-semibold text-lg">{title}</div>
      <div className="text-sm opacity-80 mt-1">{desc}</div>
      <div className="mt-3 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
        Go now
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
      </div>
    </Link>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [progress, setProgress] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recsLoading, setRecsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const [recsRes, progressRes, favsRes] = await Promise.allSettled([
        api.get('/recommendations'),
        api.get('/user/progress'),
        api.get('/user/favorites'),
      ]);

      if (recsRes.status === 'fulfilled') {
        const d = recsRes.value.data;
        // API returns { data: { recommendations: [{ module, reason }] } }
        const rawList = Array.isArray(d)
          ? d
          : d.data?.recommendations || d.recommendations || [];
        // Unwrap { module, reason } wrappers if present
        const normalized = rawList.map((item) =>
          item && item.module ? item.module : item
        );
        setRecommendations(normalized);
      }
      if (progressRes.status === 'fulfilled') {
        const d = progressRes.value.data;
        setProgress(Array.isArray(d) ? d : d.progress || []);
      }
      if (favsRes.status === 'fulfilled') {
        const d = favsRes.value.data;
        setFavorites(Array.isArray(d) ? d : d.favorites || []);
      }
    } catch {
      setError('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const refreshRecommendations = async () => {
    setRecsLoading(true);
    try {
      const { data } = await api.get('/recommendations');
      const rawList = Array.isArray(data)
        ? data
        : data.data?.recommendations || data.recommendations || [];
      const normalized = rawList.map((item) =>
        item && item.module ? item.module : item
      );
      setRecommendations(normalized);
    } catch {
      // silently fail
    } finally {
      setRecsLoading(false);
    }
  };

  const totalMinutes = progress.reduce((sum, p) => sum + (p.duration || 0), 0);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) return <LoadingSpinner size="lg" message="Loading your dashboard..." />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white dark:bg-gray-900 min-h-screen transition-colors duration-300">
      {/* Welcome */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {greeting()},{' '}
          <span className="text-green-600 dark:text-green-400">{user?.name?.split(' ')[0]} 👋</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Ready to continue your wellness journey?
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl text-yellow-700 dark:text-yellow-300 text-sm">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-slide-up">
        <StatCard
          icon="✅"
          label="Sessions Completed"
          value={progress.length}
          color="bg-green-100 dark:bg-green-900/40"
        />
        <StatCard
          icon="⏱️"
          label="Total Minutes"
          value={totalMinutes}
          color="bg-blue-100 dark:bg-blue-900/40"
        />
        <StatCard
          icon="❤️"
          label="Favorites"
          value={favorites.length}
          color="bg-pink-100 dark:bg-pink-900/40"
        />
        <StatCard
          icon="🔥"
          label="Current Level"
          value={user?.level || 'Beginner'}
          color="bg-orange-100 dark:bg-orange-900/40"
        />
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        <QuickLinkCard
          icon="🧘"
          title="Browse Modules"
          desc="Explore all yoga sessions"
          to="/modules"
          color="from-green-500 to-emerald-600"
        />
        <QuickLinkCard
          icon="📸"
          title="Posture Tracking"
          desc="Analyze your alignment"
          to="/posture"
          color="from-indigo-500 to-purple-600"
        />
      </div>

      {/* Recommendations */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            🎯 Recommended for You
          </h2>
          <button
            onClick={refreshRecommendations}
            disabled={recsLoading}
            className="flex items-center gap-1.5 text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium transition-colors disabled:opacity-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 ${recsLoading ? 'animate-spin' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>

        {recsLoading ? (
          <LoadingSpinner message="Getting fresh recommendations..." />
        ) : recommendations.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {recommendations.map((mod) => (
              <YogaCard key={mod._id} module={mod} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
            <p className="text-4xl mb-3">🌿</p>
            <p className="text-gray-600 dark:text-gray-400 font-medium">No recommendations yet.</p>
            <Link to="/modules" className="text-green-600 hover:underline text-sm mt-2 inline-block">
              Browse all modules →
            </Link>
          </div>
        )}
      </section>

      {/* Recent Activity */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          🕐 Recent Activity
        </h2>
        {progress.length > 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
            {progress.slice(0, 5).map((entry, i) => (
              <div
                key={entry._id || i}
                className={`flex items-center gap-4 px-5 py-4 ${
                  i < Math.min(4, progress.slice(0, 5).length - 1)
                    ? 'border-b border-gray-100 dark:border-gray-700'
                    : ''
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/40 flex items-center justify-center text-green-600 dark:text-green-400 font-bold text-sm shrink-0">
                  {i + 1}
                </div>
                <div className="flex-grow min-w-0">
                  <div className="font-medium text-gray-900 dark:text-white text-sm truncate">
                    {entry.module?.title || entry.moduleTitle || 'Yoga Session'}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {entry.completedAt
                      ? new Date(entry.completedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })
                      : 'Recently'}
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                    {entry.duration || 0} min
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
            <p className="text-4xl mb-3">🌱</p>
            <p className="text-gray-600 dark:text-gray-400 font-medium">No sessions yet.</p>
            <Link to="/modules" className="text-green-600 hover:underline text-sm mt-2 inline-block">
              Start your first session →
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
