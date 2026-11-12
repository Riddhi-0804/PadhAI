import React from 'react';
import { Database, ShieldCheck, Users, Table } from 'lucide-react';
import { SEED_CREDENTIALS } from '../../types/auth';
import { Tag } from '../ui/Tag';

export const AdminDashboardView: React.FC = () => {
  const tables = [
    { name: 'users', rows: 6, purpose: 'Role, language, exam, level' },
    { name: 'notes', rows: 3, purpose: 'Ground-truth class notes' },
    { name: 'note_chunks', rows: 9, purpose: 'Vector retrieval chunks' },
    { name: 'videos', rows: 2, purpose: 'Curated Indian board lectures' },
    { name: 'transcript_chunks', rows: 12, purpose: 'Timestamp lookahead guard' },
    { name: 'doubts', rows: 4, purpose: 'Timestamp-locked student doubts' },
    { name: 'questions', rows: 15, purpose: 'CBSE / Board practice rubrics' },
    { name: 'test_attempts', rows: 5, purpose: 'Scored student submissions' },
    { name: 'flashcards', rows: 18, purpose: 'Spaced repetition decks' },
    { name: 'topic_stats', rows: 2, purpose: 'Accuracy per syllabus chapter' },
    { name: 'streaks', rows: 3, purpose: 'Daily active study tracking' },
  ];

  return (
    <div className="w-full text-left space-y-6">
      <div className="p-5 rounded-sm border border-[var(--paper-border)] bg-[var(--paper-card)]">
        <div className="flex items-center gap-2 mb-1">
          <Tag variant="brick">SYSTEM ADMINISTRATION</Tag>
          <span className="text-xs font-mono-time text-[var(--ink-muted)]">
            SQLite Database: backend/data/padhai.db
          </span>
        </div>
        <h2 className="font-serif-title text-2xl font-bold text-[var(--ink-primary)]">
          Database Tables & Role Supervision
        </h2>
        <p className="text-xs text-[var(--ink-muted)] mt-0.5">
          11 active tables with foreign key constraints and schema version tracking.
        </p>
      </div>

      {/* Database Schema Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-sm border border-[var(--paper-border)] bg-[var(--paper-card)]">
          <div className="flex items-center gap-2 mb-3">
            <Database className="w-4 h-4 text-[var(--marigold-accent)]" />
            <h3 className="font-serif-title text-base font-bold text-[var(--ink-primary)]">
              SQLite Tables Status (11 Tables)
            </h3>
          </div>

          <div className="space-y-1.5 text-xs font-mono-time">
            {tables.map((t) => (
              <div
                key={t.name}
                className="flex items-center justify-between py-1 border-b border-[var(--paper-rule)]"
              >
                <span className="font-semibold text-[var(--ink-primary)]">{t.name}</span>
                <span className="text-[var(--ink-muted)]">{t.purpose}</span>
                <Tag variant="neutral" size="sm">{t.rows} rows</Tag>
              </div>
            ))}
          </div>
        </div>

        {/* User Directory */}
        <div className="p-4 rounded-sm border border-[var(--paper-border)] bg-[var(--paper-card)]">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-[var(--marigold-accent)]" />
            <h3 className="font-serif-title text-base font-bold text-[var(--ink-primary)]">
              Registered Accounts ({SEED_CREDENTIALS.length})
            </h3>
          </div>

          <div className="space-y-2 text-xs">
            {SEED_CREDENTIALS.map((u) => (
              <div
                key={u.email}
                className="p-2 rounded-xs border border-[var(--paper-border)] bg-[var(--paper-elevated)] flex items-center justify-between"
              >
                <div>
                  <span className="font-semibold text-[var(--ink-primary)] block">
                    {u.name}
                  </span>
                  <span className="text-[10px] font-mono-time text-[var(--ink-muted)]">
                    {u.email}
                  </span>
                </div>
                <Tag
                  variant={
                    u.role === 'admin'
                      ? 'brick'
                      : u.role === 'teacher'
                      ? 'marigold'
                      : u.role === 'parent'
                      ? 'ink'
                      : 'neutral'
                  }
                  size="sm"
                >
                  {u.role}
                </Tag>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
