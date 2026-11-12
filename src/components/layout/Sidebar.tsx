import React from 'react';
import {
  LayoutDashboard,
  BookMarked,
  HelpCircle,
  Video,
  PenTool,
  Layers,
  CalendarDays,
  Users,
  Eye,
  ShieldAlert,
} from 'lucide-react';
import { AppRoute } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { Tag } from '../ui/Tag';

interface SidebarProps {
  currentRoute: AppRoute;
  onRouteChange: (route: AppRoute) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRoute,
  onRouteChange,
}) => {
  const { t } = useLanguage();
  const { user } = useAuth();

  const standardNavItems: { route: AppRoute; label: string; icon: React.ReactNode; indexNum: string }[] = [
    {
      route: 'dashboard',
      label: t.nav.dashboard,
      icon: <LayoutDashboard className="w-4 h-4" />,
      indexNum: '01',
    },
    {
      route: 'notes',
      label: t.nav.notes,
      icon: <BookMarked className="w-4 h-4" />,
      indexNum: '02',
    },
    {
      route: 'ask',
      label: t.nav.ask,
      icon: <HelpCircle className="w-4 h-4" />,
      indexNum: '03',
    },
    {
      route: 'lectures',
      label: t.nav.lectures,
      icon: <Video className="w-4 h-4" />,
      indexNum: '04',
    },
    {
      route: 'practice',
      label: t.nav.practice,
      icon: <PenTool className="w-4 h-4" />,
      indexNum: '05',
    },
    {
      route: 'flashcards',
      label: t.nav.flashcards,
      icon: <Layers className="w-4 h-4" />,
      indexNum: '06',
    },
    {
      route: 'planner',
      label: t.nav.planner,
      icon: <CalendarDays className="w-4 h-4" />,
      indexNum: '07',
    },
  ];

  return (
    <aside
      aria-label="Notebook Sections"
      className="hidden md:flex flex-col w-60 border-r border-[var(--paper-border)] bg-[var(--paper-bg)] p-4 shrink-0 min-h-[calc(100vh-3.5rem)] text-left select-none"
    >
      <div className="mb-4 px-2">
        <span className="text-[10px] font-mono-time tracking-wider uppercase text-[var(--ink-muted)] block">
          Table of Contents
        </span>
        <div className="w-full h-px bg-[var(--paper-rule)] mt-1.5" />
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        {standardNavItems.map((item) => {
          const isActive = currentRoute === item.route;
          return (
            <button
              key={item.route}
              onClick={() => onRouteChange(item.route)}
              className={`flex items-center justify-between px-3 py-2.5 rounded-sm text-sm transition-colors cursor-pointer group ${
                isActive
                  ? 'bg-[var(--paper-card)] text-[var(--ink-primary)] font-semibold border-l-3 border-[var(--marigold-accent)] shadow-[var(--paper-shadow-sm)]'
                  : 'text-[var(--ink-secondary)] hover:bg-[var(--paper-elevated)] hover:text-[var(--ink-primary)]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? 'text-[var(--marigold-accent)]' : 'text-[var(--ink-muted)]'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
              <span className="text-[10px] font-mono-time text-[var(--ink-muted)] group-hover:text-[var(--ink-secondary)]">
                {item.indexNum}
              </span>
            </button>
          );
        })}

        {/* Role-Protected Section Desks */}
        <div className="mt-4 pt-3 border-t border-[var(--paper-rule)] px-2">
          <span className="text-[10px] font-mono-time tracking-wider uppercase text-[var(--marigold-accent)] font-semibold block mb-2">
            Role Desks
          </span>

          <div className="space-y-1">
            <button
              type="button"
              onClick={() => onRouteChange('teacher-desk')}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-sm text-xs transition-colors cursor-pointer ${
                currentRoute === 'teacher-desk'
                  ? 'bg-[var(--marigold-light)] text-[var(--marigold-accent)] font-semibold border border-[var(--marigold-border)]'
                  : 'text-[var(--ink-secondary)] hover:bg-[var(--paper-elevated)]'
              }`}
            >
              <div className="flex items-center gap-2">
                <Users className="w-3.5 h-3.5" />
                <span>{t.nav.teacherDesk}</span>
              </div>
              <Tag variant="neutral" size="sm">FACULTY</Tag>
            </button>

            <button
              type="button"
              onClick={() => onRouteChange('parent-desk')}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-sm text-xs transition-colors cursor-pointer ${
                currentRoute === 'parent-desk'
                  ? 'bg-[var(--paper-elevated)] text-[var(--ink-primary)] font-semibold border border-[var(--paper-border)]'
                  : 'text-[var(--ink-secondary)] hover:bg-[var(--paper-elevated)]'
              }`}
            >
              <div className="flex items-center gap-2">
                <Eye className="w-3.5 h-3.5" />
                <span>{t.nav.parentDesk}</span>
              </div>
              <Tag variant="neutral" size="sm">PARENT</Tag>
            </button>

            <button
              type="button"
              onClick={() => onRouteChange('admin-desk')}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-sm text-xs transition-colors cursor-pointer ${
                currentRoute === 'admin-desk'
                  ? 'bg-[var(--brick-red-light)] text-[var(--brick-red)] font-semibold border border-[var(--brick-red-border)]'
                  : 'text-[var(--ink-secondary)] hover:bg-[var(--paper-elevated)]'
              }`}
            >
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>{t.nav.adminDesk}</span>
              </div>
              <Tag variant="neutral" size="sm">ADMIN</Tag>
            </button>
          </div>
        </div>
      </nav>

      {/* User profile footer */}
      <div className="mt-auto p-3 rounded-sm border border-[var(--paper-border)] bg-[var(--paper-card)] text-left">
        <span className="text-[10px] font-mono-time uppercase text-[var(--marigold-accent)] font-semibold block">
          Current Role
        </span>
        <p className="text-xs font-semibold text-[var(--ink-primary)] mt-0.5 truncate">
          {user?.name || 'Guest Student'}
        </p>
        <span className="text-[10px] text-[var(--ink-muted)] block capitalize">
          {user?.role} • {user?.exam}
        </span>
      </div>
    </aside>
  );
};
