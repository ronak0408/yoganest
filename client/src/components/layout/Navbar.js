import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import useDarkMode from '../../hooks/useDarkMode';

function SunIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

const navLinkClass = ({ isActive }) =>
  isActive
    ? 'text-primary-600 dark:text-primary-400 font-semibold'
    : 'text-secondary-600 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors duration-200';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const [isDark, toggleDarkMode] = useDarkMode();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  return (
    <nav className="bg-white dark:bg-secondary-800 shadow-sm sticky top-0 z-50 border-b border-secondary-200 dark:border-secondary-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl">🧘</span>
            <span className="text-xl font-bold text-primary-700 dark:text-primary-400">YogaNest</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center space-x-6">
            <NavLink to="/" className={navLinkClass} end>Home</NavLink>
            <NavLink to="/modules" className={navLinkClass}>Modules</NavLink>
            {isAuthenticated && (
              <>
                <NavLink to="/dashboard" className={navLinkClass}>Dashboard</NavLink>
                <NavLink to="/posture" className={navLinkClass}>Posture Tracker</NavLink>
              </>
            )}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center space-x-3">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-secondary-500 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDark ? <SunIcon /> : <MoonIcon />}
            </button>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold text-sm">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-secondary-700 dark:text-secondary-200 font-medium text-sm">{user?.name}</span>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-1 w-44 bg-white dark:bg-secondary-800 rounded-lg shadow-lg border border-secondary-200 dark:border-secondary-700 py-1 animate-fade-in">
                    <Link
                      to="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-secondary-700 dark:text-secondary-200 hover:bg-secondary-50 dark:hover:bg-secondary-700"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-secondary-700 dark:text-secondary-200 hover:bg-secondary-50 dark:hover:bg-secondary-700"
                    >
                      Dashboard
                    </Link>
                    <hr className="my-1 border-secondary-200 dark:border-secondary-700" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-secondary-50 dark:hover:bg-secondary-700"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="btn-secondary text-sm">Login</Link>
                <Link to="/signup" className="btn-primary text-sm">Sign Up</Link>
              </>
            )}
          </div>

          {/* Mobile: dark mode + hamburger */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-secondary-500 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDark ? <SunIcon /> : <MoonIcon />}
            </button>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="p-2 rounded-lg text-secondary-600 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors"
              aria-label="Toggle menu"
            >
              {menuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-secondary-800 border-t border-secondary-200 dark:border-secondary-700 animate-slide-up">
          <div className="px-4 pt-2 pb-4 space-y-2">
            <NavLink to="/" onClick={() => setMenuOpen(false)} className={navLinkClass} end>
              <div className="block py-2">Home</div>
            </NavLink>
            <NavLink to="/modules" onClick={() => setMenuOpen(false)} className={navLinkClass}>
              <div className="block py-2">Modules</div>
            </NavLink>
            {isAuthenticated && (
              <>
                <NavLink to="/dashboard" onClick={() => setMenuOpen(false)} className={navLinkClass}>
                  <div className="block py-2">Dashboard</div>
                </NavLink>
                <NavLink to="/posture" onClick={() => setMenuOpen(false)} className={navLinkClass}>
                  <div className="block py-2">Posture Tracker</div>
                </NavLink>
                <NavLink to="/profile" onClick={() => setMenuOpen(false)} className={navLinkClass}>
                  <div className="block py-2">Profile</div>
                </NavLink>
              </>
            )}
            <div className="pt-2 border-t border-secondary-200 dark:border-secondary-700">
              {isAuthenticated ? (
                <button
                  onClick={() => { handleLogout(); setMenuOpen(false); }}
                  className="w-full text-left py-2 text-red-600 dark:text-red-400 font-medium"
                >
                  Logout
                </button>
              ) : (
                <div className="flex space-x-2 pt-1">
                  <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-secondary text-sm flex-1 text-center">
                    Login
                  </Link>
                  <Link to="/signup" onClick={() => setMenuOpen(false)} className="btn-primary text-sm flex-1 text-center">
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
