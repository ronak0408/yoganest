import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import YogaCard from '../components/YogaCard';

const CATEGORY_GRADIENTS = {
  Flexibility: 'from-purple-500 to-indigo-600',
  Strength: 'from-orange-500 to-red-600',
  Relaxation: 'from-blue-500 to-cyan-600',
  Balance: 'from-yellow-500 to-amber-600',
  Meditation: 'from-teal-500 to-emerald-600',
  Energy: 'from-pink-500 to-rose-600',
  default: 'from-green-500 to-emerald-600',
};

const CATEGORY_EMOJIS = {
  Flexibility: '🤸',
  Strength: '💪',
  Relaxation: '🧘',
  Balance: '⚖️',
  Meditation: '🕯️',
  Energy: '⚡',
};

const DIFFICULTY_COLORS = {
  Beginner: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  Intermediate: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
  Advanced: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
};

export default function ModuleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [module, setModule] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sessionStarted, setSessionStarted] = useState(false);
  const [sessionLoading, setSessionLoading] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setSessionStarted(false);

    api.get(`/yoga/modules/${id}`)
      .then(({ data }) => {
        const mod = data.module || data;
        setModule(mod);
        setIsFav(mod.isFavorite || false);

        return api.get('/yoga/modules');
      })
      .then(({ data }) => {
        const all = Array.isArray(data) ? data : data.modules || [];
        const rel = all
          .filter((m) => m.category === module?.category && m._id !== id)
          .slice(0, 3);
        setRelated(rel);
      })
      .catch(() => setError('Module not found.'))
      .finally(() => setLoading(false));
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (module) {
      api.get('/yoga/modules')
        .then(({ data }) => {
          const all = Array.isArray(data) ? data : data.modules || [];
          const rel = all
            .filter((m) => m.category === module.category && m._id !== id)
            .slice(0, 3);
          setRelated(rel);
        })
        .catch(() => {});
    }
  }, [module, id]);

  const handleStartSession = async () => {
    if (sessionStarted) return;
    setSessionLoading(true);
    try {
      if (isAuthenticated) {
        await api.post('/user/progress', {
          moduleId: module._id,
          duration: module.duration,
          completedAt: new Date().toISOString(),
        });
      }
      setSessionStarted(true);
    } catch {
      setSessionStarted(true);
    } finally {
      setSessionLoading(false);
    }
  };

  const handleFavorite = async () => {
    if (!isAuthenticated || favLoading) return;
    setFavLoading(true);
    try {
      await api.post('/user/favorites', { moduleId: module._id });
      setIsFav(!isFav);
    } catch {
      // silently fail
    } finally {
      setFavLoading(false);
    }
  };

  if (loading) return <LoadingSpinner size="lg" message="Loading module..." />;
  if (error || !module) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Module Not Found</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">{error || 'This module does not exist.'}</p>
        <button
          onClick={() => navigate('/modules')}
          className="px-6 py-2.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-xl transition-colors"
        >
          Back to Modules
        </button>
      </div>
    );
  }

  const gradient = CATEGORY_GRADIENTS[module.category] || CATEGORY_GRADIENTS.default;
  const emoji = CATEGORY_EMOJIS[module.category] || '🧘';

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen transition-colors duration-300">
      {/* Hero Banner */}
      <div className={`relative bg-gradient-to-br ${gradient} py-16 px-4`}>
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => navigate('/modules')}
            className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium mb-6 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Modules
          </button>

          <div className="flex flex-col md:flex-row md:items-end gap-6">
            <div className="w-24 h-24 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-5xl shadow-xl">
              {emoji}
            </div>

            <div className="flex-grow">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="px-3 py-1 bg-white/20 text-white text-xs font-medium rounded-full backdrop-blur-sm">
                  {module.category}
                </span>
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${DIFFICULTY_COLORS[module.difficulty] || 'bg-white/20 text-white'}`}>
                  {module.difficulty}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 leading-tight">
                {module.title}
              </h1>
              <div className="flex flex-wrap gap-4 text-white/80 text-sm">
                <span className="flex items-center gap-1">
                  ⏱️ {module.duration} minutes
                </span>
                {module.calories && (
                  <span className="flex items-center gap-1">
                    🔥 {module.calories} calories
                  </span>
                )}
                {module.rating && (
                  <span className="flex items-center gap-1">
                    ⭐ {Number(module.rating).toFixed(1)} rating
                  </span>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 shrink-0">
              {isAuthenticated && (
                <button
                  onClick={handleFavorite}
                  disabled={favLoading}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 ${
                    isFav
                      ? 'bg-red-500 text-white shadow-lg'
                      : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
                  }`}
                  aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
                >
                  ❤️
                </button>
              )}
              <button
                onClick={handleStartSession}
                disabled={sessionLoading || sessionStarted}
                className={`px-6 py-3 rounded-2xl font-semibold text-sm transition-all duration-200 flex items-center gap-2 shadow-lg ${
                  sessionStarted
                    ? 'bg-white/20 text-white cursor-default backdrop-blur-sm'
                    : 'bg-white text-green-700 hover:bg-green-50 hover:shadow-xl transform hover:-translate-y-0.5'
                }`}
              >
                {sessionLoading ? (
                  <>
                    <div className="h-4 w-4 rounded-full border-2 border-green-200 border-t-green-600 animate-spin" />
                    Starting...
                  </>
                ) : sessionStarted ? (
                  '✅ Session Logged!'
                ) : (
                  '▶️ Start Session'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">About This Session</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{module.description}</p>
            </section>

            {/* Instructions */}
            {module.instructions?.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Instructions</h2>
                <ol className="space-y-3">
                  {module.instructions.map((step, i) => (
                    <li key={i} className="flex gap-4 items-start">
                      <span className={`w-8 h-8 rounded-xl bg-gradient-to-br ${gradient} text-white flex items-center justify-center text-sm font-bold shrink-0 shadow-sm`}>
                        {i + 1}
                      </span>
                      <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed pt-1">
                        {step}
                      </p>
                    </li>
                  ))}
                </ol>
              </section>
            )}

            {/* Benefits */}
            {module.benefits?.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Benefits</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {module.benefits.map((benefit, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-800"
                    >
                      <span className="text-green-500 text-lg">✓</span>
                      <span className="text-sm text-gray-700 dark:text-gray-300">{benefit}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Session Details</h3>
              <div className="space-y-3">
                {[
                  { label: 'Duration', value: `${module.duration} min`, icon: '⏱️' },
                  { label: 'Difficulty', value: module.difficulty, icon: '📊' },
                  { label: 'Category', value: module.category, icon: '🏷️' },
                  ...(module.calories ? [{ label: 'Calories', value: `${module.calories} kcal`, icon: '🔥' }] : []),
                  ...(module.rating ? [{ label: 'Rating', value: `${Number(module.rating).toFixed(1)} / 5`, icon: '⭐' }] : []),
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                      {item.icon} {item.label}
                    </span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            {!isAuthenticated && (
              <div className={`bg-gradient-to-br ${gradient} rounded-2xl p-5 text-white`}>
                <h3 className="font-semibold mb-2">Track Your Progress</h3>
                <p className="text-sm opacity-80 mb-4">Sign in to log sessions and track your wellness journey.</p>
                <Link
                  to="/login"
                  className="block text-center px-4 py-2 bg-white text-green-700 font-semibold text-sm rounded-xl hover:bg-green-50 transition-colors"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-12 pt-10 border-t border-gray-100 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              More {module.category} Sessions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {related.map((mod) => (
                <YogaCard key={mod._id} module={mod} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
