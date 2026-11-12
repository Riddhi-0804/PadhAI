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
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccessToast,
}) => {
  const { login, register, loginWithSeed, isLoading } = useAuth();
  const { t } = useLanguage();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'signin') {
      const ok = await login(email, password);
      if (ok) {
        onSuccessToast(t.auth.loginSuccess);
        onClose();
      } else {
        setError(t.auth.invalidCreds);
      }
    } else {
      if (!name.trim()) {
        setError('Please enter your full name');
        return;
      }
      const ok = await register(name, email, password, role);
      if (ok) {
        onSuccessToast(t.auth.registeredSuccess);
        onClose();
      } else {
        setError('Failed to create account.');
      }
    }
  };

  const handleSeedSelect = (cred: typeof SEED_CREDENTIALS[0]) => {
    loginWithSeed(cred);
    onSuccessToast(`Switched persona to ${cred.name} (${cred.roleLabel})`);
    onClose();
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

        {/* Quick Seed Personas Switcher (Required for instant role testing) */}
        <div className="pt-4 border-t border-[var(--paper-rule)]">
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
                onClick={() => handleSeedSelect(cred)}
                className="p-2.5 rounded-sm border border-[var(--paper-border)] bg-[var(--paper-elevated)] hover:border-[var(--marigold-accent)] text-left transition-colors cursor-pointer group"
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
        </div>
      </div>
    </div>
  );
};
