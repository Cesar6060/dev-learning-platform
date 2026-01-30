import { motion } from 'framer-motion';

interface SoftBackgroundProps {
  className?: string;
  variant?: 'default' | 'warm' | 'cool' | 'neutral';
}

const variants = {
  default: {
    primary: 'bg-blue-400/30 dark:bg-blue-500/25',
    secondary: 'bg-slate-400/20 dark:bg-slate-500/15',
    accent: 'bg-sky-400/20 dark:bg-sky-500/20',
  },
  warm: {
    primary: 'bg-orange-400/30 dark:bg-orange-600/20',
    secondary: 'bg-rose-400/20 dark:bg-rose-600/15',
    accent: 'bg-amber-400/20 dark:bg-amber-600/15',
  },
  cool: {
    primary: 'bg-cyan-400/30 dark:bg-cyan-600/20',
    secondary: 'bg-blue-400/20 dark:bg-blue-600/15',
    accent: 'bg-teal-400/20 dark:bg-teal-600/15',
  },
  neutral: {
    primary: 'bg-slate-400/20 dark:bg-slate-600/15',
    secondary: 'bg-zinc-400/15 dark:bg-zinc-600/10',
    accent: 'bg-gray-400/15 dark:bg-gray-600/10',
  },
};

export function SoftBackground({ className = '', variant = 'default' }: SoftBackgroundProps) {
  const colors = variants[variant];

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950" />

      {/* Soft gradient blobs */}
      <motion.div
        className={`absolute -top-40 -right-40 w-[500px] h-[500px] ${colors.primary} rounded-full blur-3xl`}
        animate={{
          x: [0, 30, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className={`absolute -bottom-40 -left-40 w-[500px] h-[500px] ${colors.secondary} rounded-full blur-3xl`}
        animate={{
          x: [0, -20, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] ${colors.accent} rounded-full blur-3xl`}
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Subtle noise texture */}
      <div
        className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
