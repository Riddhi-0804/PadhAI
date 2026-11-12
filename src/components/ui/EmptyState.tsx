import React from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { Tag } from './Tag';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  categoryTag?: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  categoryTag,
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  className = '',
}) => {
  return (
    <Card
      withMarginRule
      elevation="lift"
      className={`max-w-xl mx-auto my-6 text-left ${className}`}
    >
      <div className="flex flex-col items-start gap-3">
        <div className="flex items-center gap-2">
          {categoryTag && <Tag variant="marigold">{categoryTag}</Tag>}
          <span className="text-[11px] font-mono-time text-[var(--ink-muted)]">
            SEC. 01 // BLANK SHEET
          </span>
        </div>

        {icon && (
          <div className="w-12 h-12 rounded-sm bg-[var(--paper-elevated)] border border-[var(--paper-border)] flex items-center justify-center text-[var(--ink-secondary)] mb-1">
            {icon}
          </div>
        )}

        <h3 className="font-serif-title text-xl font-bold text-[var(--ink-primary)]">
          {title}
        </h3>

        <p className="text-sm text-[var(--ink-secondary)] leading-relaxed max-w-md">
          {description}
        </p>

        {(actionLabel || secondaryActionLabel) && (
          <div className="flex flex-wrap items-center gap-3 pt-3">
            {actionLabel && onAction && (
              <Button variant="ink" onClick={onAction}>
                {actionLabel}
              </Button>
            )}
            {secondaryActionLabel && onSecondaryAction && (
              <Button variant="outline" onClick={onSecondaryAction}>
                {secondaryActionLabel}
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};
