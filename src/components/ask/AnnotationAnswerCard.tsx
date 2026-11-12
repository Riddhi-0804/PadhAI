import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  HelpCircle,
  Copy,
  Layers,
  GraduationCap,
} from 'lucide-react';
import { DoubtResponse, AnswerMode } from '../../types/doubts';
import { Tag } from '../ui/Tag';

interface AnnotationAnswerCardProps {
  response: DoubtResponse;
  onModeChange: (mode: AnswerMode) => void;
  isLoadingMode?: boolean;
}

export const AnnotationAnswerCard: React.FC<AnnotationAnswerCardProps> = ({
  response,
  onModeChange,
  isLoadingMode = false,
}) => {
  const [copied, setCopied] = React.useState(false);
  const [showAnalogy, setShowAnalogy] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(response.answer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const confidenceBadge = {
    High: {
      tag: 'marigold' as const,
      label: 'High syllabus confidence',
      border: 'border-l-3 border-[var(--marigold-accent)]',
    },
    Medium: {
      tag: 'neutral' as const,
      label: 'Moderate confidence',
      border: 'border-l-3 border-[var(--paper-border)]',
    },
    Low: {
      tag: 'brick' as const,
      label: 'Low confidence - Consult Faculty',
      border: 'border-l-3 border-[var(--brick-red)]',
    },
  }[response.confidence];

  return (
    <div
      className={`relative bg-[var(--paper-card)] border border-[var(--paper-border)] shadow-[var(--paper-shadow-lift)] rounded-sm p-5 sm:p-6 text-left notebook-margin-left pl-14 transition-all ${
        confidenceBadge.border
      }`}
    >
      {/* Physical notebook marginalia stamp */}
      <span
        aria-hidden="true"
        className="absolute left-6 top-6 text-xs font-mono-time text-[var(--brick-red)] opacity-70 select-none"
      >
        ¶.ANS
      </span>

      {/* Top Meta Bar: Mode Switcher + Confidence Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--paper-rule)] pb-3 mb-4">
        {/* Modes: Simple / Exam-style / Deep dive */}
        <div className="inline-flex rounded-sm border border-[var(--paper-border)] bg-[var(--paper-elevated)] p-0.5 text-xs font-mono-time">
          {(
            [
              { id: 'simple', label: 'Simple' },
              { id: 'exam', label: 'Exam-Style' },
              { id: 'deep', label: 'Deep Dive' },
            ] as const
          ).map((m) => (
            <button
              key={m.id}
              type="button"
              disabled={isLoadingMode}
              onClick={() => onModeChange(m.id)}
              className={`px-2.5 py-1 rounded-[2px] transition-colors cursor-pointer ${
                response.mode === m.id
                  ? 'bg-[var(--ink-primary)] text-[var(--paper-bg)] font-semibold'
                  : 'text-[var(--ink-muted)] hover:text-[var(--ink-primary)]'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Confidence & Source line */}
        <div className="flex items-center gap-2">
          <Tag variant={confidenceBadge.tag} size="sm">
            {confidenceBadge.label}
          </Tag>
          <button
            onClick={handleCopy}
            className="p-1 text-[var(--ink-muted)] hover:text-[var(--ink-primary)] cursor-pointer"
            title="Copy answer"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Low Confidence Warning Callout */}
      {response.confidence === 'Low' && (
        <div className="mb-4 p-3 rounded-xs bg-[var(--brick-red-light)] border border-[var(--brick-red-border)] flex items-start gap-2 text-xs text-[var(--brick-red)]">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <strong className="block font-semibold">Low Confidence Notice</strong>
            <span>
              {response.low_confidence_warning ||
                'This concept is not clearly detailed in your current notes. Recommended to ask Dr. Rameshwar Sharma in class.'}
            </span>
          </div>
        </div>
      )}

      {/* Answer Body (formatted markdown text) */}
      <div className="text-xs sm:text-sm text-[var(--ink-primary)] leading-relaxed space-y-3 font-body whitespace-pre-wrap">
        {response.answer}
      </div>

      {/* Local Analogies & Mnemonics Option (Cricket, Chai, Auto-rickshaw) */}
      <div className="mt-4 pt-3 border-t border-dashed border-[var(--paper-rule)]">
        <button
          type="button"
          onClick={() => setShowAnalogy(!showAnalogy)}
          className="inline-flex items-center gap-1.5 text-xs font-mono-time text-[var(--marigold-accent)] hover:underline cursor-pointer font-semibold"
        >
          <span>{showAnalogy ? '▾ Hide' : '▸ Show'} Local Analogy & Mnemonic (देसी उदाहरण)</span>
          <span className="text-[10px] text-[var(--ink-muted)]">🏏 Cricket • ☕ Chai • 🛺 Auto</span>
        </button>

        {showAnalogy && (
          <div className="mt-2.5 p-3.5 rounded-sm bg-[var(--marigold-light)] border border-[var(--marigold-border)] text-xs text-[var(--ink-primary)] leading-relaxed space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono-time font-bold text-[10px] text-[var(--marigold-accent)] uppercase">
                Everyday Indian Context Analogy
              </span>
              <span className="text-[10px] font-mono-time text-[var(--ink-muted)]">
                Intuition Anchor
              </span>
            </div>
            <p className="font-body">
              {response.detected?.topic?.toLowerCase().includes('optic') ||
              response.answer.toLowerCase().includes('refract') ||
              response.answer.toLowerCase().includes('lens') ? (
                <>
                  <strong>🏏 Cricket & 🛺 Auto-Rickshaw Analogy:</strong> Think of a boundary stroke moving from a hard pitch onto heavy, wet outfield grass. The bottom edge of the ball hits the thick grass first and drags, causing the seam to deviate toward the normal. Similarly, an auto-rickshaw whose left tire dips into roadside mud slows down on that side, automatically swinging the handlebar inward.
                </>
              ) : response.detected?.topic?.toLowerCase().includes('electro') ||
                response.detected?.topic?.toLowerCase().includes('kinetic') ||
                response.answer.toLowerCase().includes('ion') ? (
                <>
                  <strong>☕ Cutting Chai Boiling Analogy:</strong> In a roadside tea stall, limiting conductivity (Kohlrausch) is like the full aroma of cutting chai—it equals the independent contribution of crushed ginger plus roasted tea leaves plus rich buffalo milk, regardless of whose glass it is poured into.
                </>
              ) : (
                <>
                  <strong>🛺 Shared Auto-Rickshaw Seat Analogy:</strong> When 3 passengers share an auto seat and one gets down at the crossing, the remaining two passengers naturally expand and share the empty seat in proportion to their old comfort (Gaining Ratio = New Ratio - Old Ratio).
                </>
              )}
            </p>
          </div>
        )}
      </div>

      {/* Citations Footer */}
      <div className="mt-5 pt-3 border-t border-[var(--paper-rule)] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] font-mono-time">
        {response.citations && response.citations.length > 0 ? (
          <div className="flex flex-wrap items-center gap-2 text-[var(--ink-muted)]">
            <BookOpen className="w-3.5 h-3.5 text-[var(--marigold-accent)] shrink-0" />
            <span className="font-semibold text-[var(--ink-primary)]">
              {response.citations[0].source}
            </span>
            <span>•</span>
            <span className="text-[var(--marigold-accent)]">
              {response.citations[0].section}
            </span>
          </div>
        ) : (
          <span className="text-[var(--ink-muted)]">
            [No direct notebook citation • General syllabus principles]
          </span>
        )}

        {response.weak_topics_noted && response.weak_topics_noted.length > 0 && (
          <span className="text-[10px] text-[var(--brick-red)] bg-[var(--brick-red-light)] px-1.5 py-0.5 rounded-xs">
            Student Weak Spot: {response.weak_topics_noted[0]}
          </span>
        )}
      </div>
    </div>
  );
};
