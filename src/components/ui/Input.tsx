import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold uppercase tracking-wider text-[var(--ink-secondary)]"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`w-full px-3 py-2 text-sm bg-[var(--paper-card)] text-[var(--ink-primary)] border rounded-sm transition-colors placeholder:text-[var(--ink-faint)] focus:outline-none focus:ring-1 focus:ring-[var(--marigold-accent)] ${
            error
              ? 'border-[var(--brick-red)] bg-[var(--brick-red-light)] focus:border-[var(--brick-red)]'
              : 'border-[var(--paper-border)] hover:border-[var(--ink-muted)]'
          } ${className}`}
          {...props}
        />
        {error ? (
          <p className="text-xs text-[var(--brick-red)] font-medium flex items-center gap-1">
            <span>•</span> {error}
          </p>
        ) : helperText ? (
          <p className="text-xs text-[var(--ink-muted)]">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
