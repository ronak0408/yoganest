import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { yogaAPI, userAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import DifficultyBadge from '../components/common/DifficultyBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import YogaCard from '../components/yoga/YogaCard';

const CATEGORY_GRADIENTS = {
  flexibility: 'from-blue-400 to-indigo-500',
  strength: 'from-orange-400 to-red-500',
  relaxation: 'from-purple-400 to-pink-500',
  balance: 'from-teal-400 to-cyan-500',
  meditation: 'from-violet-400 to-purple-600',
  energy: 'from-yellow-400 to-orange-500',
  default: 'from-primary-400 to-primary-600',
};

export default function ModuleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [module, setModule] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorited, setFavorited] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchModule = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await yogaAPI.getModuleById(id);
        const mod = response.data.module || response.data;
        setModule(mod);
        setFavorited(mod?.isFavorited || false);
        setCompleted(mod?.isCompleted || false);

        // Fetch related modules (same category)
        const allRes = await yogaAPI.getAllModules();
        const all = allRes.data.data || [];
        const rel = all.filter((m) => m._id !== id && m.category === mod?.category).slice(0, 3);
        setRelated(rel);
      } catch (err) {
        setError(err.response?.data?.message || 'Module not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchModule();
  }, [id]);

  const handleFavorite = async () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    setActionLoading(true);
    try {
      await userAPI.toggleFavorite(id);
      setFavorited((v) => !v);
    } catch {
      // ignore
    } finally {
      setActionLoading(false);
    }
  };

  const handleMarkComplete = async () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    setActionLoading(true);
    try {
      await userAPI.markComplete(id);
      setCompleted(true);
    } catch {
      // ignore
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner message="Loading module..." />
      </div>
    );
  }

  if (error || !module) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-5xl mb-4">😕</p>
        <p className="text-secondary-500 dark:text-secondary-400 text-lg mb-6">{error || 'Module not found.'}</p>
        <Link to="/modules" className="btn-primary">Back to Modules</Link>
      </div>
    );
  }

  const category = module.category?.toLowerCase() || 'default';
  const gradient = CATEGORY_GRADIENTS[category] || CATEGORY_GRADIENTS.default;
  const steps = module.steps || module.guide || [];
  const benefits = module.benefits || [];

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <div className={`bg-gradient-to-br ${gradient} text-white py-16 px-4`}>
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-1 text-white/80 hover:text-white mb-6 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back</span>
          </button>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="bg-white/20 text-white text-sm px-3 py-1 rounded-full capitalize backdrop-blur-sm">
              {module.category}
            </span>
            <DifficultyBadge difficulty={module.difficultyLevel} />
            <span className="flex items-center space-x-1 text-white/80 text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{module.duration} min</span>
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-3">{module.title}</h1>
          <p className="text-white/90 text-lg max-w-2xl">{module.description}</p>

          <div className="flex flex-wrap gap-3 mt-8">
            {isAuthenticated && (
              <button
                onClick={handleFavorite}
                disabled={actionLoading}
                className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-5 py-2.5 rounded-lg font-semibold transition-colors"
              >
                <svg className="w-5 h-5" fill={favorited ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>{favorited ? 'Favorited' : 'Add to Favorites'}</span>
              </button>
            )}
            {isAuthenticated && !completed && (
              <button
                onClick={handleMarkComplete}
                disabled={actionLoading}
                className="flex items-center space-x-2 bg-white text-primary-700 hover:bg-primary-50 px-5 py-2.5 rounded-lg font-semibold transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Mark Complete</span>
              </button>
            )}
            {completed && (
              <span className="flex items-center space-x-2 bg-green-500 text-white px-5 py-2.5 rounded-lg font-semibold">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Completed!</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="md:col-span-2 space-y-10">
            {/* Benefits */}
            {benefits.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-white mb-4">Benefits</h2>
                <ul className="space-y-2">
                  {benefits.map((b, i) => (
                    <li key={i} className="flex items-start space-x-3">
                      <span className="text-primary-600 dark:text-primary-400 mt-0.5">✅</span>
                      <span className="text-secondary-700 dark:text-secondary-300">{b}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Step-by-step guide */}
            {steps.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-white mb-4">Step-by-Step Guide</h2>
                <div className="space-y-4">
                  {steps.map((step, i) => (
                    <div key={i} className="flex items-start space-x-4 card p-4">
                      <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                        {i + 1}
                      </div>
                      <p className="text-secondary-700 dark:text-secondary-300 leading-relaxed">
                        {typeof step === 'string' ? step : step.instruction || step.description || JSON.stringify(step)}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className="card p-5">
              <h3 className="font-bold text-secondary-900 dark:text-white mb-3">Session Info</h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-secondary-500 dark:text-secondary-400">Category</dt>
                  <dd className="text-secondary-900 dark:text-white font-medium capitalize">{module.category}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-secondary-500 dark:text-secondary-400">Duration</dt>
                  <dd className="text-secondary-900 dark:text-white font-medium">{module.duration} min</dd>
                </div>
                <div className="flex justify-between items-center">
                  <dt className="text-secondary-500 dark:text-secondary-400">Difficulty</dt>
                  <dd><DifficultyBadge difficulty={module.difficultyLevel} /></dd>
                </div>
              </dl>
            </div>

            {!isAuthenticated && (
              <div className="card p-5 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800">
                <p className="text-secondary-700 dark:text-secondary-300 text-sm mb-3">
                  Sign in to track your progress and save favorites.
                </p>
                <Link to="/login" className="btn-primary w-full text-center block text-sm">Sign In</Link>
              </div>
            )}
          </div>
        </div>

        {/* Related modules */}
        {related.length > 0 && (
          <section className="mt-14">
            <h2 className="text-2xl font-bold text-secondary-900 dark:text-white mb-6">Related Modules</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {related.map((mod) => <YogaCard key={mod._id} module={mod} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
