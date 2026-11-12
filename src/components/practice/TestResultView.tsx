import React from 'react';
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  BookOpen,
  Clock,
  Sparkles,
  ArrowLeft,
  ChevronDown,
} from 'lucide-react';
import { TestResult, TestQuestion } from '../../types/practice';
import { Tag } from '../ui/Tag';
import { Button } from '../ui/Button';

interface TestResultViewProps {
  result: TestResult;
  questions: TestQuestion[];
  onRetake: () => void;
  onBackToDashboard: () => void;
}

export const TestResultView: React.FC<TestResultViewProps> = ({
  result,
  questions,
  onRetake,
  onBackToDashboard,
}) => {
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}m ${s}s`;
  };

  const qMap = new Map(questions.map((q) => [q.id, q]));

  return (
    <div className="w-full flex flex-col gap-6 text-left">
      {/* Scorecard Hero Banner Stamped in Ink */}
      <div className="p-6 rounded-sm border-2 border-[var(--paper-border)] bg-[var(--paper-card)] shadow-[var(--paper-shadow-lift)] flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Tag variant={result.percentage >= 75 ? 'marigold' : 'brick'} size="sm">
              {result.percentage >= 75 ? 'CBSE FIRST DIVISION' : 'REVISION REQUIRED'}
            </Tag>
            <span className="text-xs font-mono-time text-[var(--ink-muted)]">
              ATTEMPT ID: {result.attempt_id.toUpperCase()}
            </span>
          </div>

          <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-[var(--ink-primary)]">
            Evaluation & Marking Sheet
          </h2>

          <p className="text-xs sm:text-sm text-[var(--ink-secondary)] mt-1 max-w-xl leading-relaxed">
            {result.summary_feedback}
          </p>
        </div>

        {/* Score Stamp Box */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="p-4 rounded-sm border-2 border-[var(--marigold-border)] bg-[var(--marigold-light)] text-center min-w-[130px]">
            <span className="text-[10px] font-mono-time uppercase text-[var(--marigold-accent)] font-bold block">
              FINAL SCORE
            </span>
            <span className="text-3xl font-bold font-mono-time text-[var(--ink-primary)] block my-0.5">
              {result.score} <span className="text-sm font-normal text-[var(--ink-muted)]">/ {result.total_marks}</span>
            </span>
            <span className="text-xs font-mono-time font-bold text-[var(--marigold-accent)]">
              {result.percentage}% Marks
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <Button variant="marigold" size="sm" onClick={onRetake} className="gap-1.5 text-xs font-semibold">
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Test</span>
            </Button>
            <Button variant="outline" size="sm" onClick={onBackToDashboard} className="gap-1.5 text-xs">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Syllabus Radar</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Post-Test Analysis Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-sm border border-[var(--paper-border)] bg-[var(--paper-card)] flex items-center gap-3">
          <Clock className="w-4 h-4 text-[var(--marigold-accent)] shrink-0" />
          <div className="text-xs">
            <span className="text-[10px] font-mono-time uppercase text-[var(--ink-muted)] block">Time Spent</span>
            <span className="font-bold text-[var(--ink-primary)] font-mono-time">{formatTime(result.time_spent_seconds)}</span>
          </div>
        </div>

        <div className="p-3.5 rounded-sm border border-[var(--paper-border)] bg-[var(--paper-card)] flex items-center gap-3">
          <Award className="w-4 h-4 text-[var(--marigold-accent)] shrink-0" />
          <div className="text-xs">
            <span className="text-[10px] font-mono-time uppercase text-[var(--ink-muted)] block">Evaluation Style</span>
            <span className="font-bold text-[var(--ink-primary)]">CBSE Step-wise Rubric</span>
          </div>
        </div>

        <div className="p-3.5 rounded-sm border border-[var(--paper-border)] bg-[var(--paper-card)] flex items-center gap-3">
          <Sparkles className="w-4 h-4 text-[var(--marigold-accent)] shrink-0" />
          <div className="text-xs">
            <span className="text-[10px] font-mono-time uppercase text-[var(--ink-muted)] block">Topic Radar</span>
            <span className="font-bold text-[var(--ink-primary)]">Stats Updated Live</span>
          </div>
        </div>
      </div>

      {/* Detailed Question Evaluations with Brick-Red Missing Points */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono-time uppercase tracking-wider text-[var(--ink-muted)]">
            Step-by-Step Marking & Missing Concepts
          </span>
          <span className="text-[10px] font-mono-time text-[var(--brick-red)] font-semibold">
            BRICK RED INK = DEDUCTIONS
          </span>
        </div>

        {result.evaluations.map((ev, idx) => {
          const originalQ = qMap.get(ev.question_id);
          const isFull = ev.score_awarded >= ev.max_marks;
          const isZero = ev.score_awarded === 0;

          return (
            <div
              key={ev.question_id}
              className={`p-5 sm:p-6 rounded-sm border shadow-[var(--paper-shadow-sm)] text-left space-y-4 notebook-margin-left pl-14 relative ${
                isFull
                  ? 'border-[var(--paper-border)] bg-[var(--paper-card)]'
                  : 'border-[var(--brick-red-border)] bg-[var(--paper-card)]'
              }`}
            >
              {/* Question Stamp */}
              <span
                aria-hidden="true"
                className="absolute left-6 top-6 text-xs font-mono-time text-[var(--brick-red)] font-bold select-none"
              >
                Q.{idx + 1}
              </span>

              {/* Question Evaluation Header */}
              <div className="flex items-center justify-between gap-2 border-b border-[var(--paper-rule)] pb-2.5">
                <div className="flex items-center gap-2">
                  <Tag
                    variant={isFull ? 'marigold' : isZero ? 'brick' : 'neutral'}
                    size="sm"
                  >
                    {isFull ? 'FULL MARKS' : isZero ? 'NO CREDIT' : 'PARTIAL CREDIT'}
                  </Tag>
                  <span className="text-[10px] font-mono-time text-[var(--ink-muted)]">
                    {originalQ?.type.toUpperCase()}
                  </span>
                </div>

                <span className="text-xs font-mono-time font-bold">
                  Awarded:{' '}
                  <strong className={isFull ? 'text-[var(--marigold-accent)]' : 'text-[var(--brick-red)]'}>
                    {ev.score_awarded}
                  </strong>{' '}
                  / {ev.max_marks} Marks
                </span>
              </div>

              {/* Original Question Prompt */}
              <p className="font-serif-title text-base font-bold text-[var(--ink-primary)]">
                {originalQ?.question}
              </p>

              {/* Brick-Red What is Missing Callout */}
              {ev.what_is_missing && ev.what_is_missing.length > 0 && (
                <div className="p-3.5 rounded-xs bg-[var(--brick-red-light)] border border-[var(--brick-red-border)] text-xs text-[var(--brick-red)] space-y-1.5">
                  <div className="flex items-center gap-1.5 font-mono-time font-bold uppercase tracking-wider text-[11px]">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>What is Missing / Deductions (लाल स्याही):</span>
                  </div>
                  <ul className="list-disc list-inside space-y-0.5 leading-relaxed pl-1">
                    {ev.what_is_missing.map((item, mIdx) => (
                      <li key={mIdx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Model Answer & Step-wise Rubric */}
              <div className="p-3.5 rounded-xs bg-[var(--paper-elevated)] border border-[var(--paper-border)] space-y-1.5 text-xs text-[var(--ink-primary)]">
                <span className="text-[10px] font-mono-time uppercase text-[var(--marigold-accent)] font-bold block">
                  CBSE Model Answer & Marking Scheme:
                </span>
                <p className="leading-relaxed font-body whitespace-pre-wrap">
                  {ev.model_answer}
                </p>
              </div>

              {/* Bilingual notes */}
              {ev.bilingual_notes && (
                <div className="p-2.5 rounded-xs bg-[var(--marigold-light)] border-l-2 border-[var(--marigold-accent)] text-xs text-[var(--ink-secondary)] italic">
                  <strong className="text-[var(--marigold-accent)] not-italic block mb-0.5 text-[10px] font-mono-time uppercase">
                    Bilingual Exam Technique (हिंदी समझ):
                  </strong>
                  {ev.bilingual_notes}
                </div>
              )}

              {/* Verified Source Citation */}
              <div className="pt-2 border-t border-[var(--paper-rule)] flex items-center justify-between text-[10px] font-mono-time text-[var(--ink-muted)]">
                <span className="flex items-center gap-1">
                  <BookOpen className="w-3 h-3 text-[var(--marigold-accent)]" />
                  <span>Verified: {ev.source_citation}</span>
                </span>
                <span>Ground Truth Notebook</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
