import React from 'react';
import { HelpCircle, ChevronRight } from 'lucide-react';
import { ClarificationPrompt as IClarificationPrompt } from '../../types/doubts';

interface ClarificationPromptProps {
  clarification: IClarificationPrompt;
  onSelectOption: (option: string) => void;
}

export const ClarificationPrompt: React.FC<ClarificationPromptProps> = ({
  clarification,
  onSelectOption,
}) => {
  return (
    <div className="p-3.5 rounded-sm border-2 border-[var(--marigold-border)] bg-[var(--marigold-light)] text-left mb-4 shadow-[var(--paper-shadow-sm)]">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--marigold-accent)] mb-2 font-mono-time">
        <HelpCircle className="w-3.5 h-3.5 shrink-0" />
        <span>CLARIFICATION NEEDED: {clarification.question}</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {clarification.options.map((opt, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelectOption(opt)}
            className="px-3 py-1.5 text-xs rounded-sm border border-[var(--paper-border)] bg-[var(--paper-card)] hover:border-[var(--marigold-accent)] hover:text-[var(--marigold-accent)] text-[var(--ink-primary)] font-medium transition-all text-left flex items-center gap-1.5 cursor-pointer shadow-[var(--paper-shadow-sm)]"
          >
            <span>{opt}</span>
            <ChevronRight className="w-3 h-3 text-[var(--marigold-accent)] shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
};
