import React from 'react';
import { ShieldAlert, UserCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types/auth';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Tag } from '../ui/Tag';

interface RoleGateProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
  onOpenAuth: () => void;
}

export const RoleGate: React.FC<RoleGateProps> = ({
  allowedRoles,
  children,
  onOpenAuth,
}) => {
  const { user, hasRole } = useAuth();

  if (hasRole(allowedRoles)) {
    return <>{children}</>;
  }

  return (
    <Card withMarginRule elevation="lift" className="max-w-xl mx-auto my-12 text-left">
      <div className="flex flex-col items-start gap-3">
        <div className="flex items-center gap-2">
          <Tag variant="brick">ACCESS RESTRICTED</Tag>
          <span className="text-[11px] font-mono-time text-[var(--ink-muted)]">
            SEC. 403 // ROLE GATE
          </span>
        </div>

        <div className="w-12 h-12 rounded-sm bg-[var(--brick-red-light)] border border-[var(--brick-red-border)] flex items-center justify-center text-[var(--brick-red)]">
          <ShieldAlert className="w-6 h-6" />
        </div>

        <h3 className="font-serif-title text-xl font-bold text-[var(--ink-primary)]">
          Role-Protected Study Area
        </h3>

        <p className="text-sm text-[var(--ink-secondary)] leading-relaxed">
          This section is restricted to{' '}
          <strong className="text-[var(--ink-primary)]">
            {allowedRoles.join(' or ')}
          </strong>{' '}
          accounts. You are currently browsing as{' '}
          <span className="font-mono-time font-semibold text-[var(--marigold-accent)]">
            {user?.role || 'Guest'}
          </span>{' '}
          ({user?.name || 'Anonymous'}).
        </p>

        <div className="pt-3">
          <Button variant="marigold" onClick={onOpenAuth} className="gap-2">
            <UserCheck className="w-4 h-4" />
            <span>Switch Role / Sign In as {allowedRoles[0]}</span>
          </Button>
        </div>
      </div>
    </Card>
  );
};
