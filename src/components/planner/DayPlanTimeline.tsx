import React from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  BookOpen,
  ArrowRight,
  Flame,
} from 'lucide-react';
import { StudyPlanConfig, DayScheduleItem } from '../../types/engagement';
import { Button } from '../ui/Button';
import { Tag } from '../ui/Tag';

interface DayPlanTimelineProps {
  plan: StudyPlanConfig;
  onToggleDay: (dayNumber: number) => void;
  onReplan: () => void;
  isReplanning?: boolean;
}

export const DayPlanTimeline: React.FC<DayPlanTimelineProps> = ({
  plan,
  onToggleDay,
  onReplan,
  isReplanning = false,
}) => {
  const hasMissedDays = plan.schedule.some((d) => d.is_missed);
  const completedCount = plan.schedule.filter((d) => d.is_completed).length;

  return (
    <div className="space-y-6 text-left">
      {/* Header with Re-plan Callout if days are missed */}
      {hasMissedDays && (
        <div className="p-4 sm:p-5 rounded-sm bg-[var(--brick-red-light)] border border-[var(--brick-red-border)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[var(--brick-red)] shrink-0 mt-0.5" />
            <div>
              <h4 className="font-serif-title text-sm sm:text-base font-bold text-[var(--brick-red)]">
                Missed Study Target Detected
              </h4>
              <p className="text-xs text-[var(--ink-primary)] mt-0.5 leading-relaxed">
                Day 2 (Wave Optics) was missed. Rather than piling up stressful weekend backlogs,
                PadhAI can recalculate and spread these topics evenly into your remaining days (+15 mins/day).
              </p>
            </div>
          </div>

          <Button
            variant="brick"
            size="sm"
            onClick={onReplan}
            disabled={isReplanning}
            className="shrink-0 cursor-pointer shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isReplanning ? 'animate-spin' : ''}`} />
            {isReplanning ? 'Recalculating...' : 'Re-plan Remaining Days'}
          </Button>
        </div>
      )}

      {/* Timeline Controls & Progress Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-sm border border-[var(--paper-border)] bg-[var(--paper-card)]">
        <div>
          <span className="text-[10px] font-mono-time uppercase text-[var(--ink-muted)]">
            SYLLABUS COVERAGE PROGRESS
          </span>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="font-serif-title text-lg font-bold text-[var(--ink-primary)]">
              {completedCount} of {plan.schedule.length} Days Completed
            </span>
            <span className="text-xs font-mono-time text-[var(--marigold-accent)] font-semibold">
              ({Math.round((completedCount / plan.schedule.length) * 100)}%)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!hasMissedDays && (
            <Button
              variant="outline"
              size="sm"
              onClick={onReplan}
              disabled={isReplanning}
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1.5 text-[var(--marigold-accent)]" />
              Adjust Remaining Timetable
            </Button>
          )}
        </div>
      </div>

      {/* Day by Day Schedule Items */}
      <div className="space-y-3">
        {plan.schedule.map((item) => (
          <div
            key={item.day_number}
            className={`p-4 sm:p-5 rounded-sm border transition-all text-left ${
              item.is_missed
                ? 'bg-[var(--brick-red-light)]/40 border-[var(--brick-red-border)]'
                : item.is_completed
                ? 'bg-[var(--paper-card)] border-[var(--paper-border)] opacity-80'
                : 'bg-[var(--paper-card)] border-[var(--paper-border)] hover:border-[var(--ink-primary)]'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono-time font-bold px-2 py-0.5 rounded-[2px] bg-[var(--paper-elevated)] border border-[var(--paper-border)] text-[var(--ink-primary)]">
                    Day {item.day_number} • {item.date_formatted}
                  </span>

                  <Tag
                    variant={
                      item.subject.includes('Physics')
                        ? 'marigold'
                        : item.subject.includes('Chemistry')
                        ? 'neutral'
                        : 'brick'
                    }
                    size="sm"
                  >
                    {item.subject}
                  </Tag>

                  {item.is_missed && (
                    <span className="text-[10px] font-mono-time uppercase text-[var(--brick-red)] font-bold px-1.5 py-0.5 rounded-xs bg-[var(--brick-red-light)] border border-[var(--brick-red-border)]">
                      Missed Target
                    </span>
                  )}

                  {item.is_completed && (
                    <span className="text-[10px] font-mono-time text-[var(--marigold-accent)] font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Completed
                    </span>
                  )}
                </div>

                <h4 className="font-serif-title text-base font-bold text-[var(--ink-primary)]">
                  {item.chapter}
                </h4>

                {/* Target Topics */}
                <div className="space-y-1 pt-1">
                  {item.target_topics.map((t, idx) => (
                    <div
                      key={idx}
                      className={`text-xs flex items-center gap-2 font-body ${
                        t.includes('Catch-up') || t.includes('Re-planned')
                          ? 'text-[var(--marigold-accent)] font-medium'
                          : 'text-[var(--ink-primary)]'
                      }`}
                    >
                      <span className="text-[var(--ink-muted)] font-mono-time">↳</span>
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action & Stats on Right */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[var(--paper-rule)]">
                <div className="flex items-center gap-3 text-xs font-mono-time text-[var(--ink-muted)]">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[var(--marigold-accent)]" />
                    {item.daily_minutes} min
                  </span>
                  <span>•</span>
                  <span>{item.numerical_count} numericals</span>
                </div>

                <button
                  type="button"
                  onClick={() => onToggleDay(item.day_number)}
                  className={`text-xs font-mono-time px-3 py-1.5 rounded-[2px] border transition-colors cursor-pointer flex items-center gap-1.5 ${
                    item.is_completed
                      ? 'bg-[var(--marigold-light)] border-[var(--marigold-border)] text-[var(--marigold-accent)] font-semibold'
                      : 'bg-[var(--paper-elevated)] border-[var(--paper-border)] text-[var(--ink-primary)] hover:border-[var(--ink-primary)]'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {item.is_completed ? 'Done (Re-open)' : 'Mark Finished'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
