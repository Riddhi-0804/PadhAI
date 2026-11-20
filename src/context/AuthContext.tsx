import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, UserRole, OnboardingData } from '../types/auth';
import { apiFetch, getStoredToken, TOKEN_STORAGE_KEY } from '../services/api';

const USER_STORAGE_KEY = 'padhai_auth_user';

/** User object returned by the API, normalised for the UI (name never empty). */
function normalizeUser(raw: any): User {
  const email = String(raw?.email ?? '').trim();
  const emailPrefix = email.includes('@') ? email.split('@')[0] : email;
  return {
    ...raw,
    name: String(raw?.name ?? '').trim() || emailPrefix,
    language: raw?.language === 'hi' ? 'hi' : 'en',
    onboarding_completed: Boolean(raw?.onboarding_completed),
  } as User;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  showOnboarding: boolean;
  /** Resolves to null on success, or an error code for the sign-in form. */
  login: (email: string, password: string) => Promise<string | null>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<string | null>;
  logout: () => void;
  completeOnboarding: (data: OnboardingData) => Promise<void>;
  hasRole: (roles: UserRole[]) => boolean;
  setShowOnboarding: (show: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => getStoredToken());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);

  const clearSession = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }, []);

  const applySession = useCallback((nextToken: string, rawUser: unknown) => {
    const nextUser = normalizeUser(rawUser);
    if (nextToken) {
      localStorage.setItem(TOKEN_STORAGE_KEY, nextToken);
      setToken(nextToken);
    }
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
  }, []);

  // The token is only trusted after GET /api/auth/me confirms who it belongs to.
  useEffect(() => {
    const storedToken = getStoredToken();
    if (!storedToken) {
      clearSession();
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const res = await apiFetch('/api/auth/me');
        if (!res.ok) throw new Error('invalid_session');
        const data = await res.json();
        if (!cancelled) applySession(storedToken, data.user);
      } catch {
        if (!cancelled) clearSession();
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [applySession, clearSession]);

  useEffect(() => {
    // If student hasn't finished onboarding, trigger onboarding modal
    if (user && !user.onboarding_completed && user.role === 'student') {
      setShowOnboarding(true);
    }
  }, [user]);

  const login = async (email: string, password: string): Promise<string | null> => {
    setIsLoading(true);
    try {
      const res = await apiFetch(
        '/api/auth/login',
        {
          method: 'POST',
          body: JSON.stringify({ email: email.trim(), password }),
        },
        { skipAuthError: true }
      );

      if (res.ok) {
        const data = await res.json();
        applySession(data.token, data.user);
        return null;
      }
      if (res.status >= 500) return 'server';
      return 'invalid_credentials';
    } catch {
      return 'network';
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role: UserRole
  ): Promise<string | null> => {
    setIsLoading(true);
    try {
      const res = await apiFetch(
        '/api/auth/register',
        {
          method: 'POST',
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            password,
            role,
          }),
        },
        { skipAuthError: true }
      );

      if (res.ok) {
        const data = await res.json();
        applySession(data.token, data.user);
        return null;
      }
      if (res.status === 409) return 'email_taken';
      if (res.status === 422) return 'weak_password';
      if (res.status >= 500) return 'server';
      return 'register_failed';
    } catch {
      return 'network';
    } finally {
      setIsLoading(false);
    }
  };

  const completeOnboarding = async (data: OnboardingData): Promise<void> => {
    if (!user) return;
    const payload = {
      language: data.language,
      exam: data.exam,
      subjects: data.subjects.join(', '),
      level: data.level,
    };

    try {
      const res = await apiFetch('/api/auth/onboarding', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const body = await res.json();
        applySession(token || getStoredToken() || '', body.user);
        setShowOnboarding(false);
        return;
      }
    } catch {
      // Offline: keep the desk usable; the next /api/auth/me refresh reconciles it.
    }

    setUser((prev) =>
      prev ? normalizeUser({ ...prev, ...payload, onboarding_completed: true }) : prev
    );
    setShowOnboarding(false);
  };

  const logout = useCallback(() => {
    clearSession();
    setShowOnboarding(false);
  }, [clearSession]);

  const hasRole = (roles: UserRole[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        showOnboarding,
        login,
        register,
        logout,
        completeOnboarding,
        hasRole,
        setShowOnboarding,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
