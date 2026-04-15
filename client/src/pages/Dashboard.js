import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { recommendationsAPI, userAPI } from '../utils/api';
import RecommendationCard from '../components/dashboard/RecommendationCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const QUOTES = [
  '"Yoga is the journey of the self, through the self, to the self." — Bhagavad Gita',
  '"The nature of yoga is to shine the light of awareness into the darkest corners of the body." — Jason Crandell',
  '"Inhale the future, exhale the past."',
  '"Yoga is not about touching your toes, it is about what you learn on the way down." — Jigar Gor',
];

function StatCard({ icon, label, value, color }) {
  return (
    <div className={`card p-5 border-l-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-secondary-500 dark:text-secondary-400 text-sm font-medium">{label}</p>
          <p className="text-2xl font-bold text-secondary-900 dark:text-white mt-1">{value}</p>
        </div>
        <span className="text-3xl">{icon}</span>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quote] = useState(() => QUOTES[Math.floor(Math.random() * QUOTES.length)]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [recRes, progRes] = await Promise.allSettled([
          recommendationsAPI.getRecommendations(),
          userAPI.getProgress(),
        ]);
        if (recRes.status === 'fulfilled') {
          const recs = recRes.value.data.data || [];
          setRecommendations(recs.slice(0, 6));
        }
        if (progRes.status === 'fulfilled') {
          setProgress(progRes.value.data);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const completedCount = progress?.stats?.totalCompleted ?? 0;
  const favoritesCount = progress?.stats?.favoritesCount ?? 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-secondary-900 dark:text-white">
          Welcome back, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-secondary-500 dark:text-secondary-400 mt-1">
          Ready to continue your wellness journey today?
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
        <StatCard icon="✅" label="Sessions Completed" value={completedCount} color="border-green-500" />
        <StatCard icon="❤️" label="Favorites" value={favoritesCount} color="border-red-400" />
        <StatCard icon="🎯" label="Current Level" value={user?.difficultyLevel || 'Beginner'} color="border-blue-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recommendations */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-secondary-900 dark:text-white">Recommended for You</h2>
            <Link to="/modules" className="text-primary-600 dark:text-primary-400 text-sm font-medium hover:underline">
              View all →
            </Link>
          </div>
          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner message="Loading recommendations..." />
            </div>
          ) : recommendations.length > 0 ? (
            <div className="space-y-3">
              {recommendations.map((mod) => (
                <RecommendationCard key={mod._id} module={mod} />
              ))}
            </div>
          ) : (
            <div className="card p-10 text-center text-secondary-400 dark:text-secondary-500">
              <p className="text-4xl mb-2">🧘</p>
              <p>No recommendations yet. Browse our modules!</p>
              <Link to="/modules" className="btn-primary mt-4 inline-block text-sm">Browse Modules</Link>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="card p-5">
            <h3 className="font-bold text-secondary-900 dark:text-white mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Link to="/modules" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors group">
                <span className="text-2xl">📚</span>
                <span className="text-secondary-700 dark:text-secondary-200 font-medium group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">Browse All Modules</span>
              </Link>
              <Link to="/posture" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors group">
                <span className="text-2xl">📷</span>
                <span className="text-secondary-700 dark:text-secondary-200 font-medium group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">Track Posture</span>
              </Link>
              <Link to="/profile" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors group">
                <span className="text-2xl">⚙️</span>
                <span className="text-secondary-700 dark:text-secondary-200 font-medium group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">Update Preferences</span>
              </Link>
            </div>
          </div>

          {/* Motivational Quote */}
          <div className="card p-5 bg-gradient-to-br from-primary-50 to-teal-50 dark:from-primary-900/30 dark:to-teal-900/30 border border-primary-100 dark:border-primary-800">
            <p className="text-4xl mb-3">💬</p>
            <p className="text-secondary-700 dark:text-secondary-300 italic text-sm leading-relaxed">{quote}</p>
          </div>

          {/* Recent Activity placeholder */}
          <div className="card p-5">
            <h3 className="font-bold text-secondary-900 dark:text-white mb-3">Activity</h3>
            {completedCount > 0 ? (
              <p className="text-secondary-500 dark:text-secondary-400 text-sm">
                You've completed <strong>{completedCount}</strong> session{completedCount !== 1 ? 's' : ''}. Keep it up!
              </p>
            ) : (
              <p className="text-secondary-400 dark:text-secondary-500 text-sm">
                Start your first session to see your activity here.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
