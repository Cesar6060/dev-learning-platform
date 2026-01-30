import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Gamepad2, Loader2, Sun, Moon, Monitor } from 'lucide-react';
import { SoftBackground, GlassCard } from '@/components/ui/glass';
import { motion } from 'framer-motion';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const navigate = useNavigate();

  // Cycle through themes: light -> dark -> system -> light
  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  const ThemeIcon = theme === 'system' ? Monitor : resolvedTheme === 'dark' ? Moon : Sun;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { non_field_errors?: string[]; detail?: string } } };
      if (error.response?.data?.non_field_errors) {
        setError(error.response.data.non_field_errors[0]);
      } else if (error.response?.data?.detail) {
        setError(error.response.data.detail);
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Soft gradient background */}
      <SoftBackground variant="default" />

      {/* Theme toggle in top-right corner */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={cycleTheme}
        className="absolute top-4 right-4 p-2.5 rounded-xl bg-white/70 dark:bg-zinc-800/70 backdrop-blur-md border border-white/20 dark:border-zinc-700/50 shadow-lg hover:shadow-xl transition-all z-20"
        title={`Theme: ${theme}`}
      >
        <ThemeIcon className="h-5 w-5 text-slate-600 dark:text-slate-300" />
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <GlassCard hover={false} className="p-0 overflow-hidden">
          <div className="p-8 pb-6 text-center border-b border-slate-200/50 dark:border-zinc-700/50">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="flex justify-center mb-5"
            >
              <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30">
                <Gamepad2 className="h-8 w-8 text-white" />
              </div>
            </motion.div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
              Welcome back
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              Enter your credentials to continue
            </p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="p-8 space-y-5">
              {error && (
                <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 p-4 text-sm text-red-600 dark:text-red-400">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl"
                />
              </div>
              <div className="text-right">
                <Link
                  to="/forgot-password"
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
            </div>
            <div className="p-8 pt-0 space-y-5">
              <Button type="submit" variant="glassPrimary" className="w-full rounded-xl h-11" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign in
              </Button>
              <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
                Don't have an account?{' '}
                <Link to="/register" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors">
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </GlassCard>
      </motion.div>
    </div>
  );
}
