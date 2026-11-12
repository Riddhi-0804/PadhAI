import React, { useState } from 'react';
import {
  RotateCcw,
  Sparkles,
  BookOpen,
  CheckCircle2,
  HelpCircle,
  ChevronRight,
  Flame,
} from 'lucide-react';
import { SM2Flashcard, SM2Rating } from '../../types/engagement';
import { Tag } from '../ui/Tag';
import { Button } from '../ui/Button';

interface FlashcardReviewCardProps {
  card: SM2Flashcard;
  cardNumber: number;
  totalCards: number;
  onRate: (rating: SM2Rating) => void;
}

export const FlashcardReviewCard: React.FC<FlashcardReviewCardProps> = ({
  card,
  cardNumber,
  totalCards,
  onRate,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* Top Deck Progress Header */}
      <div className="flex items-center justify-between text-xs font-mono-time text-[var(--ink-muted)]">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[var(--ink-primary)]">
            CARD {cardNumber} OF {totalCards}
          </span>
          <span>•</span>
          <span className="text-[var(--marigold-accent)] font-semibold">{card.subject}</span>
          <span>•</span>
          <span>{card.chapter}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Rep: {card.repetition_count}</span>
          <span>•</span>
          <span>Ease: {card.ease_factor}</span>
        </div>
      </div>

      {/* Main Flashcard Body */}
      <div
        onClick={handleFlip}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            handleFlip();
          }
        }}
        className={`relative w-full min-h-[300px] p-6 sm:p-8 rounded-sm bg-[var(--paper-card)] border border-[var(--paper-border)] shadow-[var(--paper-shadow-lift)] text-left cursor-pointer transition-all duration-300 notebook-margin-left pl-14 sm:pl-16 select-none ${
          isFlipped ? 'border-[var(--marigold-accent)]' : 'hover:border-[var(--ink-primary)]'
        }`}
      >
        {/* Notebook Margins Stamp */}
        <span
          aria-hidden="true"
          className="absolute left-4 sm:left-6 top-6 text-xs font-mono-time text-[var(--brick-red)] opacity-70 select-none font-bold"
        >
          {isFlipped ? 'A.' : 'Q.'}
        </span>

        {/* Card Side Content */}
        {!isFlipped ? (
          <div className="flex flex-col justify-between h-full min-h-[220px]">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-mono-time text-[var(--marigold-accent)] font-semibold uppercase tracking-wider">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Prompt / Concept Question</span>
              </div>
              <h3 className="font-serif-title text-xl sm:text-2xl text-[var(--ink-primary)] leading-snug">
                {card.front}
              </h3>
            </div>

            <div className="mt-8 pt-4 border-t border-[var(--paper-rule)] flex items-center justify-between text-xs font-mono-time text-[var(--ink-muted)]">
              <span className="flex items-center gap-1.5">
                <RotateCcw className="w-3.5 h-3.5 text-[var(--marigold-accent)]" />
                Tap card or press Space to reveal answer
              </span>
              <span className="text-[10px] text-[var(--ink-muted)]">
                Next interval: {card.interval_days}d
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col justify-between h-full min-h-[220px] space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-mono-time text-[var(--ink-primary)] font-semibold uppercase tracking-wider">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[var(--marigold-accent)]" />
                  <span>Model Answer & Verification</span>
                </span>
                <span className="text-[10px] font-mono-time text-[var(--ink-muted)] bg-[var(--paper-elevated)] px-2 py-0.5 rounded-[2px] border border-[var(--paper-border)]">
                  SM-2 Active
                </span>
              </div>

              <div className="font-body text-sm sm:text-base text-[var(--ink-primary)] leading-relaxed whitespace-pre-wrap">
                {card.back}
              </div>

              {/* Local Analogy (Cricket / Chai / Auto-Rickshaw) */}
              {card.bilingual_analogy && (
                <div className="mt-4 p-3.5 rounded-[2px] bg-[var(--marigold-light)] border border-[var(--marigold-border)] text-xs text-[var(--ink-primary)] font-body leading-relaxed">
                  <span className="font-semibold block text-[var(--marigold-accent)] text-[11px] font-mono-time uppercase mb-1">
                    Local Analogy & Mnemonic (देसी उदाहरण)
                  </span>
                  {card.bilingual_analogy}
                </div>
              )}
            </div>

            {/* Citation footnote */}
            <div className="pt-3 border-t border-[var(--paper-rule)] flex items-center justify-between text-[11px] font-mono-time text-[var(--ink-muted)]">
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[var(--marigold-accent)]" />
                {card.source_citation}
              </span>
              <span className="text-[10px] text-[var(--marigold-accent)] font-semibold">
                Flip back ↺
              </span>
            </div>
          </div>
        )}
      </div>

      {/* SM-2 Rating Buttons (Shown after card is flipped) */}
      {isFlipped ? (
        <div className="p-4 rounded-sm bg-[var(--paper-elevated)] border border-[var(--paper-border)] space-y-2">
          <div className="flex items-center justify-between text-xs font-mono-time text-[var(--ink-muted)]">
            <span>Rate your recall effort (SM-2 Algorithm):</span>
            <span className="text-[10px] text-[var(--marigold-accent)] font-semibold">+20 XP</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            <button
              onClick={() => onRate(1)}
              type="button"
              className="flex flex-col items-center justify-center py-2.5 px-3 rounded-[2px] border border-[var(--brick-red-border)] bg-[var(--brick-red-light)] text-[var(--brick-red)] hover:opacity-90 transition-opacity cursor-pointer text-left"
            >
              <span className="text-xs font-semibold font-mono-time">1. Again</span>
              <span className="text-[10px] opacity-80">Repeat in 1d</span>
            </button>

            <button
              onClick={() => onRate(2)}
              type="button"
              className="flex flex-col items-center justify-center py-2.5 px-3 rounded-[2px] border border-[var(--paper-border)] bg-[var(--paper-card)] text-[var(--ink-primary)] hover:border-[var(--ink-muted)] transition-colors cursor-pointer text-left"
            >
              <span className="text-xs font-semibold font-mono-time">2. Hard</span>
              <span className="text-[10px] text-[var(--ink-muted)]">Review in 2d</span>
            </button>

            <button
              onClick={() => onRate(3)}
              type="button"
              className="flex flex-col items-center justify-center py-2.5 px-3 rounded-[2px] border border-[var(--marigold-border)] bg-[var(--marigold-light)] text-[var(--marigold-accent)] hover:opacity-90 transition-opacity cursor-pointer text-left"
            >
              <span className="text-xs font-semibold font-mono-time">3. Good</span>
              <span className="text-[10px] opacity-80">Review in 4d</span>
            </button>

            <button
              onClick={() => onRate(4)}
              type="button"
              className="flex flex-col items-center justify-center py-2.5 px-3 rounded-[2px] border border-[var(--ink-primary)] bg-[var(--ink-primary)] text-[var(--paper-bg)] hover:opacity-95 transition-opacity cursor-pointer text-left"
            >
              <span className="text-xs font-semibold font-mono-time">4. Easy</span>
              <span className="text-[10px] opacity-80">Review in 7d</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <Button variant="outline" size="sm" onClick={handleFlip}>
            <RotateCcw className="w-3.5 h-3.5 mr-1.5 text-[var(--marigold-accent)]" />
            Show Answer
          </Button>
        </div>
      )}
    </div>
  );
};
