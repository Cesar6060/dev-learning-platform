import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  blur?: 'sm' | 'md' | 'lg';
}

export function GlassCard({
  children,
  className,
  hover = true,
  blur = 'md',
}: GlassCardProps) {
  const blurClasses = {
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg',
  };

  return (
    <motion.div
      whileHover={hover ? { y: -2, scale: 1.01 } : undefined}
      transition={{ duration: 0.2 }}
      className={cn(
        'bg-white/70 dark:bg-zinc-900/70',
        blurClasses[blur],
        'border border-white/20 dark:border-zinc-700/50',
        'rounded-xl shadow-lg shadow-black/5',
        'transition-shadow duration-300',
        hover && 'hover:shadow-xl hover:shadow-black/10',
        className
      )}
    >
      {children}
    </motion.div>
  );
}
