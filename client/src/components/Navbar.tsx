import { Moon, Sun, User, Search, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/useAuth';

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const { user } = useAuth();

  return (
    <nav className="sticky top-0 z-50 glass-strong shadow-soft backdrop-blur-safari transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3 cursor-pointer group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-glow transition-all duration-300 group-hover:scale-105">
              <span className="text-white font-bold text-xl">LF</span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white hidden sm:inline group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
              Campus Lost & Found
            </span>
          </Link>

          <div className="flex items-center space-x-4">
            {user && (
              <>
                <Link
                  to="/search"
                  className="p-2 rounded-xl hover:bg-blue-50 dark:hover:bg-gray-800 transition-all duration-200 hover:scale-110"
                  aria-label="Search"
                >
                  <Search className="w-5 h-5 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400" />
                </Link>

                {user.isAdmin && (
                  <Link
                    to="/admin"
                    className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all duration-200 hover:scale-110"
                    aria-label="Admin Dashboard"
                  >
                    <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </Link>
                )}
              </>
            )}

            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 hover:scale-110 hover:rotate-12"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-yellow-500 dark:text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600" />
              )}
            </button>

            {user ? (
              <Link
                to="/profile"
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 hover:from-blue-50 hover:to-blue-100 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
              >
                <User className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:inline">Profile</span>
              </Link>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
