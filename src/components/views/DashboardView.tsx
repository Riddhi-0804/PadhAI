import React from 'react';
import { LayoutDashboard, BookMarked, Sparkles, Clock, CheckCircle } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { EmptyState } from '../ui/EmptyState';
import { Tag } from '../ui/Tag';
import { Card } from '../ui/Card';
import { AppRoute } from '../../types';

interface DashboardViewProps {
  onNavigate: (route: AppRoute) => void;
  onTriggerToast: (title: string, desc?: string, type?: 'info' | 'success' | 'correction') => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onTriggerToast,
}) => {
  const { t, language } = useLanguage();

  return (
    <div className="w-full text-left space-y-6">
      {/* Student Profile & Desk Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-sm border border-[var(--paper-border)] bg-[var(--paper-card)]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono-time text-[var(--marigold-accent)] font-semibold">
              DESK // ARJUN VERMA
            </span>
            <Tag variant="neutral" size="sm">CBSE 2025</Tag>
          </div>
          <h2 className="font-serif-title text-2xl font-bold text-[var(--ink-primary)]">
            {language === 'hi' ? 'नमस्ते अर्जुन, आज का अध्ययन सत्र' : 'Welcome Arjun, Today’s Study Session'}
          </h2>
          <p className="text-xs text-[var(--ink-muted)] mt-0.5">
            Target: Physics (Ray Optics) & Chemistry (Coordination Compounds)
          </p>
        </div>

        {/* Quick Streak / Timetable badge */}
        <div className="flex items-center gap-3">
          <div className="px-3 py-2 rounded-sm border border-[var(--paper-border)] bg-[var(--paper-elevated)] text-center">
            <span className="text-[10px] font-mono-time uppercase text-[var(--ink-muted)] block">
              Streak
            </span>
            <span className="text-base font-bold font-mono-time text-[var(--ink-primary)]">
              4 Days
            </span>
          </div>
          <div className="px-3 py-2 rounded-sm border border-[var(--marigold-border)] bg-[var(--marigold-light)] text-center">
            <span className="text-[10px] font-mono-time uppercase text-[var(--marigold-accent)] block font-semibold">
              Term Exam
            </span>
            <span className="text-base font-bold font-mono-time text-[var(--marigold-accent)]">
              18 Days Left
            </span>
          </div>
        </div>
      </div>

      {/* Designed Empty State for Day's Agenda */}
      <EmptyState
        categoryTag="DESK STATUS"
        icon={<LayoutDashboard className="w-6 h-6" />}
        title={t.emptyStates.dashboard.title}
        description={t.emptyStates.dashboard.description}
        actionLabel={t.emptyStates.dashboard.action}
        onAction={() => onNavigate('notes')}
        secondaryActionLabel={t.nav.ask}
        onSecondaryAction={() => onNavigate('ask')}
      />

      {/* Recommended Chapters from Syllabus */}
      <div className="pt-4 border-t border-[var(--paper-rule)]">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-mono-time uppercase tracking-wider text-[var(--ink-muted)]">
            Indexed Syllabus Modules
          </span>
          <span className="text-xs font-mono-time text-[var(--marigold-accent)] cursor-pointer" onClick={() => onNavigate('notes')}>
            View all →
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              sub: 'Physics',
              ch: 'Ch 09: Ray Optics and Optical Instruments',
              pages: '18 pages noted',
              status: 'Ready for pause-doubt',
            },
            {
              sub: 'Accountancy',
              ch: 'Ch 03: Admission of a Partner',
              pages: '12 pages noted',
              status: 'Formulas indexed',
            },
            {
              sub: 'Economics',
              ch: 'Ch 04: Determination of Income and Employment',
              pages: '14 pages noted',
              status: 'NCERT aligned',
            },
          ].map((item, i) => (
            <div
              key={i}
              onClick={() => onTriggerToast(`Opened ${item.ch}`, 'Note module ready for revision.', 'info')}
              className="p-3.5 rounded-sm border border-[var(--paper-border)] bg-[var(--paper-card)] hover:border-[var(--marigold-accent)] transition-colors cursor-pointer text-left"
            >
              <div className="flex items-center justify-between text-[11px] font-mono-time mb-1">
                <span className="text-[var(--marigold-accent)] font-semibold">{item.sub}</span>
                <span className="text-[var(--ink-muted)]">{item.pages}</span>
              </div>
              <h4 className="font-serif-title text-sm font-semibold text-[var(--ink-primary)] leading-snug mb-1">
                {item.ch}
              </h4>
              <span className="text-[10px] text-[var(--ink-muted)] font-mono-time block">
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
