import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Clock,
  BookOpen,
  Award,
  Layers,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';
import { DifficultyLevel } from '../../types/practice';
import { Button } from '../ui/Button';
import { Tag } from '../ui/Tag';

interface TestGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (config: {
    subject: string;
    difficulty: DifficultyLevel;
    isMockExam: boolean;
    timerMinutes: number;
    topicFilter?: string;
  }) => void;
  initialTopicFilter?: string;
}

export const TestGeneratorModal: React.FC<TestGeneratorModalProps> = ({
  isOpen,
  onClose,
  onGenerate,
  initialTopicFilter,
}) => {
  const [subject, setSubject] = useState('Physics');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('adaptive');
  const [isMockExam, setIsMockExam] = useState<boolean>(false);
  const [timerMinutes, setTimerMinutes] = useState<number>(15);
  const [topicFilter, setTopicFilter] = useState(initialTopicFilter || '');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate({
      subject,
      difficulty,
      isMockExam,
      timerMinutes: timerMinutes,
      topicFilter: topicFilter.trim() || undefined,
    });
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-xs animate-in fade-in"
    >
      <div className="relative w-full max-w-xl bg-[var(--paper-card)] border border-[var(--paper-border)] shadow-[var(--paper-shadow-lift)] rounded-sm p-6 text-left max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[var(--ink-muted)] hover:text-[var(--ink-primary)] p-1 cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-4">
          <Tag variant="marigold" size="sm" className="mb-1">
            EXAM SHEET ENGINE
          </Tag>
          <h2 className="font-serif-title text-xl sm:text-2xl font-bold text-[var(--ink-primary)]">
            Generate Practice Test
          </h2>
          <p className="text-xs text-[var(--ink-muted)] mt-0.5">
            Questions are generated strictly from your uploaded notebook chunks.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Subject Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[var(--ink-secondary)] block mb-1">
                Subject
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-[var(--paper-elevated)] text-[var(--ink-primary)] border border-[var(--paper-border)] rounded-sm cursor-pointer focus:ring-1 focus:ring-[var(--marigold-accent)]"
              >
                <option value="Physics">Physics (Ray & Wave Optics)</option>
                <option value="Accountancy">Accountancy (Partnership & AS-26)</option>
                <option value="Economics">Economics (Multiplier & Macro)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[var(--ink-secondary)] block mb-1">
                Topic Focus (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Lens Maker Formula"
                value={topicFilter}
                onChange={(e) => setTopicFilter(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-[var(--paper-elevated)] text-[var(--ink-primary)] border border-[var(--paper-border)] rounded-sm focus:ring-1 focus:ring-[var(--marigold-accent)]"
              />
            </div>
          </div>

          {/* Difficulty Choice (Adaptive first) */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--ink-secondary)] block mb-1.5">
              Difficulty Calibration
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'adaptive', label: 'Adaptive', sub: 'From weak spots' },
                { id: 'beginner', label: 'Foundation', sub: 'NCERT formulas' },
                { id: 'intermediate', label: 'Moderate', sub: 'Standard boards' },
                { id: 'advanced', label: 'Advanced', sub: 'Tricky numericals' },
              ].map((lvl) => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => setDifficulty(lvl.id as DifficultyLevel)}
                  className={`p-2.5 rounded-sm border text-left cursor-pointer transition-all ${
                    difficulty === lvl.id
                      ? 'border-[var(--marigold-accent)] bg-[var(--marigold-light)] shadow-[var(--paper-shadow-sm)]'
                      : 'border-[var(--paper-border)] bg-[var(--paper-card)] hover:bg-[var(--paper-elevated)]'
                  }`}
                >
                  <span className="text-xs font-semibold text-[var(--ink-primary)] block">
                    {lvl.label}
                  </span>
                  <span className="text-[10px] font-mono-time text-[var(--ink-muted)] block mt-0.5">
                    {lvl.sub}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Mode & Timer Options */}
          <div className="p-3.5 rounded-sm border border-[var(--paper-border)] bg-[var(--paper-elevated)] space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-[var(--ink-primary)] block">
                  Mock Exam Mode
                </span>
                <span className="text-[11px] text-[var(--ink-muted)]">
                  Simulates CBSE board paper with strict timer, step rubrics & post-test analysis.
                </span>
              </div>
              <input
                type="checkbox"
                checked={isMockExam}
                onChange={(e) => setIsMockExam(e.target.checked)}
                className="w-4 h-4 accent-[var(--marigold-accent)] cursor-pointer"
              />
            </div>

            <div className="pt-2 border-t border-[var(--paper-border)] flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--ink-primary)] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[var(--marigold-accent)]" />
                <span>Timer Duration</span>
              </span>
              <div className="flex items-center gap-1">
                {[
                  { label: 'No timer', val: 0 },
                  { label: '15 Mins', val: 15 },
                  { label: '30 Mins', val: 30 },
                ].map((t) => (
                  <button
                    key={t.val}
                    type="button"
                    onClick={() => setTimerMinutes(t.val)}
                    className={`px-2.5 py-1 text-xs font-mono-time rounded-xs border cursor-pointer ${
                      timerMinutes === t.val
                        ? 'border-[var(--marigold-accent)] bg-[var(--paper-card)] font-bold text-[var(--marigold-accent)]'
                        : 'border-[var(--paper-border)] text-[var(--ink-muted)]'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Note Source Grounding Guarantee */}
          <div className="p-3 rounded-xs border border-[var(--paper-border)] bg-[var(--paper-card)] flex items-start gap-2.5 text-xs text-[var(--ink-secondary)]">
            <CheckCircle2 className="w-4 h-4 text-[var(--marigold-accent)] shrink-0 mt-0.5" />
            <p>
              Each question stores its source notebook chunk ID and page number so you can cross-verify all steps during evaluation.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="marigold" type="submit" className="gap-2 font-semibold">
              <Sparkles className="w-4 h-4" />
              <span>Generate Test Sheet</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
