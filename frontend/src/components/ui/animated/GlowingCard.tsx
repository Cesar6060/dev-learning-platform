import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GlowingCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: 'purple' | 'blue' | 'green' | 'pink' | 'orange' | 'cyan';
}

const glowColors = {
  purple: 'from-purple-500 via-violet-500 to-purple-500',
  blue: 'from-blue-500 via-cyan-500 to-blue-500',
  green: 'from-green-500 via-emerald-500 to-green-500',
  pink: 'from-pink-500 via-rose-500 to-pink-500',
  orange: 'from-orange-500 via-amber-500 to-orange-500',
  cyan: 'from-cyan-500 via-teal-500 to-cyan-500',
};

export function GlowingCard({
  children,
  className = '',
  glowColor = 'purple',
}: GlowingCardProps) {
  return (
    <div className={`relative group ${className}`}>
      {/* Animated gradient border */}
      <motion.div
        className={`absolute -inset-0.5 bg-gradient-to-r ${glowColors[glowColor]} rounded-xl blur opacity-40 group-hover:opacity-100 transition duration-500`}
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{
          duration: 4,
          ease: 'linear',
          repeat: Infinity,
        }}
        style={{ backgroundSize: '200% 200%' }}
      />
      {/* Card content */}
      <div className="relative bg-background/90 backdrop-blur-sm rounded-xl p-6 h-full border border-border/50">
        {children}
      </div>
    </div>
  );
}
