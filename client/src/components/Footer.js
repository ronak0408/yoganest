import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs font-bold">🧘</span>
              </div>
              <span className="text-xl font-bold text-white">
                Yoga<span className="text-green-400">Nest</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Your complete wellness platform for yoga, mindfulness, and posture tracking. 
              Transform your mind and body with guided sessions.
            </p>
            <div className="flex gap-3 mt-4">
              {['🐦', '📘', '📸', '▶️'].map((icon, i) => (
                <button
                  key={i}
                  className="w-9 h-9 bg-gray-800 hover:bg-green-700 rounded-lg flex items-center justify-center transition-colors duration-200 text-sm"
                  aria-label={`Social link ${i + 1}`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {[
                { label: 'Home', to: '/' },
                { label: 'Modules', to: '/modules' },
                { label: 'Dashboard', to: '/dashboard' },
                { label: 'Posture Tracking', to: '/posture' },
                { label: 'Profile', to: '/profile' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-gray-400 hover:text-green-400 text-sm transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Categories
            </h3>
            <ul className="space-y-2">
              {['Flexibility', 'Strength', 'Relaxation', 'Balance', 'Meditation', 'Energy'].map(
                (cat) => (
                  <li key={cat}>
                    <Link
                      to={`/modules?category=${cat}`}
                      className="text-gray-400 hover:text-green-400 text-sm transition-colors duration-200"
                    >
                      {cat}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © {year} YogaNest. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <button className="hover:text-green-400 transition-colors">Privacy Policy</button>
            <button className="hover:text-green-400 transition-colors">Terms of Service</button>
            <button className="hover:text-green-400 transition-colors">Contact</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
