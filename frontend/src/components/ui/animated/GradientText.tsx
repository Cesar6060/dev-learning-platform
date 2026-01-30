import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GradientTextProps {
  children: ReactNode;
  className?: string;
  gradient?: 'gaming' | 'sunset' | 'ocean' | 'neon' | 'retro';
  animate?: boolean;
}

const gradients = {
  gaming: 'from-purple-400 via-pink-500 to-red-500',
  sunset: 'from-orange-400 via-red-500 to-pink-500',
  ocean: 'from-cyan-400 via-blue-500 to-purple-500',
  neon: 'from-green-400 via-cyan-500 to-blue-500',
  retro: 'from-yellow-400 via-orange-500 to-pink-500',
};

export function GradientText({
  children,
  className = '',
  gradient = 'gaming',
  animate = true,
}: GradientTextProps) {
  return (
    <motion.span
      className={`bg-gradient-to-r ${gradients[gradient]} bg-clip-text text-transparent ${className}`}
      style={animate ? { backgroundSize: '200% auto' } : undefined}
      animate={
        animate
          ? {
              backgroundPosition: ['0% center', '200% center'],
            }
          : undefined
      }
      transition={
        animate
          ? {
              duration: 3,
              ease: 'linear',
              repeat: Infinity,
            }
          : undefined
      }
    >
      {children}
    </motion.span>
  );
}
