import React, { useState, useEffect, useRef } from 'react';
import { LanguageProvider, useLanguage } from './i18n/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { setUnauthorizedHandler } from './services/api';
import { AppRoute, Theme, ToastMessage } from './types';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { BottomNav } from './components/layout/BottomNav';
import { Toast } from './components/ui/Toast';
import { AuthModal } from './components/auth/AuthModal';
import { OnboardingModal } from './components/auth/OnboardingModal';
import { RoleGate } from './components/auth/RoleGate';
import { BandwidthProvider } from './context/BandwidthContext';
import { OfflineIndicator } from './components/ui/OfflineIndicator';
import { LandingPage } from './components/landing/LandingPage';
import { DashboardView } from './components/views/DashboardView';
import { NotesView } from './components/views/NotesView';
import { AskView } from './components/views/AskView';
import { LecturesView } from './components/views/LecturesView';
import { PracticeView } from './components/views/PracticeView';
import { FlashcardsView } from './components/views/FlashcardsView';
import { PlannerView } from './components/views/PlannerView';
import { TeacherDashboardView } from './components/views/TeacherDashboardView';
import { ParentDashboardView } from './components/views/ParentDashboardView';
import { AdminDashboardView } from './components/views/AdminDashboardView';

const PadhAIContent: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>('landing');
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('padhai_theme') as Theme;
    return saved === 'dark' || saved === 'light' ? saved : 'light';
  });
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);

  const { showOnboarding, setShowOnboarding, isAuthenticated, logout } = useAuth();

  // Any 401 from the API clears the session; the effect below returns to sign-in.
  useEffect(() => {
    setUnauthorizedHandler(logout);
    return () => setUnauthorizedHandler(null);
  }, [logout]);

  const wasAuthenticated = useRef(isAuthenticated);
  useEffect(() => {
    if (wasAuthenticated.current && !isAuthenticated) {
      setCurrentRoute('landing');
      setIsAuthOpen(true);
    }
    wasAuthenticated.current = isAuthenticated;
  }, [isAuthenticated]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('padhai_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const showToast = (
    title: string,
    description?: string,
    type: 'info' | 'success' | 'correction' = 'info'
  ) => {
    setToast({
      id: String(Date.now()),
      title,
      description,
      type,
    });
  };

  const renderActiveRoute = () => {
    switch (currentRoute) {
      case 'landing':
        return (
          <LandingPage
            onStart={(route) => {
              if (!isAuthenticated) {
                setIsAuthOpen(true);
              } else {
                setCurrentRoute(route);
              }
            }}
          />
        );
      case 'dashboard':
        return <DashboardView onNavigate={setCurrentRoute} onTriggerToast={showToast} />;
      case 'notes':
        return <NotesView onTriggerToast={showToast} />;
      case 'ask':
        return <AskView onTriggerToast={showToast} />;
      case 'lectures':
        return <LecturesView onTriggerToast={showToast} />;
      case 'practice':
        return <PracticeView onTriggerToast={showToast} />;
      case 'flashcards':
        return <FlashcardsView onTriggerToast={showToast} />;
      case 'planner':
        return <PlannerView onTriggerToast={showToast} />;

      // Role-protected routes
      case 'teacher-desk':
        return (
          <RoleGate allowedRoles={['teacher', 'admin']} onOpenAuth={() => setIsAuthOpen(true)}>
            <TeacherDashboardView />
          </RoleGate>
        );
      case 'parent-desk':
        return (
          <RoleGate allowedRoles={['parent', 'admin']} onOpenAuth={() => setIsAuthOpen(true)}>
            <ParentDashboardView />
          </RoleGate>
        );
      case 'admin-desk':
        return (
          <RoleGate allowedRoles={['admin']} onOpenAuth={() => setIsAuthOpen(true)}>
            <AdminDashboardView />
          </RoleGate>
        );

      default:
        return <DashboardView onNavigate={setCurrentRoute} onTriggerToast={showToast} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--paper-bg)] text-[var(--ink-primary)] transition-colors">
      {/* Top Navbar with profile, language switcher & theme toggle */}
      <Navbar
        currentRoute={currentRoute}
        onRouteChange={setCurrentRoute}
        theme={theme}
        onThemeToggle={toggleTheme}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Main Container */}
      <div className="flex-1 flex w-full">
        {/* Render Sidebar inside the App Shell */}
        {currentRoute !== 'landing' && (
          <Sidebar currentRoute={currentRoute} onRouteChange={setCurrentRoute} />
        )}

        {/* Viewport Content */}
        <main
          className={`flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto ${
            currentRoute !== 'landing' ? 'pb-20 md:pb-8' : ''
          }`}
        >
          <div className="max-w-5xl mx-auto">{renderActiveRoute()}</div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      {currentRoute !== 'landing' && (
        <BottomNav currentRoute={currentRoute} onRouteChange={setCurrentRoute} />
      )}

      {/* Auth & Persona Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccessToast={(msg) => showToast(msg, undefined, 'success')}
        onAuthenticated={() => setCurrentRoute('dashboard')}
      />

      {/* Onboarding Wizard Modal */}
      <OnboardingModal
        isOpen={showOnboarding}
        onSuccess={(msg) => showToast(msg, undefined, 'success')}
      />

      {/* Offline Connectivity & Low-Bandwidth Indicator */}
      <OfflineIndicator />

      {/* Paper Note Toast Feedback */}
      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BandwidthProvider>
          <PadhAIContent />
        </BandwidthProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
