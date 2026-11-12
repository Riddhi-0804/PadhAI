import React, { useState, useEffect } from 'react';
import {
  CalendarDays,
  Flame,
  Award,
  RefreshCw,
  Layers,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { StudyPlanConfig } from '../../types/engagement';
import { plannerService } from '../../services/plannerService';
import { DayPlanTimeline } from '../planner/DayPlanTimeline';
import { StampBadgesSection } from '../engagement/StampBadgesSection';
import { Button } from '../ui/Button';

interface PlannerViewProps {
  onTriggerToast: (title: string, desc?: string, type?: 'info' | 'success' | 'correction') => void;
}

export const PlannerView: React.FC<PlannerViewProps> = ({ onTriggerToast }) => {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'timeline' | 'engagement'>('timeline');
  const [plan, setPlan] = useState<StudyPlanConfig>(plannerService.getStudyPlan());
  const [engagement, setEngagement] = useState(plannerService.getEngagement());
  const [isReplanning, setIsReplanning] = useState(false);

  const refreshData = () => {
    setPlan(plannerService.getStudyPlan());
    setEngagement(plannerService.getEngagement());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleToggleDay = (dayNumber: number) => {
    const updated = plannerService.toggleDayComplete(dayNumber);
    setPlan({ ...updated });
    setEngagement(plannerService.getEngagement());
    onTriggerToast(
      'Study Day Updated',
      `Day ${dayNumber} status updated (+40 XP awarded on completion)`,
      'success'
    );
  };

  const handleReplan = () => {
    setIsReplanning(true);
    setTimeout(() => {
      const { plan: updated, message } = plannerService.replanRemainingDays();
      setPlan({ ...updated });
      setEngagement(plannerService.getEngagement());
      setIsReplanning(false);
      onTriggerToast('Timetable Re-planned', message, 'info');
    }, 600);
  };

  return (
    <div className="w-full text-left space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--paper-border)] pb-4">
        <div>
          <span className="text-xs font-mono-time uppercase text-[var(--marigold-accent)] font-semibold">
            ADAPTIVE EXAM SCHEDULE & DISCIPLINE
          </span>
          <h2 className="font-serif-title text-2xl font-bold text-[var(--ink-primary)]">
            {t.nav.planner}
          </h2>
          <p className="text-xs text-[var(--ink-muted)] mt-0.5">
            Day-by-day exam syllabus checklist with smart backlog redistribution and ink stamp badges.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex rounded-sm border border-[var(--paper-border)] p-1 bg-[var(--paper-elevated)] text-xs font-mono-time">
          <button
            onClick={() => setActiveTab('timeline')}
            className={`py-1.5 px-3 rounded-[2px] transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'timeline'
                ? 'bg-[var(--ink-primary)] text-[var(--paper-bg)] font-semibold'
                : 'text-[var(--ink-muted)] hover:text-[var(--ink-primary)]'
            }`}
          >
            <CalendarDays className="w-3.5 h-3.5" />
            Day-by-Day Plan
          </button>
          <button
            onClick={() => setActiveTab('engagement')}
            className={`py-1.5 px-3 rounded-[2px] transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'engagement'
                ? 'bg-[var(--ink-primary)] text-[var(--paper-bg)] font-semibold'
                : 'text-[var(--ink-muted)] hover:text-[var(--ink-primary)]'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            Badges & Leaderboard
          </button>
        </div>
      </div>

      {/* Target Exam Banner */}
      <div className="p-4 sm:p-5 rounded-sm border border-[var(--paper-border)] bg-[var(--paper-card)] flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono-time text-[var(--marigold-accent)] uppercase font-bold tracking-wider">
              PRIMARY TARGET
            </span>
            <span className="text-[10px] font-mono-time text-[var(--ink-muted)]">•</span>
            <span className="text-[10px] font-mono-time text-[var(--ink-muted)]">
              Daily Target: {plan.daily_goal_minutes} mins
            </span>
          </div>
          <h4 className="font-serif-title text-lg sm:text-xl font-bold text-[var(--ink-primary)]">
            {plan.target_exam} • Physics & Mathematics
          </h4>
          <span className="text-xs font-mono-time text-[var(--ink-muted)] block">
            Exam Date: March 04, 2025 • 10:30 AM IST
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs font-mono-time px-3 py-1.5 rounded-[2px] bg-[var(--marigold-light)] text-[var(--marigold-accent)] border border-[var(--marigold-border)] font-bold text-sm block">
              {language === 'hi' ? `${plan.days_remaining} दिन शेष` : `${plan.days_remaining} Days to Go`}
            </span>
            <span className="text-[10px] font-mono-time text-[var(--ink-muted)] mt-1 block">
              Streak: {engagement.streak} days 🔥
            </span>
          </div>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'timeline' ? (
        <DayPlanTimeline
          plan={plan}
          onToggleDay={handleToggleDay}
          onReplan={handleReplan}
          isReplanning={isReplanning}
        />
      ) : (
        <StampBadgesSection
          badges={engagement.badges}
          leaderboard={engagement.leaderboard}
          currentStreak={engagement.streak}
          totalXP={engagement.xp}
        />
      )}
    </div>
  );
};
