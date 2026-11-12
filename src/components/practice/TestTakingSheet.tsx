import React, { useState, useEffect } from 'react';
import {
  Clock,
  Sparkles,
  BookOpen,
  Send,
  AlertCircle,
  HelpCircle,
  Languages,
  ArrowLeft,
} from 'lucide-react';
import { TestQuestion, AnswerSubmission } from '../../types/practice';
import { Tag } from '../ui/Tag';
import { Button } from '../ui/Button';

interface TestTakingSheetProps {
  testId: string;
  subject: string;
  questions: TestQuestion[];
  isMockExam: boolean;
  timerMinutes: number;
  onCancel: () => void;
  onSubmit: (submissions: AnswerSubmission[], timeSpentSeconds: number) => void;
  isEvaluating?: boolean;
}

export const TestTakingSheet: React.FC<TestTakingSheetProps> = ({
  testId,
  subject,
  questions,
  isMockExam,
  timerMinutes,
  onCancel,
  onSubmit,
  isEvaluating = false,
}) => {
  const [submissions, setSubmissions] = useState<Record<string, { text: string; optIndex?: number }>>({});
  const [bilingualActive, setBilingualActive] = useState<boolean>(true);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(timerMinutes * 60);
  const [timeSpent, setTimeSpent] = useState<number>(0);

  // Timer Countdown
  useEffect(() => {
    if (timerMinutes <= 0) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
      setTimeSpent((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timerMinutes]);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleTextChange = (qid: string, val: string) => {
    setSubmissions((prev) => ({
      ...prev,
      [qid]: { ...prev[qid], text: val },
    }));
  };

  const handleSelectOption = (qid: string, idx: number, optText: string) => {
    setSubmissions((prev) => ({
      ...prev,
      [qid]: { text: optText, optIndex: idx },
    }));
  };

  const handleSubmit = () => {
    const formatted: AnswerSubmission[] = questions.map((q) => ({
      question_id: q.id,
      answer_text: submissions[q.id]?.text || '',
      selected_option_index: submissions[q.id]?.optIndex,
    }));
    onSubmit(formatted, timeSpent || (timerMinutes * 60 - secondsRemaining));
  };

  const totalMarks = questions.reduce((acc, q) => acc + q.marks, 0);

  return (
    <div className="w-full flex flex-col gap-6 text-left">
      {/* Sticky Header with Timer & Bilingual Mode Toggle */}
      <div className="sticky top-14 z-30 p-4 rounded-sm border border-[var(--paper-border)] bg-[var(--paper-bg)]/95 backdrop-blur-xs flex flex-wrap items-center justify-between gap-3 shadow-[var(--paper-shadow-sm)]">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="p-1 text-[var(--ink-muted)] hover:text-[var(--ink-primary)] cursor-pointer"
            title="Cancel test"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono-time font-bold text-[var(--marigold-accent)] uppercase">
                {isMockExam ? 'CBSE MOCK EXAM' : 'PRACTICE ANSWER SHEET'}
              </span>
              <Tag variant="neutral" size="sm">{subject}</Tag>
            </div>
            <span className="text-[11px] font-mono-time text-[var(--ink-muted)] block">
              {questions.length} Questions • Maximum Marks: {totalMarks}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Bilingual Toggle */}
          <button
            type="button"
            onClick={() => setBilingualActive(!bilingualActive)}
            className={`px-2.5 py-1 text-xs rounded-xs border font-mono-time flex items-center gap-1.5 transition-colors cursor-pointer ${
              bilingualActive
                ? 'border-[var(--marigold-accent)] bg-[var(--marigold-light)] text-[var(--marigold-accent)] font-semibold'
                : 'border-[var(--paper-border)] text-[var(--ink-muted)] bg-[var(--paper-card)]'
            }`}
            title="Show question in Hindi alongside English"
          >
            <Languages className="w-3.5 h-3.5" />
            <span>हिंदी में समझें (Bilingual)</span>
          </button>

          {/* Monospace Countdown Timer */}
          {timerMinutes > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xs bg-[var(--paper-card)] border border-[var(--paper-border)] font-mono-time text-xs font-bold text-[var(--ink-primary)]">
              <Clock className="w-3.5 h-3.5 text-[var(--marigold-accent)]" />
              <span>{formatTimer(secondsRemaining)}</span>
            </div>
          )}

          <Button
            variant="marigold"
            size="sm"
            onClick={handleSubmit}
            isLoading={isEvaluating}
            className="gap-1.5 font-semibold text-xs whitespace-nowrap"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Submit for Evaluation</span>
          </Button>
        </div>
      </div>

      {/* Ruled Notebook Answer Sheet */}
      <div className="space-y-6">
        {questions.map((q, idx) => (
          <div
            key={q.id}
            className="p-5 sm:p-6 rounded-sm border border-[var(--paper-border)] bg-[var(--paper-card)] shadow-[var(--paper-shadow-sm)] text-left space-y-4 notebook-margin-left pl-14 relative"
          >
            {/* Question Stamp */}
            <span
              aria-hidden="true"
              className="absolute left-6 top-6 text-xs font-mono-time text-[var(--brick-red)] font-bold select-none"
            >
              Q.{idx + 1}
            </span>

            {/* Question Header & Marks */}
            <div className="flex items-center justify-between gap-2 border-b border-[var(--paper-rule)] pb-2.5">
              <div className="flex items-center gap-2">
                <Tag variant="neutral" size="sm">
                  {q.type.toUpperCase()}
                </Tag>
                <span className="text-[10px] font-mono-time text-[var(--ink-muted)]">
                  CITED: {q.source_section} (P.{q.source_page})
                </span>
              </div>
              <span className="text-xs font-mono-time font-bold text-[var(--marigold-accent)]">
                [{q.marks} {q.marks === 1 ? 'Mark' : 'Marks'}]
              </span>
            </div>

            {/* Question Text in English */}
            <p className="font-serif-title text-base sm:text-lg font-bold text-[var(--ink-primary)] leading-snug">
              {q.question}
            </p>

            {/* Bilingual Hindi Translation Helper */}
            {bilingualActive && q.question_hi && (
              <div className="p-3 rounded-xs bg-[var(--paper-elevated)] border-l-2 border-[var(--marigold-accent)] text-xs text-[var(--ink-secondary)] leading-relaxed italic">
                <span className="font-bold text-[var(--marigold-accent)] not-italic block mb-0.5">
                  हिंदी में समझें:
                </span>
                {q.question_hi}
              </div>
            )}

            {/* Answer Input depending on type */}
            {q.type === 'mcq' && q.options ? (
              <div className="space-y-2 pt-1">
                {q.options.map((opt, optIdx) => {
                  const isSelected = submissions[q.id]?.optIndex === optIdx;
                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleSelectOption(q.id, optIdx, opt)}
                      className={`w-full p-3 rounded-sm border text-left flex items-center justify-between text-xs sm:text-sm cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[var(--marigold-accent)] bg-[var(--marigold-light)] font-semibold text-[var(--ink-primary)] shadow-[var(--paper-shadow-sm)]'
                          : 'border-[var(--paper-border)] bg-[var(--paper-card)] text-[var(--ink-secondary)] hover:bg-[var(--paper-elevated)]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-5 h-5 rounded-full border border-[var(--paper-border)] flex items-center justify-center text-[10px] font-mono-time font-bold">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span>{opt}</span>
                      </div>
                      {isSelected && (
                        <span className="text-xs font-mono-time text-[var(--marigold-accent)] font-bold">
                          Selected
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div>
                <label className="text-[10px] font-mono-time uppercase text-[var(--ink-muted)] block mb-1">
                  Your Answer (Exam Language):
                </label>
                <textarea
                  rows={q.type === 'long' ? 7 : 4}
                  value={submissions[q.id]?.text || ''}
                  onChange={(e) => handleTextChange(q.id, e.target.value)}
                  placeholder={
                    q.type === 'long'
                      ? 'State formula, write assumptions, show mathematical step-wise derivation...'
                      : 'Write clear, concise bullet points using standard syllabus keywords...'
                  }
                  className="w-full p-3 text-xs sm:text-sm bg-[var(--paper-elevated)] text-[var(--ink-primary)] border border-[var(--paper-border)] rounded-sm focus:outline-none focus:ring-1 focus:ring-[var(--marigold-accent)] leading-relaxed font-body"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bottom Final Submit Bar */}
      <div className="p-4 rounded-sm border border-[var(--paper-border)] bg-[var(--paper-card)] flex items-center justify-between shadow-[var(--paper-shadow-sm)]">
        <span className="text-xs font-mono-time text-[var(--ink-muted)]">
          Finished writing? Red ink will mark deductions step-by-step.
        </span>

        <Button
          variant="marigold"
          size="lg"
          onClick={handleSubmit}
          isLoading={isEvaluating}
          className="gap-2 font-semibold text-sm"
        >
          <Send className="w-4 h-4" />
          <span>Submit Test & Evaluate with Red Ink</span>
        </Button>
      </div>
    </div>
  );
};
