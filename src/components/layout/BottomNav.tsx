import React from 'react';
import {
  LayoutDashboard,
  BookMarked,
  HelpCircle,
  Video,
  PenTool,
  CalendarDays,
} from 'lucide-react';
import { AppRoute } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';

interface BottomNavProps {
  currentRoute: AppRoute;
  onRouteChange: (route: AppRoute) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentRoute,
  onRouteChange,
}) => {
  const { t } = useLanguage();

  const primaryItems: { route: AppRoute; label: string; icon: React.ReactNode }[] = [
    { route: 'dashboard', label: t.nav.dashboard, icon: <LayoutDashboard className="w-4 h-4" /> },
    { route: 'notes', label: t.nav.notes, icon: <BookMarked className="w-4 h-4" /> },
    { route: 'ask', label: t.nav.ask, icon: <HelpCircle className="w-4 h-4" /> },
    { route: 'lectures', label: t.nav.lectures, icon: <Video className="w-4 h-4" /> },
    { route: 'practice', label: t.nav.practice, icon: <PenTool className="w-4 h-4" /> },
    { route: 'planner', label: t.nav.planner, icon: <CalendarDays className="w-4 h-4" /> },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--paper-bg)] border-t border-[var(--paper-border)] px-2 py-1.5 flex items-center justify-around"
    >
      {primaryItems.map((item) => {
        const isActive = currentRoute === item.route;
        return (
          <button
            key={item.route}
            onClick={() => onRouteChange(item.route)}
            className={`flex flex-col items-center justify-center p-1.5 min-w-[50px] rounded-[2px] transition-colors cursor-pointer ${
              isActive
                ? 'text-[var(--marigold-accent)] font-semibold'
                : 'text-[var(--ink-muted)] hover:text-[var(--ink-primary)]'
            }`}
          >
            {item.icon}
            <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
