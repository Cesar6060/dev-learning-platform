import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { LogOut, User, Gamepad2, Settings, ChevronDown, ChevronRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { NotificationBell } from '@/components/notifications/NotificationBell';
import { courseService } from '@/services/courses';
import { motion } from 'framer-motion';
import type { Enrollment } from '@/types';

export function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [enrolledCourses, setEnrolledCourses] = useState<Enrollment[]>([]);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Load enrolled courses for grades in user menu (students only)
  useEffect(() => {
    if (isAuthenticated && user && !user.is_instructor) {
      courseService.getMyEnrollments().then(setEnrolledCourses).catch(console.error);
    } else {
      setEnrolledCourses([]);
    }
  }, [isAuthenticated, user]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setUserMenuOpen(false);
    await logout();
    navigate('/login');
  };

  // Get breadcrumb info based on current path
  const getBreadcrumbInfo = () => {
    const path = location.pathname;
    const parts: { label: string; href?: string }[] = [];

    // Course-related routes
    const courseMatch = path.match(/\/courses\/([^/]+)/);
    if (courseMatch) {
      const courseCode = courseMatch[1].toUpperCase();
      parts.push({ label: courseCode, href: `/courses/${courseMatch[1]}` });

      // Add sub-page if we're deeper
      if (path.includes('/grades')) {
        parts.push({ label: 'Grades' });
      } else if (path.includes('/assignments')) {
        parts.push({ label: 'Assignments' });
      } else if (path.includes('/quizzes')) {
        parts.push({ label: 'Quizzes' });
      } else if (path.includes('/learn')) {
        parts.push({ label: 'Learning' });
      } else if (path.includes('/announcements')) {
        parts.push({ label: 'Announcements' });
      } else if (path.includes('/manage')) {
        parts.push({ label: 'Manage' });
      } else if (path.includes('/roster')) {
        parts.push({ label: 'Roster' });
      } else if (path.includes('/gradebook')) {
        parts.push({ label: 'Gradebook' });
      }
      return parts;
    }

    // Instructor grading route
    if (path.includes('/instructor/assignments/')) {
      parts.push({ label: 'Grading' });
      return parts;
    }

    return parts.length > 0 ? parts : null;
  };

  const breadcrumbs = getBreadcrumbInfo();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/50 dark:border-zinc-700/50 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl">
      <div className="container mx-auto flex h-14 items-center px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2.5 group">
          <motion.div
            whileHover={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 0.5 }}
            className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/25"
          >
            <Gamepad2 className="h-5 w-5 text-white" />
          </motion.div>
          <span className="font-bold text-slate-800 dark:text-white hidden sm:inline">GameDev</span>
        </Link>

        {/* Main Navigation */}
        {isAuthenticated && (
          <nav className="flex items-center ml-8 space-x-1">
            <Link
              to="/dashboard"
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                location.pathname === '/dashboard'
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/courses"
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                location.pathname === '/courses' || location.pathname.startsWith('/courses/')
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Courses
            </Link>
            {/* Contextual breadcrumbs */}
            {breadcrumbs && breadcrumbs.length > 0 && (
              <nav className="hidden md:flex items-center text-sm text-slate-500 dark:text-slate-400">
                {breadcrumbs.map((crumb, index) => (
                  <span key={index} className="flex items-center">
                    <ChevronRight className="h-4 w-4 mx-1 text-slate-400 dark:text-slate-500" />
                    {crumb.href ? (
                      <Link
                        to={crumb.href}
                        className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className="text-slate-800 dark:text-white">{crumb.label}</span>
                    )}
                  </span>
                ))}
              </nav>
            )}
          </nav>
        )}

        {/* Right Side */}
        <div className="ml-auto flex items-center space-x-2">
          {isAuthenticated ? (
            <>
              <NotificationBell />

              {/* User Menu Dropdown */}
              <div className="relative" ref={userMenuRef}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 px-2 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  {user?.preferences?.avatar_url ? (
                    <img
                      src={user.preferences.avatar_url}
                      alt="Avatar"
                      className="h-8 w-8 rounded-full object-cover ring-2 ring-white dark:ring-zinc-800 shadow-sm"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center shadow-sm">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  )}
                  <span className="hidden sm:inline text-sm font-medium text-slate-700 dark:text-slate-300">
                    {user?.first_name || 'Account'}
                  </span>
                  <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </motion.button>

                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full right-0 mt-2 w-56 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-slate-200/50 dark:border-zinc-700/50 rounded-xl shadow-xl py-1 z-50"
                  >
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-slate-200/50 dark:border-zinc-700/50">
                      <div className="font-medium text-slate-800 dark:text-white">{user?.first_name} {user?.last_name}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{user?.email}</div>
                      {user?.is_instructor && (
                        <span className="inline-block mt-2 rounded-full bg-blue-100 dark:bg-blue-900/30 px-2.5 py-0.5 text-xs font-medium text-blue-600 dark:text-blue-400">
                          Instructor
                        </span>
                      )}
                    </div>

                    {/* Grades Section (Students only) */}
                    {!user?.is_instructor && enrolledCourses.length > 0 && (
                      <>
                        <div className="px-4 py-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                          My Grades
                        </div>
                        {enrolledCourses.slice(0, 3).map((enrollment) => (
                          <Link
                            key={enrollment.id}
                            to={`/courses/${enrollment.course.code}/grades`}
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center justify-between px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                          >
                            <span className="truncate">{enrollment.course.code}</span>
                            <ChevronRight className="h-4 w-4 text-slate-400" />
                          </Link>
                        ))}
                        {enrolledCourses.length > 3 && (
                          <div className="px-4 py-1 text-xs text-slate-400">
                            +{enrolledCourses.length - 3} more courses
                          </div>
                        )}
                        <div className="border-t border-slate-200/50 dark:border-zinc-700/50 my-1" />
                      </>
                    )}

                    {/* Menu Items */}
                    <Link
                      to="/settings"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                      <Settings className="h-4 w-4" />
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full text-left text-red-600 dark:text-red-400"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </motion.div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="glassPrimary" size="sm" className="rounded-lg">Register</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
