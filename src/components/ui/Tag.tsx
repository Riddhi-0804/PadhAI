import React from 'react';

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'ink' | 'marigold' | 'brick' | 'neutral';
  size?: 'sm' | 'md';
}

export const Tag: React.FC<TagProps> = ({
  children,
  variant = 'neutral',
  size = 'sm',
  className = '',
  ...props
}) => {
  const sizeMap = {
    sm: 'text-[11px] px-2 py-0.5 tracking-wider',
    md: 'text-xs px-2.5 py-1 tracking-wide',
  };

  const variantMap = {
    neutral: 'bg-[var(--paper-elevated)] text-[var(--ink-secondary)] border border-[var(--paper-border)]',
    ink: 'bg-[var(--ink-primary)] text-[var(--paper-bg)] border border-[var(--ink-primary)]',
    marigold: 'bg-[var(--marigold-light)] text-[var(--marigold-accent)] border border-[var(--marigold-border)] font-semibold',
    brick: 'bg-[var(--brick-red-light)] text-[var(--brick-red)] border border-[var(--brick-red-border)] font-medium',
  };

  return (
    <span
      className={`inline-flex items-center uppercase font-mono-time rounded-[2px] select-none ${sizeMap[size]} ${variantMap[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
