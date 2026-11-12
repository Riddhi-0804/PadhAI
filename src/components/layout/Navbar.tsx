import React from 'react';
import { Moon, Sun, ArrowLeft, Bookmark, UserCircle, LogOut, Zap } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useBandwidth } from '../../context/BandwidthContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { PWAInstallButton } from '../ui/PWAInstallButton';
import { AppRoute, Theme } from '../../types';
import { Tag } from '../ui/Tag';

interface NavbarProps {
  currentRoute: AppRoute;
  onRouteChange: (route: AppRoute) => void;
  theme: Theme;
  onThemeToggle: () => void;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRoute,
  onRouteChange,
  theme,
  onThemeToggle,
  onOpenAuth,
}) => {
  const { t, language } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();
  const { isLowBandwidth, toggleLowBandwidth } = useBandwidth();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--paper-border)] bg-[var(--paper-bg)]/90 backdrop-blur-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onRouteChange('landing')}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xs bg-[var(--ink-primary)] text-[var(--paper-bg)] flex items-center justify-center font-serif-title font-bold text-lg border border-[var(--ink-primary)] shadow-[var(--paper-shadow-sm)]">
              {language === 'hi' ? 'प' : 'P'}
            </div>
            <div>
              <span className="font-serif-title text-lg font-bold tracking-tight text-[var(--ink-primary)] block leading-none">
                {t.app.name}
              </span>
              <span className="text-[10px] font-mono-time text-[var(--ink-muted)] block mt-0.5">
                CBSE // JEE // NEET
              </span>
            </div>
          </button>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* User profile & Role switcher */}
          {isAuthenticated && user ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onOpenAuth}
                className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-sm border border-[var(--paper-border)] bg-[var(--paper-card)] text-left hover:border-[var(--marigold-accent)] transition-colors cursor-pointer"
                title="Click to switch persona or role"
              >
                <div className="w-5 h-5 rounded-xs bg-[var(--paper-elevated)] flex items-center justify-center text-[var(--ink-secondary)] text-[10px] font-mono-time font-bold">
                  {user.name.charAt(0)}
                </div>
                <div className="leading-tight">
                  <span className="text-xs font-semibold text-[var(--ink-primary)] block truncate max-w-[110px]">
                    {user.name}
                  </span>
                </div>
                <Tag
                  variant={
                    user.role === 'teacher'
                      ? 'marigold'
                      : user.role === 'admin'
                      ? 'brick'
                      : user.role === 'parent'
                      ? 'ink'
                      : 'neutral'
                  }
                  size="sm"
                >
                  {user.role}
                </Tag>
              </button>

              <button
                type="button"
                onClick={logout}
                className="p-1.5 rounded-sm border border-[var(--paper-border)] bg-[var(--paper-card)] text-[var(--ink-muted)] hover:text-[var(--brick-red)] cursor-pointer"
                title={t.auth.signOut}
                aria-label={t.auth.signOut}
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenAuth}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-sm border border-[var(--paper-border)] bg-[var(--paper-card)] text-[var(--ink-primary)] hover:border-[var(--marigold-accent)] cursor-pointer"
            >
              <UserCircle className="w-3.5 h-3.5 text-[var(--marigold-accent)]" />
              <span>{t.auth.signIn}</span>
            </button>
          )}

          {/* PWA In-App Install Button */}
          <PWAInstallButton />

          {/* Low Bandwidth 2G Mode Toggle */}
          <button
            type="button"
            onClick={toggleLowBandwidth}
            className={`p-1.5 rounded-sm border transition-colors cursor-pointer flex items-center gap-1 text-xs font-mono-time ${
              isLowBandwidth
                ? 'border-[var(--marigold-accent)] bg-[var(--marigold-light)] text-[var(--marigold-accent)] font-bold'
                : 'border-[var(--paper-border)] bg-[var(--paper-card)] text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]'
            }`}
            title={
              isLowBandwidth
                ? 'Low-Bandwidth (2G Text-First) Mode Active - Click to disable'
                : 'Enable Low-Bandwidth Mode (disables heavy embeds, text-first for 2G/3G connectivity)'
            }
          >
            <Zap className={`w-3.5 h-3.5 ${isLowBandwidth ? 'fill-current' : ''}`} />
            <span className="hidden lg:inline text-[10px]">
              {isLowBandwidth ? '2G Mode' : 'Low Data'}
            </span>
          </button>

          {/* Always-visible Language switcher */}
          <LanguageSwitcher />

          {/* Theme toggle */}
          <button
            type="button"
            onClick={onThemeToggle}
            className="p-1.5 rounded-sm border border-[var(--paper-border)] bg-[var(--paper-card)] text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] cursor-pointer"
            aria-label={theme === 'dark' ? t.app.lightMode : t.app.darkMode}
            title={theme === 'dark' ? t.app.lightMode : t.app.darkMode}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-[var(--marigold-accent)]" />
            ) : (
              <Moon className="w-4 h-4 text-[var(--ink-secondary)]" />
            )}
          </button>

          {/* Route toggle */}
          {currentRoute === 'landing' ? (
            <button
              onClick={() => onRouteChange('dashboard')}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-sm bg-[var(--marigold-accent)] text-white hover:bg-[var(--marigold-hover)] cursor-pointer transition-colors"
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>{t.app.openApp}</span>
            </button>
          ) : (
            <button
              onClick={() => onRouteChange('landing')}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-sm border border-[var(--paper-border)] bg-[var(--paper-card)] text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] cursor-pointer"
            >
              <ArrowLeft className="w-3 h-3" />
              <span className="hidden sm:inline">{t.app.backToHome}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
