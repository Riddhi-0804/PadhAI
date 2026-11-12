import React, { useState } from 'react';
import {
  Clock,
  Sparkles,
  Layers,
  CheckCircle2,
  AlertCircle,
  Eye,
  BookmarkPlus,
  BookOpen,
} from 'lucide-react';
import { PauseDoubtResult } from '../../types/lectures';
import { Tag } from '../ui/Tag';
import { Button } from '../ui/Button';

interface MarginNotesPanelProps {
  doubts: PauseDoubtResult[];
  soFarSummary: string;
  onMakeFlashcard: (doubt: PauseDoubtResult) => void;
  onRevealAnyway: (doubtId: string) => void;
}

export const MarginNotesPanel: React.FC<MarginNotesPanelProps> = ({
  doubts,
  soFarSummary,
  onMakeFlashcard,
  onRevealAnyway,
}) => {
  return (
    <div className="w-full flex flex-col gap-4 text-left">
      {/* 3-4 Line "So Far in This Lecture" Summary */}
      <div className="p-4 rounded-sm border border-[var(--paper-border)] bg-[var(--paper-card)] shadow-[var(--paper-shadow-sm)]">
        <div className="flex items-center gap-1.5 text-xs font-mono-time text-[var(--marigold-accent)] font-semibold mb-1.5">
          <Clock className="w-3.5 h-3.5" />
          <span>SO FAR IN THIS LECTURE</span>
        </div>
        <p className="font-serif-title text-sm text-[var(--ink-secondary)] leading-relaxed italic">
          "{soFarSummary || 'Lecture just began. Foundational ray optics principles are being established by Sir.'}"
        </p>
      </div>

      {/* Margin Notes Annotation Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono-time uppercase tracking-wider text-[var(--ink-muted)]">
            Margin Annotations ({doubts.length})
          </span>
          <span className="text-[10px] font-mono-time text-[var(--marigold-accent)]">
            TIMESTAMP-LOCKED
          </span>
        </div>

        {doubts.length === 0 ? (
          <div className="p-8 rounded-sm border border-dashed border-[var(--paper-border)] bg-[var(--paper-card)] text-center text-xs text-[var(--ink-muted)] space-y-1">
            <BookOpen className="w-6 h-6 mx-auto text-[var(--ink-muted)] mb-2 opacity-60" />
            <p className="font-semibold text-[var(--ink-primary)]">No Margin Notes Yet</p>
            <p>Pause the lecture at any moment and click "I have a doubt" to generate an annotation.</p>
          </div>
        ) : (
          doubts.map((d) => (
            <div
              key={d.doubt_id}
              className={`p-4 rounded-sm border shadow-[var(--paper-shadow-lift)] text-left relative notebook-margin-left pl-14 transition-all ${
                d.outcome === 'answered_later' && !d.revealed_anyway
                  ? 'border-2 border-[var(--marigold-border)] bg-[var(--marigold-light)]'
                  : d.outcome === 'not_covered'
                  ? 'border-[var(--paper-border)] bg-[var(--paper-elevated)]'
                  : 'border-[var(--paper-border)] bg-[var(--paper-card)]'
              }`}
            >
              {/* Monospace Timestamp Stamp */}
              <span
                aria-hidden="true"
                className="absolute left-6 top-4 text-[11px] font-mono-time text-[var(--brick-red)] font-semibold select-none"
              >
                [{d.timestamp_formatted}]
              </span>

              {/* OUTCOME B: Answered Later */}
              {d.outcome === 'answered_later' && !d.revealed_anyway ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <Tag variant="marigold" size="sm">
                      ANSWERED AT {d.timestamp}
                    </Tag>
                    <span className="text-[10px] font-mono-time text-[var(--marigold-accent)] font-semibold">
                      NO SPOILERS
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <h4 className="font-serif-title text-sm font-bold text-[var(--ink-primary)]">
                      Your teacher explains this at {d.timestamp}. Until then, think about:
                    </h4>
                    <p className="text-xs text-[var(--ink-secondary)] leading-relaxed italic pl-3 border-l-2 border-[var(--marigold-accent)]">
                      {d.hint}
                    </p>
                  </div>

                  {/* Actions: Show me anyway + Make Flashcard */}
                  <div className="flex items-center justify-between pt-2 border-t border-[var(--marigold-border)] text-xs">
                    <button
                      type="button"
                      onClick={() => onRevealAnyway(d.doubt_id)}
                      className="inline-flex items-center gap-1 font-mono-time text-[11px] text-[var(--marigold-accent)] hover:underline cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Show me anyway</span>
                    </button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onMakeFlashcard(d)}
                      className="gap-1 text-[11px]"
                    >
                      <BookmarkPlus className="w-3 h-3 text-[var(--marigold-accent)]" />
                      <span>Make Flashcard</span>
                    </Button>
                  </div>
                </div>
              ) : (
                /* OUTCOME A or C or Revealed */
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <Tag
                        variant={d.outcome === 'not_covered' ? 'neutral' : 'marigold'}
                        size="sm"
                      >
                        {d.outcome === 'not_covered' ? 'EXTRA CONCEPT' : 'TAUGHT SO FAR'}
                      </Tag>
                      <span className="text-[10px] font-mono-time text-[var(--ink-muted)]">
                        CONFIDENCE: {d.confidence || 'HIGH'}
                      </span>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onMakeFlashcard(d)}
                      className="gap-1 text-[11px]"
                    >
                      <BookmarkPlus className="w-3 h-3 text-[var(--marigold-accent)]" />
                      <span>Make Flashcard</span>
                    </Button>
                  </div>

                  <div className="text-xs text-[var(--ink-primary)] leading-relaxed whitespace-pre-wrap font-body">
                    {d.answer}
                  </div>

                  {/* Source Footer */}
                  <div className="pt-2 border-t border-[var(--paper-rule)] flex items-center justify-between text-[10px] font-mono-time text-[var(--ink-muted)]">
                    <span>Source: {d.source || `Lecture up to ${d.timestamp_formatted}`}</span>
                    {d.leak_guarded && (
                      <span className="text-[var(--marigold-accent)]">Leak-Guard Verified</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
