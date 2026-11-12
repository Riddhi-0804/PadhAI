import React from 'react';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  lines?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  lines = 3,
  className = '',
  ...props
}) => {
  return (
    <div className={`space-y-3 animate-pulse ${className}`} {...props}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-3.5 bg-[var(--paper-border)] opacity-60 rounded-xs"
          style={{
            width: i === lines - 1 ? '60%' : i % 2 === 0 ? '100%' : '85%',
          }}
        />
      ))}
    </div>
  );
};
