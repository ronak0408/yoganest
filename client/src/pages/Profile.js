import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../utils/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import DifficultyBadge from '../components/common/DifficultyBadge';

const CATEGORIES = ['Flexibility', 'Strength', 'Relaxation', 'Balance', 'Meditation', 'Energy'];
const TIME_OPTIONS = ['Morning', 'Afternoon', 'Evening', 'Anytime'];

export default function Profile() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  const [favorites, setFavorites] = useState([]);
  const [progress, setProgress] = useState(null);
  const [loadingData, setLoadingData] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');

  const [prefs, setPrefs] = useState({
    difficulty: user?.preferences?.difficulty || 'Beginner',
    timeOfDay: user?.preferences?.timeOfDay || 'Anytime',
    categories: user?.preferences?.categories || [],
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true);
      try {
        const [favRes, progRes] = await Promise.allSettled([
          userAPI.getFavorites(),
          userAPI.getProgress(),
        ]);
        if (favRes.status === 'fulfilled') {
          setFavorites(favRes.value.data.favorites || favRes.value.data || []);
        }
        if (progRes.status === 'fulfilled') {
          setProgress(progRes.value.data);
        }
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, []);

  const handleCategoryToggle = (cat) => {
    setPrefs((prev) => {
      const cats = prev.categories.includes(cat)
        ? prev.categories.filter((c) => c !== cat)
        : [...prev.categories, cat];
      return { ...prev, categories: cats };
    });
  };

  const handleSavePreferences = async () => {
    setSaving(true);
    setSaveSuccess(false);
    setSaveError('');
    try {
      const response = await userAPI.updatePreferences(prefs);
      const updatedUser = response.data.user || { ...user, preferences: prefs };
      updateUser(updatedUser);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setSaveError(err.response?.data?.message || 'Failed to save preferences.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
    : 'N/A';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <h1 className="text-3xl font-extrabold text-secondary-900 dark:text-white mb-8">Your Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column */}
        <div className="space-y-6">
          {/* User info card */}
          <div className="card p-6 text-center">
            <div className="w-20 h-20 rounded-full bg-primary-600 flex items-center justify-center text-white font-extrabold text-3xl mx-auto mb-4">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-xl font-bold text-secondary-900 dark:text-white">{user?.name}</h2>
            <p className="text-secondary-500 dark:text-secondary-400 text-sm mt-1">{user?.email}</p>
            <div className="mt-3">
              <DifficultyBadge difficulty={user?.preferences?.difficulty || 'Beginner'} />
            </div>
            <p className="text-xs text-secondary-400 dark:text-secondary-500 mt-3">Member since {memberSince}</p>
          </div>

          {/* Stats */}
          {loadingData ? (
            <div className="card p-6 flex justify-center"><LoadingSpinner /></div>
          ) : (
            <div className="card p-5">
              <h3 className="font-bold text-secondary-900 dark:text-white mb-4">Progress Stats</h3>
              <dl className="space-y-3">
                <div className="flex justify-between text-sm">
                  <dt className="text-secondary-500 dark:text-secondary-400">Sessions Completed</dt>
                  <dd className="font-bold text-secondary-900 dark:text-white">
                    {progress?.completedModules?.length ?? 0}
                  </dd>
                </div>
                <div className="flex justify-between text-sm">
                  <dt className="text-secondary-500 dark:text-secondary-400">Favorites</dt>
                  <dd className="font-bold text-secondary-900 dark:text-white">{favorites.length}</dd>
                </div>
                <div className="flex justify-between text-sm">
                  <dt className="text-secondary-500 dark:text-secondary-400">Level</dt>
                  <dd className="font-bold text-secondary-900 dark:text-white capitalize">
                    {user?.preferences?.difficulty || 'Beginner'}
                  </dd>
                </div>
              </dl>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="w-full bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 font-semibold py-2.5 px-4 rounded-lg transition-colors border border-red-200 dark:border-red-800"
          >
            Logout
          </button>
        </div>

        {/* Right column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Preferences */}
          <div className="card p-6">
            <h3 className="font-bold text-secondary-900 dark:text-white mb-5 text-lg">Preferences</h3>

            {saveSuccess && (
              <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-300 text-sm">
                ✅ Preferences saved successfully!
              </div>
            )}
            {saveError && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm">
                {saveError}
              </div>
            )}

            <div className="space-y-5">
              {/* Difficulty */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                  Experience Level
                </label>
                <select
                  value={prefs.difficulty}
                  onChange={(e) => setPrefs((p) => ({ ...p, difficulty: e.target.value }))}
                  className="input-field"
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>

              {/* Time of day */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                  Preferred Practice Time
                </label>
                <div className="flex flex-wrap gap-2">
                  {TIME_OPTIONS.map((t) => (
                    <button
                      key={t}
                      onClick={() => setPrefs((p) => ({ ...p, timeOfDay: t }))}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        prefs.timeOfDay === t
                          ? 'bg-primary-600 text-white'
                          : 'bg-secondary-100 dark:bg-secondary-700 text-secondary-700 dark:text-secondary-300 hover:bg-primary-100 dark:hover:bg-secondary-600'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category preferences */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  Preferred Categories
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {CATEGORIES.map((cat) => (
                    <label key={cat} className="flex items-center space-x-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={prefs.categories.includes(cat)}
                        onChange={() => handleCategoryToggle(cat)}
                        className="w-4 h-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
                      />
                      <span className="text-sm text-secondary-700 dark:text-secondary-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {cat}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                onClick={handleSavePreferences}
                disabled={saving}
                className="btn-primary flex items-center space-x-2 disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Save Preferences</span>
                )}
              </button>
            </div>
          </div>

          {/* Favorites */}
          <div className="card p-6">
            <h3 className="font-bold text-secondary-900 dark:text-white mb-4 text-lg">
              Favorites ({favorites.length})
            </h3>
            {loadingData ? (
              <div className="flex justify-center py-6"><LoadingSpinner /></div>
            ) : favorites.length === 0 ? (
              <p className="text-secondary-400 dark:text-secondary-500 text-sm">
                No favorites yet. Browse modules and tap the ❤️ to save them here.
              </p>
            ) : (
              <div className="space-y-2">
                {favorites.map((fav) => {
                  const mod = fav.module || fav;
                  return (
                    <div key={mod._id} className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors">
                      <div>
                        <p className="font-medium text-secondary-900 dark:text-white text-sm">{mod.title}</p>
                        <p className="text-xs text-secondary-400 dark:text-secondary-500 capitalize">{mod.category} · {mod.duration} min</p>
                      </div>
                      <DifficultyBadge difficulty={mod.difficulty} />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
