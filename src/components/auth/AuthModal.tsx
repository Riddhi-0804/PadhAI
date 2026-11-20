import React, { useState } from 'react';
import { X, Lock, Mail, UserCheck, Shield, GraduationCap, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { UserRole, SEED_CREDENTIALS } from '../../types/auth';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Tag } from '../ui/Tag';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessToast: (msg: string) => void;
  onAuthenticated?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccessToast,
  onAuthenticated,
}) => {
  const { login, register, isLoading } = useAuth();
  const { t } = useLanguage();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [error, setError] = useState('');
  const [showDemo, setShowDemo] = useState(false);

  const describeAuthError = (code: string): string => {
    switch (code) {
      case 'invalid_credentials':
        return t.auth.invalidCreds;
      case 'email_taken':
        return 'This email is already registered. Sign in instead.';
      case 'weak_password':
        return 'Password is too weak. Use at least 8 characters with a letter and a number.';
      case 'network':
        return 'Cannot reach the server. Start the backend on port 8000 and try again.';
      case 'server':
        return 'The server could not complete the request. Please try again.';
      default:
        return 'Could not create the account. Please check your details and try again.';
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'signin') {
      const errorCode = await login(email, password);
      if (!errorCode) {
        onSuccessToast(t.auth.loginSuccess);
        onAuthenticated?.();
        onClose();
      } else {
        setError(describeAuthError(errorCode));
      }
    } else {
      if (!name.trim()) {
        setError('Please enter your full name');
        return;
      }
      if (password.length < 8) {
        setError('Password must be at least 8 characters long.');
        return;
      }
      const errorCode = await register(name, email, password, role);
      if (!errorCode) {
        onSuccessToast(t.auth.registeredSuccess);
        onAuthenticated?.();
        onClose();
      } else {
        setError(describeAuthError(errorCode));
      }
    }
  };

  // Demo personas still authenticate through the real API, so they get real tokens.
  const handleSeedSelect = async (cred: typeof SEED_CREDENTIALS[0]) => {
    setError('');
    const errorCode = await login(cred.email, 'Password@123');
    if (!errorCode) {
      onSuccessToast(`Signed in as ${cred.name}`);
      onAuthenticated?.();
      onClose();
    } else {
      setError(describeAuthError(errorCode));
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-in fade-in"
    >
      <div className="relative w-full max-w-xl bg-[var(--paper-card)] border border-[var(--paper-border)] shadow-[var(--paper-shadow-lift)] rounded-sm p-6 text-left max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[var(--ink-muted)] hover:text-[var(--ink-primary)] p-1 cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-4">
          <Tag variant="marigold" size="sm" className="mb-1">
            ACCESS DESK
          </Tag>
          <h2 className="font-serif-title text-2xl font-bold text-[var(--ink-primary)]">
            {mode === 'signin' ? t.auth.signIn : t.auth.signUp}
          </h2>
          <p className="text-xs text-[var(--ink-muted)] mt-0.5">
            Authenticate to sync your syllabus progress, annotations, and role-based permissions.
          </p>
        </div>

        {/* Tabs: Sign In vs Sign Up */}
        <div className="flex border-b border-[var(--paper-border)] mb-4 text-xs font-mono-time">
          <button
            type="button"
            onClick={() => { setMode('signin'); setError(''); }}
            className={`pb-2 px-3 border-b-2 cursor-pointer font-semibold ${
              mode === 'signin'
                ? 'border-[var(--marigold-accent)] text-[var(--ink-primary)]'
                : 'border-transparent text-[var(--ink-muted)]'
            }`}
          >
            {t.auth.signIn}
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setError(''); }}
            className={`pb-2 px-3 border-b-2 cursor-pointer font-semibold ${
              mode === 'signup'
                ? 'border-[var(--marigold-accent)] text-[var(--ink-primary)]'
                : 'border-transparent text-[var(--ink-muted)]'
            }`}
          >
            {t.auth.signUp}
          </button>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 mb-6">
          {mode === 'signup' && (
            <div>
              <Input
                label={t.auth.name}
                placeholder="e.g. Ananya Sen"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div>
            <Input
              type="email"
              label={t.auth.email}
              placeholder="e.g. student@padhai.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <Input
              type="password"
              label={t.auth.password}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {mode === 'signup' && (
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[var(--ink-secondary)] block mb-1">
                {t.auth.selectRole}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['student', 'teacher', 'parent', 'admin'] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`p-2 text-xs rounded-sm border text-left cursor-pointer transition-colors ${
                      role === r
                        ? 'border-[var(--marigold-accent)] bg-[var(--marigold-light)] text-[var(--marigold-accent)] font-semibold'
                        : 'border-[var(--paper-border)] bg-[var(--paper-card)] text-[var(--ink-secondary)]'
                    }`}
                  >
                    <span className="capitalize block">{r}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && (
            <p className="text-xs text-[var(--brick-red)] font-medium p-2 rounded-xs bg-[var(--brick-red-light)] border border-[var(--brick-red-border)]">
              {error}
            </p>
          )}

          <Button
            type="submit"
            variant="marigold"
            isLoading={isLoading}
            className="w-full py-2.5 font-semibold text-sm"
          >
            {mode === 'signin' ? t.auth.signIn : t.auth.signUp}
          </Button>
        </form>

        {/* Demo personas: development builds only, and still real API logins */}
        {import.meta.env.DEV && (
          <div className="pt-4 border-t border-[var(--paper-rule)]">
            {!showDemo ? (
              <button
                type="button"
                onClick={() => setShowDemo(true)}
                className="text-[11px] font-mono-time uppercase text-[var(--marigold-accent)] font-semibold cursor-pointer"
              >
                Try a demo account
              </button>
            ) : (
              <>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono-time uppercase text-[var(--marigold-accent)] font-semibold">
                    {t.auth.quickSwitchSeed}
                  </span>
                  <span className="text-[10px] font-mono-time text-[var(--ink-muted)]">
                    {t.auth.seedNotice}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {SEED_CREDENTIALS.map((cred) => (
                    <button
                      key={cred.email}
                      type="button"
                      disabled={isLoading}
                      onClick={() => handleSeedSelect(cred)}
                      className="p-2.5 rounded-sm border border-[var(--paper-border)] bg-[var(--paper-elevated)] hover:border-[var(--marigold-accent)] text-left transition-colors cursor-pointer group disabled:opacity-60"
                    >
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="text-xs font-semibold text-[var(--ink-primary)] truncate">
                          {cred.name}
                        </span>
                        <Tag
                          variant={
                            cred.role === 'teacher'
                              ? 'marigold'
                              : cred.role === 'admin'
                              ? 'brick'
                              : cred.role === 'parent'
                              ? 'ink'
                              : 'neutral'
                          }
                          size="sm"
                        >
                          {cred.role}
                        </Tag>
                      </div>
                      <p className="text-[10px] text-[var(--ink-muted)] truncate">
                        {cred.roleLabel} • {cred.exam}
                      </p>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
