import React from 'react';
import {
  TrendingUp,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  RotateCcw,
  BookOpen,
  ArrowRight,
} from 'lucide-react';
import { TopicStat } from '../../types/practice';
import { Tag } from '../ui/Tag';
import { Button } from '../ui/Button';

interface WeakTopicDashboardProps {
  stats: TopicStat[];
  onLaunchRevise: (topic: TopicStat) => void;
  onOpenTestGenerator: () => void;
}

export const WeakTopicDashboard: React.FC<WeakTopicDashboardProps> = ({
  stats,
  onLaunchRevise,
  onOpenTestGenerator,
}) => {
  const weakTopics = stats.filter((s) => s.accuracy < 0.75);
  const avgAccuracy = stats.length
    ? Math.round((stats.reduce((acc, s) => acc + s.accuracy, 0) / stats.length) * 100)
    : 75;

  return (
    <div className="w-full flex flex-col gap-4 text-left">
      {/* Overview Metric Banner */}
      <div className="p-5 rounded-sm border border-[var(--paper-border)] bg-[var(--paper-card)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[var(--paper-shadow-sm)]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Tag variant="marigold">SYLLABUS MASTERY RADAR</Tag>
            <span className="text-xs font-mono-time text-[var(--ink-muted)]">
              TRACKED ACROSS {stats.length} TOPICS
            </span>
          </div>
          <h3 className="font-serif-title text-xl font-bold text-[var(--ink-primary)]">
            Weak-Topic Calibration & Retention
          </h3>
          <p className="text-xs text-[var(--ink-muted)] mt-0.5">
            Test generator automatically adapts difficulty and creates targeted drills for topics below 75%.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-sm border border-[var(--paper-border)] bg-[var(--paper-elevated)] text-center min-w-[90px]">
            <span className="text-[10px] font-mono-time uppercase text-[var(--ink-muted)] block">
              Average Accuracy
            </span>
            <span className="text-xl font-bold font-mono-time text-[var(--ink-primary)]">
              {avgAccuracy}%
            </span>
          </div>

          <div className="p-3 rounded-sm border border-[var(--brick-red-border)] bg-[var(--brick-red-light)] text-center min-w-[90px]">
            <span className="text-[10px] font-mono-time uppercase text-[var(--brick-red)] block font-semibold">
              Needs Revision
            </span>
            <span className="text-xl font-bold font-mono-time text-[var(--brick-red)]">
              {weakTopics.length} Topics
            </span>
          </div>
        </div>
      </div>

      {/* Auto 'Revise These' Callout Box */}
      {weakTopics.length > 0 && (
        <div className="p-4 rounded-sm border-2 border-[var(--marigold-border)] bg-[var(--marigold-light)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-[var(--paper-shadow-sm)]">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-[var(--marigold-accent)] shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-mono-time uppercase text-[var(--marigold-accent)] font-bold block">
                Auto "Revise These" Priority Set
              </span>
              <p className="text-xs text-[var(--ink-primary)] font-medium mt-0.5">
                Your accuracy dropped on <strong>{weakTopics[0].topic}</strong> ({Math.round(weakTopics[0].accuracy * 100)}%). Practice a focused 3-question adaptive set.
              </p>
            </div>
          </div>

          <Button
            variant="marigold"
            size="sm"
            onClick={() => onLaunchRevise(weakTopics[0])}
            className="gap-1.5 font-semibold text-xs whitespace-nowrap self-start sm:self-auto"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Launch Adaptive Drill</span>
          </Button>
        </div>
      )}

      {/* Topic Accuracy Cards Grid */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono-time uppercase tracking-wider text-[var(--ink-muted)]">
            Topic Breakdown & Recent Performance
          </span>
          <span className="text-[10px] font-mono-time text-[var(--marigold-accent)]">
            ADAPTIVE WEIGHTING ACTIVE
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {stats.map((item) => {
            const pct = Math.round(item.accuracy * 100);
            const isWeak = item.accuracy < 0.75;
            return (
              <div
                key={item.id}
                className="p-3.5 rounded-sm border border-[var(--paper-border)] bg-[var(--paper-card)] hover:border-[var(--marigold-accent)] transition-all flex flex-col justify-between text-left"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <Tag variant={isWeak ? 'brick' : 'neutral'} size="sm">
                      {item.subject}
                    </Tag>
                    <span
                      className={`text-xs font-mono-time font-bold ${
                        isWeak ? 'text-[var(--brick-red)]' : 'text-[var(--marigold-accent)]'
                      }`}
                    >
                      {pct}% Accuracy
                    </span>
                  </div>

                  <h4 className="font-serif-title text-sm font-semibold text-[var(--ink-primary)] line-clamp-1 mb-2">
                    {item.topic}
                  </h4>

                  {/* Progress Bar */}
                  <div className="w-full h-1.5 bg-[var(--paper-border)] rounded-xs overflow-hidden mb-2">
                    <div
                      className={`h-full rounded-xs transition-all ${
                        isWeak ? 'bg-[var(--brick-red)]' : 'bg-[var(--marigold-accent)]'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[var(--paper-rule)] text-[10px] font-mono-time text-[var(--ink-muted)]">
                  <span>{item.attempts_count} Practice Attempts</span>
                  <button
                    type="button"
                    onClick={() => onLaunchRevise(item)}
                    className="text-[var(--marigold-accent)] hover:underline flex items-center gap-0.5 cursor-pointer font-semibold"
                  >
                    <span>Practice topic</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
