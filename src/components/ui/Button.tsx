import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'ink' | 'outline' | 'marigold' | 'brick';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'ink',
  size = 'md',
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium transition-colors select-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[var(--marigold-accent)] disabled:opacity-50 disabled:cursor-not-allowed text-sm';

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs rounded-sm gap-1.5',
    md: 'px-4 py-2 text-sm rounded-sm gap-2',
    lg: 'px-5 py-2.5 text-base rounded-sm gap-2.5',
  };

  const variantClasses = {
    ink: 'bg-[var(--ink-primary)] text-[var(--paper-bg)] hover:bg-[var(--ink-secondary)] border border-[var(--ink-primary)] active:translate-y-px',
    outline:
      'bg-transparent text-[var(--ink-primary)] border border-[var(--paper-border)] hover:bg-[var(--paper-elevated)] active:translate-y-px',
    marigold:
      'bg-[var(--marigold-accent)] text-white hover:bg-[var(--marigold-hover)] border border-[var(--marigold-accent)] font-semibold active:translate-y-px',
    brick:
      'bg-[var(--brick-red)] text-white hover:opacity-90 border border-[var(--brick-red)] active:translate-y-px',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
      {children}
    </button>
  );
};
