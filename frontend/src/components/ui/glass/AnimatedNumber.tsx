import { useEffect, useRef } from 'react';
import { useSpring, useTransform, motion, useInView } from 'framer-motion';

interface AnimatedNumberProps {
  value: number;
  className?: string;
  duration?: number;
}

export function AnimatedNumber({ value, className, duration = 1 }: AnimatedNumberProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const spring = useSpring(0, { duration: duration * 1000 });
  const display = useTransform(spring, (current) => Math.round(current));

  useEffect(() => {
    if (isInView) {
      spring.set(value);
    }
  }, [spring, value, isInView]);

  return (
    <motion.span ref={ref} className={className}>
      {display}
    </motion.span>
  );
}
