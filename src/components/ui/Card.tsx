import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  withMarginRule?: boolean;
  isRuled?: boolean;
  elevation?: 'flat' | 'lift' | 'elevated';
}

export const Card: React.FC<CardProps> = ({
  children,
  withMarginRule = false,
  isRuled = false,
  elevation = 'flat',
  className = '',
  ...props
}) => {
  const elevationMap = {
    flat: 'border border-[var(--paper-border)] shadow-[var(--paper-shadow-sm)]',
    lift: 'border border-[var(--paper-border)] shadow-[var(--paper-shadow)]',
    elevated: 'border border-[var(--paper-border)] shadow-[var(--paper-shadow-lift)] bg-[var(--paper-elevated)]',
  };

  return (
    <div
      className={`relative bg-[var(--paper-card)] rounded-sm text-[var(--ink-primary)] p-5 transition-shadow ${
        elevationMap[elevation]
      } ${withMarginRule ? 'notebook-margin-left pl-14' : ''} ${
        isRuled ? 'notebook-ruled' : ''
      } ${className}`}
      {...props}
    >
      {withMarginRule && (
        <span
          aria-hidden="true"
          className="absolute left-6 top-3 text-[10px] font-mono-time text-[var(--brick-red)] opacity-60 select-none"
        >
          ¶
        </span>
      )}
      {children}
    </div>
  );
};
