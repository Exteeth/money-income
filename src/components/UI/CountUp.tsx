import React, { useState, useEffect, useRef } from 'react';
import { formatBaht } from '../../utils/format';

interface CountUpProps {
  value: number;
  duration?: number; // duration in ms
}

export const CountUp: React.FC<CountUpProps> = ({ value, duration = 400 }) => {
  const [displayValue, setDisplayValue] = useState(value);
  const startTimeRef = useRef<number | null>(null);
  const startValueRef = useRef(0);
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    // Save current display value as the starting point of the transition
    startValueRef.current = displayValue;
    startTimeRef.current = null;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const progress = timestamp - startTimeRef.current;
      const rate = Math.min(progress / duration, 1);
      
      // Easing curve: cubic-bezier(0.22, 1, 0.36, 1) - OutExpo/OutCubic
      // easeOutCubic: 1 - Math.pow(1 - rate, 3)
      const easeRate = 1 - Math.pow(1 - rate, 3);
      
      const current = startValueRef.current + (value - startValueRef.current) * easeRate;
      setDisplayValue(current);

      if (rate < 1) {
        requestRef.current = requestAnimationFrame(animate);
      }
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [value, duration]);

  // Handle prefers-reduced-motion to snap values immediately without animation
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return (
    <span>
      {formatBaht(reducedMotion ? value : displayValue)}
    </span>
  );
};

export default CountUp;
