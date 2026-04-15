import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import YogaCard from '../components/YogaCard';
import LoadingSpinner from '../components/LoadingSpinner';

const FEATURES = [
  {
    icon: '🎯',
    title: 'Guided Modules',
    desc: 'Step-by-step yoga sessions for all levels, from beginner to advanced practitioners.',
    color: 'from-green-400 to-emerald-500',
  },
  {
    icon: '🤖',
    title: 'AI Recommendations',
    desc: 'Personalized module suggestions based on your skill level and practice history.',
    color: 'from-indigo-400 to-purple-500',
  },
  {
    icon: '📸',
    title: 'Posture Tracking',
    desc: 'Real-time posture analysis to help you maintain proper alignment during sessions.',
    color: 'from-orange-400 to-pink-500',
  },
  {
    icon: '📊',
    title: 'Progress Tracking',
    desc: 'Monitor your wellness journey with detailed stats, streaks, and achievements.',
    color: 'from-blue-400 to-cyan-500',
  },
];

const TESTIMONIALS = [
  {
    name: 'Sarah M.',
    role: 'Beginner Practitioner',
    avatar: 'S',
    text: "YogaNest transformed my morning routine. The guided modules are incredibly clear and the posture tracking keeps me accountable. I've never felt better!",
    rating: 5,
  },
  {
    name: 'James K.',
    role: 'Intermediate Yogi',
    avatar: 'J',
    text: "The AI recommendations are spot-on. It always suggests the right level of challenge without overwhelming me. Best wellness app I've used.",
    rating: 5,
  },
  {
    name: 'Priya L.',
    role: 'Advanced Practitioner',
    avatar: 'P',
    text: "Even as an experienced practitioner, YogaNest has helped me refine my technique. The detailed instruction breakdowns are exceptional.",
    rating: 5,
  },
];

const STATS = [
  { value: '10+', label: 'Yoga Modules' },
  { value: '1000+', label: 'Active Users' },
  { value: '50K+', label: 'Sessions Completed' },
  { value: '98%', label: 'Satisfaction Rate' },
];

function AnimatedSection({ children, className = '' }) {
  const [visible, setVisible] = useState(false);
  const ref = React.useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } ${className}`}
    >
      {children}
    </div>
  );
}

export default function Home() {
  const [featuredModules, setFeaturedModules] = useState([]);
  const [loadingModules, setLoadingModules] = useState(true);

  useEffect(() => {
    api.get('/yoga/modules')
      .then(({ data }) => {
        const modules = Array.isArray(data) ? data : data.modules || [];
        setFeaturedModules(modules.slice(0, 3));
      })
      .catch(() => {})
      .finally(() => setLoadingModules(false));
  }, []);

  return (
    <div className="bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-16 pb-24">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 right-10 w-72 h-72 bg-green-200 dark:bg-green-900 rounded-full opacity-20 blur-3xl" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-emerald-200 dark:bg-emerald-900 rounded-full opacity-20 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 rounded-full text-sm font-medium mb-6 animate-fade-in">
            <span>✨</span> Your Wellness Journey Starts Here
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight mb-6 animate-fade-in animate-delay-100">
            Transform Your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-600">
              Mind & Body
            </span>{' '}
            with YogaNest
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10 animate-fade-in animate-delay-200">
            Guided yoga modules, AI-powered recommendations, real-time posture tracking, 
            and progress monitoring — all in one beautiful platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in animate-delay-300">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-base font-semibold text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Get Started Free
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
            <Link
              to="/modules"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-base font-semibold text-green-700 dark:text-green-300 bg-white dark:bg-gray-800 border-2 border-green-200 dark:border-green-700 hover:border-green-400 dark:hover:border-green-500 rounded-xl shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Browse Modules
            </Link>
          </div>

          {/* Floating stats */}
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 animate-fade-in animate-delay-400">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-4 border border-white dark:border-gray-700 shadow-sm"
              >
                <div className="text-2xl font-extrabold text-green-600 dark:text-green-400">
                  {stat.value}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need to{' '}
              <span className="text-green-600 dark:text-green-400">Thrive</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
              A complete wellness toolkit designed for every level of practitioner.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feature, i) => (
              <AnimatedSection
                key={feature.title}
                className={`animate-delay-${(i + 1) * 100}`}
              >
                <div className="group bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 hover:shadow-lg border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:-translate-y-1 h-full">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Modules */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Featured <span className="text-green-600 dark:text-green-400">Modules</span>
              </h2>
              <p className="text-gray-600 dark:text-gray-400">Start with these popular sessions</p>
            </div>
            <Link
              to="/modules"
              className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors"
            >
              View all
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </Link>
          </AnimatedSection>

          {loadingModules ? (
            <LoadingSpinner message="Loading modules..." />
          ) : featuredModules.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredModules.map((mod) => (
                <AnimatedSection key={mod._id}>
                  <YogaCard module={mod} />
                </AnimatedSection>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No modules available yet.</p>
              <Link to="/register" className="text-green-600 hover:underline text-sm mt-2 inline-block">
                Register to access all features →
              </Link>
            </div>
          )}

          <div className="text-center mt-8 sm:hidden">
            <Link
              to="/modules"
              className="inline-flex items-center gap-1 text-sm font-medium text-green-600 dark:text-green-400"
            >
              View all modules →
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Loved by{' '}
              <span className="text-green-600 dark:text-green-400">Practitioners</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
              See what our community says about their YogaNest experience.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <AnimatedSection key={t.name} className={`animate-delay-${(i + 1) * 100}`}>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 h-full flex flex-col">
                  <div className="flex text-yellow-400 mb-4">
                    {Array(t.rating).fill('★').join('')}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed flex-grow italic">
                    "{t.text}"
                  </p>
                  <div className="flex items-center gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                      {t.avatar}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">{t.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{t.role}</div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-600">
        <AnimatedSection>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-green-100 text-lg mb-8 max-w-xl mx-auto">
              Join thousands of practitioners transforming their wellness with YogaNest.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-green-700 bg-white hover:bg-green-50 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Create Free Account
              </Link>
              <Link
                to="/modules"
                className="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-white border-2 border-white/50 hover:border-white rounded-xl hover:bg-white/10 transition-all duration-200"
              >
                Explore Modules
              </Link>
            </div>
          </div>
        </AnimatedSection>
      </section>
    </div>
  );
}
