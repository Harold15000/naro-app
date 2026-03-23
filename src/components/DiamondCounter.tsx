import React, { useEffect, useState } from 'react';
import { cn } from '../lib/utils';

interface DiamondCounterProps {
  count: number;
  className?: string;
}

export const DiamondCounter: React.FC<DiamondCounterProps> = ({ count, className }) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
    const timer = setTimeout(() => setAnimate(false), 300);
    return () => clearTimeout(timer);
  }, [count]);

  return (
    <div className={cn(
      "flex items-center gap-1.5 bg-surface-high px-3 py-1.5 rounded-full border border-border transition-transform",
      animate ? "scale-110" : "scale-100",
      className
    )}>
      <span className="text-lg">💎</span>
      <span className="text-naro-blue font-semibold">{count.toLocaleString()}</span>
    </div>
  );
};
