import React, { useState } from 'react';
import { Edit2, Check, RefreshCw, Sparkles, X } from 'lucide-react';
import { DetectedIntent } from '../../types/doubts';
import { Tag } from '../ui/Tag';

interface UnderstoodHeaderProps {
  detected: DetectedIntent;
  onUpdate: (updated: DetectedIntent) => void;
  isLoading?: boolean;
}

export const UnderstoodHeader: React.FC<UnderstoodHeaderProps> = ({
  detected,
  onUpdate,
  isLoading = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [lang, setLang] = useState<'hi' | 'en'>(detected.language);
  const [topic, setTopic] = useState(detected.topic);
  const [level, setLevel] = useState<'beginner' | 'intermediate' | 'advanced'>(detected.level);

  const handleSave = () => {
    onUpdate({
      ...detected,
      language: lang,
      topic,
      level,
    });
    setIsEditing(false);
  };

  return (
    <div className="rounded-sm border border-[var(--paper-border)] bg-[var(--paper-card)] p-3 text-xs mb-3 text-left">
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-mono-time uppercase text-[var(--marigold-accent)] font-semibold flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>WHAT I UNDERSTOOD:</span>
          </span>

          <span className="font-mono-time text-[var(--ink-secondary)]">
            Language: <strong className="text-[var(--ink-primary)]">{detected.language === 'hi' ? 'Hindi / Hinglish' : 'English'}</strong>
          </span>
          <span className="text-[var(--paper-border)]">•</span>
          <span className="font-mono-time text-[var(--ink-secondary)] truncate max-w-[220px]">
            Topic: <strong className="text-[var(--ink-primary)]">{detected.topic}</strong>
          </span>
          <span className="text-[var(--paper-border)]">•</span>
          <span className="font-mono-time text-[var(--ink-secondary)] capitalize">
            Level: <strong className="text-[var(--ink-primary)]">{detected.level}</strong>
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsEditing(!isEditing)}
          className="inline-flex items-center gap-1 text-[11px] font-mono-time text-[var(--marigold-accent)] hover:underline cursor-pointer shrink-0"
        >
          <Edit2 className="w-3 h-3" />
          <span>{isEditing ? 'Cancel' : 'Edit Understanding'}</span>
        </button>
      </div>

      {/* Inline edit drawer */}
      {isEditing && (
        <div className="mt-3 pt-3 border-t border-[var(--paper-rule)] grid grid-cols-1 sm:grid-cols-3 gap-3 animate-in fade-in">
          <div>
            <label className="text-[10px] font-mono-time uppercase text-[var(--ink-muted)] block mb-1">
              Language
            </label>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as 'hi' | 'en')}
              className="w-full p-1.5 text-xs bg-[var(--paper-elevated)] border border-[var(--paper-border)] rounded-xs text-[var(--ink-primary)]"
            >
              <option value="hi">हिन्दी / Hinglish</option>
              <option value="en">English</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-mono-time uppercase text-[var(--ink-muted)] block mb-1">
              Topic Calibration
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full p-1.5 text-xs bg-[var(--paper-elevated)] border border-[var(--paper-border)] rounded-xs text-[var(--ink-primary)]"
            />
          </div>

          <div>
            <label className="text-[10px] font-mono-time uppercase text-[var(--ink-muted)] block mb-1">
              Difficulty Level
            </label>
            <div className="flex items-center gap-2">
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as any)}
                className="w-full p-1.5 text-xs bg-[var(--paper-elevated)] border border-[var(--paper-border)] rounded-xs text-[var(--ink-primary)]"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced (Exam-Ready)</option>
              </select>

              <button
                type="button"
                onClick={handleSave}
                disabled={isLoading}
                className="px-2.5 py-1.5 bg-[var(--marigold-accent)] text-white text-xs font-semibold rounded-xs hover:bg-[var(--marigold-hover)] cursor-pointer whitespace-nowrap"
              >
                Re-run
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
