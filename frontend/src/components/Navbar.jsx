import { Moon, Sun, User, Search as SearchIcon, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/useAuth';

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const { user } = useAuth();

  return (
    <nav className="minimal-navbar">
      <div className="container">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 cursor-pointer group">
            <span className="text-xl font-semibold text-gray-900 dark:text-white tracking-tight">
              ReclaimIT
            </span>
          </Link>

          <div className="flex items-center gap-6">
            {user && (
              <>
                <Link
                  to="/search"
                  className="minimal-nav-link"
                  aria-label="Search"
                >
                  <SearchIcon className="w-5 h-5" />
                </Link>

                {user.isAdmin && (
                  <Link
                    to="/admin"
                    className="minimal-nav-link"
                    aria-label="Admin Dashboard"
                  >
                    <Shield className="w-5 h-5" />
                  </Link>
                )}
              </>
            )}

            <button
              onClick={toggleTheme}
              className="minimal-nav-link"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {user ? (
              <Link
                to="/profile"
                className="minimal-nav-button flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                <span className="text-sm hidden sm:inline">Profile</span>
              </Link>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  className="minimal-nav-link"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="minimal-nav-button"
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


