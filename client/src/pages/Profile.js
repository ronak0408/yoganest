import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import YogaCard from '../components/YogaCard';

const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
const CATEGORIES = ['Flexibility', 'Strength', 'Relaxation', 'Balance', 'Meditation', 'Energy'];

const TABS = [
  { id: 'overview', label: 'Overview', icon: '👤' },
  { id: 'favorites', label: 'Favorites', icon: '❤️' },
  { id: 'progress', label: 'Progress', icon: '📊' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
];

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [favorites, setFavorites] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({ name: '', level: '', preferences: [] });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setEditData({
        name: user.name || '',
        level: user.level || 'Beginner',
        preferences: user.preferences || [],
      });
    }
  }, [user]);

  useEffect(() => {
    Promise.allSettled([
      api.get('/user/favorites'),
      api.get('/user/progress'),
    ]).then(([favsRes, progressRes]) => {
      if (favsRes.status === 'fulfilled') {
        const d = favsRes.value.data;
        setFavorites(Array.isArray(d) ? d : d.favorites || []);
      }
      if (progressRes.status === 'fulfilled') {
        const d = progressRes.value.data;
        setProgress(Array.isArray(d) ? d : d.progress || []);
      }
    }).finally(() => setLoading(false));
  }, []);

  const handleEditChange = (e) => {
    setEditData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setEditError('');
    setEditSuccess(false);
  };

  const togglePref = (cat) => {
    setEditData((prev) => ({
      ...prev,
      preferences: prev.preferences.includes(cat)
        ? prev.preferences.filter((c) => c !== cat)
        : [...prev.preferences, cat],
    }));
  };

  const handleSave = async () => {
    if (!editData.name.trim()) {
      setEditError('Name cannot be empty.');
      return;
    }
    setEditLoading(true);
    try {
      const { data } = await api.put('/user/profile', editData);
      updateUser(data.user || data);
      setEditMode(false);
      setEditSuccess(true);
      setTimeout(() => setEditSuccess(false), 3000);
    } catch (err) {
      setEditError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setEditLoading(false);
    }
  };

  const totalMinutes = progress.reduce((sum, p) => sum + (p.duration || 0), 0);
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'Recently';

  if (loading) return <LoadingSpinner size="lg" message="Loading profile..." />;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white dark:bg-gray-900 min-h-screen transition-colors duration-300">
      {/* Profile Header */}
      <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 mb-6 text-white shadow-lg animate-fade-in">
        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-sm border-4 border-white/50 flex items-center justify-center text-4xl font-bold text-white shadow-xl">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="text-center sm:text-left flex-grow">
            <h1 className="text-2xl font-bold">{user?.name}</h1>
            <p className="text-white/80 text-sm">{user?.email}</p>
            <div className="flex flex-wrap gap-2 mt-2 justify-center sm:justify-start">
              <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium backdrop-blur-sm">
                🌱 {user?.level || 'Beginner'}
              </span>
              <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium backdrop-blur-sm">
                📅 Member since {memberSince}
              </span>
            </div>
          </div>
          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              { label: 'Sessions', value: progress.length },
              { label: 'Minutes', value: totalMinutes },
              { label: 'Favorites', value: favorites.length },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/20 backdrop-blur-sm rounded-xl px-3 py-2">
                <div className="text-xl font-bold">{stat.value}</div>
                <div className="text-xs text-white/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {editSuccess && (
        <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-xl text-green-700 dark:text-green-300 text-sm flex items-center gap-2">
          ✅ Profile updated successfully!
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 mb-6 overflow-x-auto scrollbar-hide">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-white dark:bg-gray-700 text-green-600 dark:text-green-400 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="animate-fade-in">
        {/* Overview */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Profile Information</h2>
                {!editMode && (
                  <button
                    onClick={() => setEditMode(true)}
                    className="text-sm text-green-600 dark:text-green-400 hover:text-green-700 font-medium flex items-center gap-1"
                  >
                    ✏️ Edit
                  </button>
                )}
              </div>

              {editMode ? (
                <div className="space-y-4">
                  {editError && (
                    <div className="p-2.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg text-red-600 dark:text-red-300 text-xs">
                      {editError}
                    </div>
                  )}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={editData.name}
                      onChange={handleEditChange}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Level</label>
                    <div className="grid grid-cols-3 gap-2">
                      {LEVELS.map((lvl) => (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => setEditData((prev) => ({ ...prev, level: lvl }))}
                          className={`py-2 text-xs font-medium rounded-lg border-2 transition-all ${
                            editData.level === lvl
                              ? 'border-green-500 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                              : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400'
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Preferences</label>
                    <div className="flex flex-wrap gap-1.5">
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => togglePref(cat)}
                          className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
                            editData.preferences.includes(cat)
                              ? 'border-green-500 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300'
                              : 'border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => { setEditMode(false); setEditError(''); }}
                      className="flex-1 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={editLoading}
                      className="flex-1 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-60 rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                      {editLoading ? (
                        <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : 'Save Changes'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {[
                    { label: 'Full Name', value: user?.name, icon: '👤' },
                    { label: 'Email', value: user?.email, icon: '📧' },
                    { label: 'Level', value: user?.level || 'Beginner', icon: '🎯' },
                    { label: 'Member Since', value: memberSince, icon: '📅' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-start gap-3">
                      <span className="text-lg mt-0.5">{item.icon}</span>
                      <div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{item.label}</div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white mt-0.5">{item.value}</div>
                      </div>
                    </div>
                  ))}
                  {user?.preferences?.length > 0 && (
                    <div className="flex items-start gap-3">
                      <span className="text-lg mt-0.5">🏷️</span>
                      <div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Interests</div>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {user.preferences.map((p) => (
                            <span key={p} className="px-2 py-0.5 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 rounded-full text-xs font-medium">
                              {p}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Wellness Summary */}
            <div className="space-y-4">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">📈 Wellness Summary</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Total Sessions', value: progress.length, icon: '✅', color: 'text-green-600 dark:text-green-400' },
                    { label: 'Total Minutes', value: totalMinutes, icon: '⏱️', color: 'text-blue-600 dark:text-blue-400' },
                    { label: 'Favorited', value: favorites.length, icon: '❤️', color: 'text-pink-600 dark:text-pink-400' },
                    { label: 'Level', value: user?.level || 'Beginner', icon: '🎯', color: 'text-purple-600 dark:text-purple-400' },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-3">
                      <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {stat.icon} {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Favorites */}
        {activeTab === 'favorites' && (
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              ❤️ Favorited Modules ({favorites.length})
            </h2>
            {favorites.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {favorites.map((mod) => (
                  <YogaCard
                    key={mod._id}
                    module={{ ...mod, isFavorite: true }}
                    onFavoriteToggle={(id, isFav) => {
                      if (!isFav) setFavorites((prev) => prev.filter((m) => m._id !== id));
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                <div className="text-5xl mb-3">💔</div>
                <p className="text-gray-600 dark:text-gray-400 font-medium">No favorites yet.</p>
                <p className="text-sm text-gray-400 mt-1">Tap the heart on any module to save it here.</p>
              </div>
            )}
          </div>
        )}

        {/* Progress */}
        {activeTab === 'progress' && (
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              📊 Session History ({progress.length})
            </h2>
            {progress.length > 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
                {progress.map((entry, i) => (
                  <div
                    key={entry._id || i}
                    className={`flex items-center gap-4 px-5 py-4 ${
                      i < progress.length - 1 ? 'border-b border-gray-100 dark:border-gray-700' : ''
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/40 flex items-center justify-center text-green-600 dark:text-green-400 text-sm font-bold shrink-0">
                      #{i + 1}
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="font-medium text-gray-900 dark:text-white text-sm truncate">
                        {entry.module?.title || entry.moduleTitle || 'Yoga Session'}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {entry.completedAt
                          ? new Date(entry.completedAt).toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })
                          : 'Recently completed'}
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
              <div className="text-center py-16 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                <div className="text-5xl mb-3">🌱</div>
                <p className="text-gray-600 dark:text-gray-400 font-medium">No sessions logged yet.</p>
                <p className="text-sm text-gray-400 mt-1">Start a yoga module to track your progress.</p>
              </div>
            )}
          </div>
        )}

        {/* Settings */}
        {activeTab === 'settings' && (
          <div className="max-w-xl space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">⚙️ Account Settings</h2>
              <div className="space-y-3">
                {[
                  { label: 'Email Notifications', desc: 'Receive reminders for your practice', enabled: true },
                  { label: 'Weekly Progress Reports', desc: 'Get a summary of your weekly sessions', enabled: true },
                  { label: 'New Module Alerts', desc: 'Be notified when new modules are added', enabled: false },
                ].map((setting) => (
                  <div key={setting.label} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{setting.label}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{setting.desc}</div>
                    </div>
                    <div
                      className={`w-10 h-6 rounded-full transition-colors ${
                        setting.enabled ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                      } relative cursor-pointer`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                          setting.enabled ? 'translate-x-5' : 'translate-x-1'
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-5 border border-red-100 dark:border-red-800">
              <h3 className="text-sm font-semibold text-red-700 dark:text-red-300 mb-2">⚠️ Danger Zone</h3>
              <p className="text-xs text-red-600 dark:text-red-400 mb-3">
                These actions are permanent and cannot be undone.
              </p>
              <button className="px-4 py-2 text-sm font-medium text-red-700 dark:text-red-300 border border-red-300 dark:border-red-700 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-xl transition-colors">
                Delete Account
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
