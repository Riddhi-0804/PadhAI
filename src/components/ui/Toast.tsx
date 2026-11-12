import React, { useEffect } from 'react';
import { X, Info, CheckCircle2, AlertTriangle } from 'lucide-react';
import { ToastMessage } from '../../types';

export interface ToastProps {
  toast: ToastMessage | null;
  onDismiss: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, toast.duration || 4000);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  if (!toast) return null;

  const typeConfig = {
    info: {
      border: 'border-[var(--paper-border)]',
      icon: <Info className="w-4 h-4 text-[var(--ink-secondary)] shrink-0" />,
      bg: 'bg-[var(--paper-card)]',
    },
    success: {
      border: 'border-[var(--marigold-border)]',
      icon: <CheckCircle2 className="w-4 h-4 text-[var(--marigold-accent)] shrink-0" />,
      bg: 'bg-[var(--marigold-light)]',
    },
    correction: {
      border: 'border-[var(--brick-red-border)]',
      icon: <AlertTriangle className="w-4 h-4 text-[var(--brick-red)] shrink-0" />,
      bg: 'bg-[var(--brick-red-light)]',
    },
  };

  const current = typeConfig[toast.type || 'info'];

  return (
    <div
      role="alert"
      className="fixed bottom-6 right-6 z-50 max-w-sm w-full animate-in fade-in slide-in-from-bottom-3 duration-200"
    >
      <div
        className={`p-4 rounded-sm border shadow-[var(--paper-shadow-lift)] flex items-start gap-3 ${current.bg} ${current.border}`}
      >
        {current.icon}
        <div className="flex-1 text-left">
          <p className="text-sm font-semibold text-[var(--ink-primary)]">{toast.title}</p>
          {toast.description && (
            <p className="text-xs text-[var(--ink-muted)] mt-0.5">{toast.description}</p>
          )}
        </div>
        <button
          onClick={onDismiss}
          className="text-[var(--ink-muted)] hover:text-[var(--ink-primary)] p-0.5 cursor-pointer"
          aria-label="Close"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
