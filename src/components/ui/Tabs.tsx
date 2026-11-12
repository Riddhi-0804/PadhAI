import React from 'react';

export interface TabItem {
  id: string;
  label: string;
  badge?: string | number;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className = '',
}) => {
  return (
    <div
      role="tablist"
      className={`flex items-center gap-1 border-b border-[var(--paper-border)] overflow-x-auto no-scrollbar ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`relative px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap cursor-pointer select-none ${
              isActive
                ? 'text-[var(--ink-primary)] font-semibold'
                : 'text-[var(--ink-muted)] hover:text-[var(--ink-secondary)]'
            }`}
          >
            <span className="flex items-center gap-2">
              {tab.label}
              {tab.badge !== undefined && (
                <span
                  className={`text-[10px] font-mono-time px-1.5 py-0.2 rounded-[2px] ${
                    isActive
                      ? 'bg-[var(--marigold-light)] text-[var(--marigold-accent)] border border-[var(--marigold-border)]'
                      : 'bg-[var(--paper-elevated)] text-[var(--ink-muted)]'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </span>
            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--marigold-accent)]" />
            )}
          </button>
        );
      })}
    </div>
  );
};
