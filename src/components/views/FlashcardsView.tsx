import React, { useState, useEffect } from 'react';
import {
  Layers,
  PlusCircle,
  Sparkles,
  BookOpen,
  RotateCcw,
  CheckCircle2,
  Calendar,
  Flame,
  Award,
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { Button } from '../ui/Button';
import { Tag } from '../ui/Tag';
import { SM2Flashcard, SM2Rating } from '../../types/engagement';
import { plannerService } from '../../services/plannerService';
import { FlashcardReviewCard } from '../flashcards/FlashcardReviewCard';
import { FlashcardDeckModal } from '../flashcards/FlashcardDeckModal';

interface FlashcardsViewProps {
  onTriggerToast: (title: string, desc?: string, type?: 'info' | 'success' | 'correction') => void;
}

export const FlashcardsView: React.FC<FlashcardsViewProps> = ({ onTriggerToast }) => {
  const { t, language } = useLanguage();
  const [cards, setCards] = useState<SM2Flashcard[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviewedCountSession, setReviewedCountSession] = useState(0);

  const loadCards = () => {
    const all = plannerService.getFlashcards();
    setCards(all);
  };

  useEffect(() => {
    loadCards();
  }, []);

  const handleRateCard = (rating: SM2Rating) => {
    if (cards.length === 0 || currentIdx >= cards.length) return;
    const activeCard = cards[currentIdx];

    const updated = plannerService.reviewFlashcard(activeCard.id, rating);
    setReviewedCountSession((prev) => prev + 1);

    const ratingLabels = {
      1: 'Again (Reset to 1d)',
      2: 'Hard (Interval 2d)',
      3: 'Good (Interval 4d)',
      4: 'Easy (Interval 7d)',
    };

    onTriggerToast(
      `Reviewed: ${ratingLabels[rating]}`,
      `SM-2 scheduled next review for ${new Date(updated.next_review).toLocaleDateString()} (+20 XP)`,
      'success'
    );

    // Advance to next card
    if (currentIdx + 1 < cards.length) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setCurrentIdx(cards.length); // Done state
    }
    loadCards();
  };

  const handleCreated = (count: number) => {
    loadCards();
    setCurrentIdx(0);
    onTriggerToast(
      'Flashcards Ready',
      `Added ${count} active recall cards with local analogies & note citations!`,
      'success'
    );
  };

  const isReviewComplete = cards.length > 0 && currentIdx >= cards.length;
  const currentCard = cards[currentIdx];

  return (
    <div className="w-full text-left space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--paper-border)] pb-4">
        <div>
          <span className="text-xs font-mono-time uppercase text-[var(--marigold-accent)] font-semibold">
            SM-2 SPACED REPETITION ENGINE
          </span>
          <h2 className="font-serif-title text-2xl font-bold text-[var(--ink-primary)]">
            {t.nav.flashcards}
          </h2>
          <p className="text-xs text-[var(--ink-muted)] mt-0.5">
            Active recall decks with SuperMemo-2 intervals, local Indian analogies, and page citations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsModalOpen(true)}
          >
            <Sparkles className="w-3.5 h-3.5 mr-1.5 text-[var(--marigold-accent)]" />
            Auto-Extract from Notes
          </Button>
          <Button
            variant="ink"
            size="sm"
            onClick={() => setIsModalOpen(true)}
          >
            <PlusCircle className="w-3.5 h-3.5 mr-1.5 text-[var(--marigold-accent)]" />
            New Card
          </Button>
        </div>
      </div>

      {/* Main Review Section */}
      {cards.length === 0 ? (
        <div className="p-8 rounded-sm border border-[var(--paper-border)] bg-[var(--paper-card)] text-center space-y-4">
          <Layers className="w-8 h-8 text-[var(--marigold-accent)] mx-auto opacity-70" />
          <h4 className="font-serif-title text-lg font-bold text-[var(--ink-primary)]">
            No Flashcards in Deck
          </h4>
          <p className="text-xs text-[var(--ink-muted)] max-w-md mx-auto">
            Extract formula cards and definitions directly from your uploaded notes and saved lecture doubts.
          </p>
          <Button variant="ink" size="sm" onClick={() => setIsModalOpen(true)}>
            Extract Cards Now
          </Button>
        </div>
      ) : isReviewComplete ? (
        /* Completed Deck State */
        <div className="p-8 sm:p-10 rounded-sm border-2 border-[var(--marigold-accent)] bg-[var(--paper-card)] text-center space-y-4 max-w-xl mx-auto shadow-xs">
          <div className="w-12 h-12 rounded-full bg-[var(--marigold-light)] border border-[var(--marigold-border)] flex items-center justify-center mx-auto text-[var(--marigold-accent)]">
            <CheckCircle2 className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-mono-time uppercase text-[var(--marigold-accent)] font-semibold tracking-wider">
              SM-2 QUEUE COMPLETE
            </span>
            <h3 className="font-serif-title text-2xl font-bold text-[var(--ink-primary)]">
              Daily Recall Session Finished!
            </h3>
            <p className="text-xs text-[var(--ink-muted)] font-body max-w-sm mx-auto">
              You reviewed {reviewedCountSession || cards.length} cards today. Intervals have been updated
              according to your recall difficulty. Next review scheduled for tomorrow morning.
            </p>
          </div>

          <div className="pt-4 border-t border-[var(--paper-rule)] flex items-center justify-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setCurrentIdx(0);
                setReviewedCountSession(0);
              }}
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1.5 text-[var(--marigold-accent)]" />
              Review Deck Again
            </Button>
            <Button
              variant="marigold"
              size="sm"
              onClick={() => setIsModalOpen(true)}
            >
              <PlusCircle className="w-3.5 h-3.5 mr-1.5 text-white" />
              Add More Cards
            </Button>
          </div>
        </div>
      ) : (
        /* Active Flashcard Review */
        <FlashcardReviewCard
          card={currentCard}
          cardNumber={currentIdx + 1}
          totalCards={cards.length}
          onRate={handleRateCard}
        />
      )}

      {/* Deck Inventory / Chapters Breakdown */}
      <div className="space-y-3 pt-6 border-t border-[var(--paper-border)]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono-time uppercase text-[var(--marigold-accent)] font-semibold">
            DECK INVENTORY ({cards.length} TOTAL CARDS)
          </span>
          <span className="text-xs font-mono-time text-[var(--ink-muted)]">
            SuperMemo-2 (EF 1.3 - 2.8)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {cards.map((c, i) => (
            <div
              key={c.id}
              onClick={() => setCurrentIdx(i)}
              className={`p-3.5 rounded-sm border transition-all cursor-pointer text-left ${
                i === currentIdx && !isReviewComplete
                  ? 'border-[var(--marigold-accent)] bg-[var(--marigold-light)]/40'
                  : 'border-[var(--paper-border)] bg-[var(--paper-card)] hover:border-[var(--ink-primary)]'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-mono-time text-[var(--ink-muted)] mb-1">
                <span className="font-semibold text-[var(--ink-primary)]">
                  {c.subject} • {c.chapter}
                </span>
                <span>{c.interval_days}d interval</span>
              </div>
              <h5 className="font-serif-title text-xs font-bold text-[var(--ink-primary)] line-clamp-2">
                {c.front}
              </h5>
              <div className="mt-2 text-[10px] font-mono-time text-[var(--marigold-accent)] flex items-center gap-1">
                <span>EF: {c.ease_factor}</span>
                <span>•</span>
                <span>Reps: {c.repetition_count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <FlashcardDeckModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={handleCreated}
      />
    </div>
  );
};
