import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';

export const LanguageSwitcher: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      role="group"
      aria-label="Language selection"
      className="inline-flex items-center rounded-sm border border-[var(--paper-border)] bg-[var(--paper-card)] p-0.5 text-xs font-mono-time"
    >
      <button
        type="button"
        onClick={() => setLanguage('en')}
        className={`px-2 py-1 rounded-[2px] transition-colors cursor-pointer ${
          language === 'en'
            ? 'bg-[var(--ink-primary)] text-[var(--paper-bg)] font-semibold'
            : 'text-[var(--ink-muted)] hover:text-[var(--ink-primary)]'
        }`}
        title="Switch to English"
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLanguage('hi')}
        className={`px-2 py-1 rounded-[2px] transition-colors cursor-pointer ${
          language === 'hi'
            ? 'bg-[var(--marigold-accent)] text-white font-semibold'
            : 'text-[var(--ink-muted)] hover:text-[var(--ink-primary)]'
        }`}
        title="हिंदी में बदलें"
      >
        हिन्दी
      </button>
    </div>
  );
};
