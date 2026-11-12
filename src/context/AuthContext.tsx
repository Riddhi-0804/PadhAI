import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, OnboardingData, SeedCredential, SEED_CREDENTIALS } from '../types/auth';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  showOnboarding: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  loginWithSeed: (credential: SeedCredential) => void;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  completeOnboarding: (data: OnboardingData) => Promise<void>;
  hasRole: (roles: UserRole[]) => boolean;
  setShowOnboarding: (show: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to Arjun Sharma (Student) on initial load for instant review, while allowing full login/switch
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('padhai_auth_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    // Default initial session: Student Arjun Sharma
    const defaultStudent = SEED_CREDENTIALS[2];
    return {
      id: 'usr_student_01',
      name: defaultStudent.name,
      email: defaultStudent.email,
      role: defaultStudent.role,
      language: defaultStudent.language,
      level: defaultStudent.level,
      exam: defaultStudent.exam,
      subjects: defaultStudent.subjects,
      onboarding_completed: true,
    };
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('padhai_auth_token') || 'seed_session_token_arjun';
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('padhai_auth_user', JSON.stringify(user));
      // If student hasn't finished onboarding, trigger onboarding modal
      if (!user.onboarding_completed && user.role === 'student') {
        setShowOnboarding(true);
      }
    } else {
      localStorage.removeItem('padhai_auth_user');
      localStorage.removeItem('padhai_auth_token');
    }
  }, [user]);

  const loginWithSeed = (credential: SeedCredential) => {
    const seedUser: User = {
      id: `usr_${credential.role}_${credential.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
      name: credential.name,
      email: credential.email,
      role: credential.role,
      language: credential.language,
      level: credential.level,
      exam: credential.exam,
      subjects: credential.subjects,
      onboarding_completed: true,
    };
    setUser(seedUser);
    const mockToken = `seed_jwt_${credential.role}_${Date.now()}`;
    setToken(mockToken);
    localStorage.setItem('padhai_auth_token', mockToken);
  };

  const login = async (email: string, password: string = 'Password@123'): Promise<boolean> => {
    setIsLoading(true);
    try {
      // 1. Try local seed credentials first for instant response
      const matchedSeed = SEED_CREDENTIALS.find(
        (s) => s.email.toLowerCase() === email.trim().toLowerCase()
      );
      if (matchedSeed) {
        loginWithSeed(matchedSeed);
        setIsLoading(false);
        return true;
      }

      // 2. Fallback to API if user registered dynamically
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('padhai_auth_token', data.token);
        setIsLoading(false);
        return true;
      }

      // If neither matched
      setIsLoading(false);
      return false;
    } catch {
      // Offline fallback: create guest session
      setIsLoading(false);
      return false;
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role: UserRole
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      const newUser: User = {
        id: `usr_${Date.now()}`,
        name,
        email: email.trim().toLowerCase(),
        role,
        language: 'en',
        level: 'intermediate',
        exam: 'CBSE 12th',
        subjects: 'Physics,Chemistry,Mathematics',
        onboarding_completed: false,
      };

      setUser(newUser);
      const generatedToken = `jwt_${Date.now()}`;
      setToken(generatedToken);
      localStorage.setItem('padhai_auth_token', generatedToken);

      if (role === 'student') {
        setShowOnboarding(true);
      }

      setIsLoading(false);
      return true;
    } catch {
      setIsLoading(false);
      return false;
    }
  };

  const completeOnboarding = async (data: OnboardingData): Promise<void> => {
    if (!user) return;
    const updated: User = {
      ...user,
      language: data.language,
      exam: data.exam,
      subjects: data.subjects.join(', '),
      level: data.level,
      onboarding_completed: true,
    };
    setUser(updated);
    setShowOnboarding(false);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('padhai_auth_user');
    localStorage.removeItem('padhai_auth_token');
  };

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
        loginWithSeed,
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
