import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function FeatureCard({ emoji, title, description }) {
  return (
    <div className="card p-6 text-center animate-fade-in">
      <div className="text-4xl mb-4">{emoji}</div>
      <h3 className="text-xl font-semibold text-secondary-900 dark:text-white mb-2">{title}</h3>
      <p className="text-secondary-500 dark:text-secondary-400 leading-relaxed">{description}</p>
    </div>
  );
}

function StatCard({ value, label }) {
  return (
    <div className="text-center">
      <p className="text-4xl font-bold text-primary-600 dark:text-primary-400">{value}</p>
      <p className="text-secondary-600 dark:text-secondary-400 mt-1">{label}</p>
    </div>
  );
}

function StepCard({ step, title, description }) {
  return (
    <div className="flex items-start space-x-4">
      <div className="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
        {step}
      </div>
      <div>
        <h4 className="font-semibold text-secondary-900 dark:text-white mb-1">{title}</h4>
        <p className="text-secondary-500 dark:text-secondary-400 text-sm">{description}</p>
      </div>
    </div>
  );
}

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-700 via-primary-600 to-teal-500 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-10 right-20 w-64 h-64 rounded-full bg-white blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36 text-center">
          <div className="text-6xl mb-6">🧘‍♀️</div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            Find Your <span className="text-primary-200">Inner Peace</span>
          </h1>
          <p className="text-lg md:text-xl text-primary-100 max-w-2xl mx-auto mb-10 leading-relaxed">
            Discover personalized yoga sessions, track your posture in real-time, and build a healthier
            mind and body — all in one beautifully designed platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <Link to="/dashboard" className="bg-white text-primary-700 hover:bg-primary-50 font-bold py-3 px-8 rounded-xl transition-colors shadow-lg text-lg">
                Go to Dashboard
              </Link>
            ) : (
              <Link to="/signup" className="bg-white text-primary-700 hover:bg-primary-50 font-bold py-3 px-8 rounded-xl transition-colors shadow-lg text-lg">
                Get Started Free
              </Link>
            )}
            <Link to="/modules" className="border-2 border-white text-white hover:bg-white/10 font-bold py-3 px-8 rounded-xl transition-colors text-lg">
              Browse Modules
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 dark:text-white mb-4">
            Everything You Need to Thrive
          </h2>
          <p className="text-secondary-500 dark:text-secondary-400 text-lg max-w-xl mx-auto">
            A complete wellness toolkit designed to guide your yoga journey from beginner to advanced.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            emoji="📚"
            title="Guided Modules"
            description="Explore curated yoga sessions across 6 categories with step-by-step guidance for every skill level."
          />
          <FeatureCard
            emoji="🤖"
            title="AI Recommendations"
            description="Get personalized session recommendations based on your fitness level, goals, and preferences."
          />
          <FeatureCard
            emoji="📷"
            title="Posture Tracking"
            description="Receive real-time posture feedback to perfect your form and prevent injury during sessions."
          />
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-primary-50 dark:bg-secondary-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-8">
            <StatCard value="10+" label="Yoga Modules" />
            <StatCard value="3" label="Difficulty Levels" />
            <StatCard value="6" label="Categories" />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 dark:text-white mb-4">How It Works</h2>
          <p className="text-secondary-500 dark:text-secondary-400 text-lg">Start your wellness journey in three easy steps.</p>
        </div>
        <div className="max-w-2xl mx-auto space-y-8">
          <StepCard step="1" title="Create Your Account" description="Sign up for free and set your fitness level and preferences to personalize your experience." />
          <StepCard step="2" title="Choose Your Practice" description="Browse curated yoga modules or let our AI recommend the perfect session for you today." />
          <StepCard step="3" title="Track & Improve" description="Use posture tracking for real-time feedback and track your progress over time." />
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary-600 to-teal-500 py-20 text-white text-center px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Begin Your Journey?</h2>
        <p className="text-primary-100 text-lg mb-8 max-w-xl mx-auto">
          Join thousands of practitioners building mindfulness and strength every day.
        </p>
        {isAuthenticated ? (
          <Link to="/modules" className="bg-white text-primary-700 hover:bg-primary-50 font-bold py-3 px-10 rounded-xl transition-colors shadow-lg text-lg inline-block">
            Explore Modules
          </Link>
        ) : (
          <Link to="/signup" className="bg-white text-primary-700 hover:bg-primary-50 font-bold py-3 px-10 rounded-xl transition-colors shadow-lg text-lg inline-block">
            Start Free Today
          </Link>
        )}
      </section>
    </div>
  );
}
