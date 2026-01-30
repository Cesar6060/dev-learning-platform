import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';

interface GlowButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: ReactNode;
  variant?: 'primary' | 'neon' | 'cyber' | 'retro';
  size?: 'sm' | 'md' | 'lg';
}

const variants = {
  primary: {
    base: 'bg-gradient-to-r from-purple-600 to-blue-600 text-white',
    glow: 'from-purple-600 to-blue-600',
  },
  neon: {
    base: 'bg-black border border-green-500 text-green-400',
    glow: 'from-green-500 to-emerald-500',
  },
  cyber: {
    base: 'bg-gradient-to-r from-pink-600 to-purple-600 text-white',
    glow: 'from-pink-500 to-purple-500',
  },
  retro: {
    base: 'bg-gradient-to-r from-orange-500 to-pink-600 text-white',
    glow: 'from-orange-500 to-pink-600',
  },
};

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

export function GlowButton({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: GlowButtonProps) {
  const v = variants[variant];

  return (
    <motion.button
      className={`relative group font-medium rounded-lg ${sizes[size]} ${v.base} ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {/* Glow effect */}
      <motion.div
        className={`absolute -inset-1 bg-gradient-to-r ${v.glow} rounded-lg blur-md opacity-0 group-hover:opacity-60 transition-opacity duration-300 pointer-events-none`}
        initial={false}
      />
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </motion.button>
  );
}
