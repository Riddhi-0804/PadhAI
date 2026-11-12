import React from 'react';
import {
  Flame,
  Coffee,
  ShieldCheck,
  Target,
  Trophy,
  Award,
  CheckCircle2,
} from 'lucide-react';
import { StampBadge, LeaderboardStudent } from '../../types/engagement';
import { Tag } from '../ui/Tag';

interface StampBadgesSectionProps {
  badges: StampBadge[];
  leaderboard: LeaderboardStudent[];
  currentStreak: number;
  totalXP: number;
}

export const StampBadgesSection: React.FC<StampBadgesSectionProps> = ({
  badges,
  leaderboard,
  currentStreak,
  totalXP,
}) => {
  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Coffee':
        return <Coffee className="w-5 h-5" />;
      case 'Flame':
        return <Flame className="w-5 h-5" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5" />;
      case 'Target':
      default:
        return <Target className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-8 text-left">
      {/* Overview Stats Bar: Streak & XP */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-sm border border-[var(--paper-border)] bg-[var(--paper-card)] flex items-center gap-3">
          <div className="p-2.5 rounded-full bg-[var(--marigold-light)] border border-[var(--marigold-border)] text-[var(--marigold-accent)]">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono-time uppercase text-[var(--ink-muted)]">
              DAILY STUDY STREAK
            </span>
            <h4 className="font-serif-title text-xl font-bold text-[var(--ink-primary)]">
              {currentStreak} Days Consistent
            </h4>
          </div>
        </div>

        <div className="p-4 rounded-sm border border-[var(--paper-border)] bg-[var(--paper-card)] flex items-center gap-3">
          <div className="p-2.5 rounded-full bg-[var(--paper-elevated)] border border-[var(--paper-border)] text-[var(--ink-primary)]">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono-time uppercase text-[var(--ink-muted)]">
              ACTIVE RECALL XP
            </span>
            <h4 className="font-serif-title text-xl font-bold text-[var(--ink-primary)]">
              {totalXP} Points
            </h4>
          </div>
        </div>

        <div className="p-4 rounded-sm border border-[var(--paper-border)] bg-[var(--paper-card)] flex items-center gap-3">
          <div className="p-2.5 rounded-full bg-[var(--brick-red-light)] border border-[var(--brick-red-border)] text-[var(--brick-red)]">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono-time uppercase text-[var(--ink-muted)]">
              CLASS STANDING
            </span>
            <h4 className="font-serif-title text-xl font-bold text-[var(--ink-primary)]">
              Rank #2 • CBSE 12th
            </h4>
          </div>
        </div>
      </div>

      {/* Physical Stamp-Style Badges */}
      <div className="space-y-3">
        <div>
          <span className="text-xs font-mono-time uppercase text-[var(--marigold-accent)] font-semibold">
            PHYSICAL INK STAMP COLLECTION
          </span>
          <h3 className="font-serif-title text-xl font-bold text-[var(--ink-primary)]">
            Effort & Discipline Badges
          </h3>
          <p className="text-xs text-[var(--ink-muted)] mt-0.5">
            Restrained ink stamps commemorating actual study milestones, avoiding dopamine confetti loops.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {badges.map((b) => {
            const inkBorder =
              b.ink_color === 'marigold'
                ? 'border-[var(--marigold-accent)] text-[var(--marigold-accent)]'
                : b.ink_color === 'brick'
                ? 'border-[var(--brick-red)] text-[var(--brick-red)]'
                : 'border-[var(--ink-primary)] text-[var(--ink-primary)]';

            return (
              <div
                key={b.id}
                className={`relative p-4 rounded-sm border-2 transition-all flex flex-col justify-between min-h-[160px] ${
                  b.unlocked
                    ? `${inkBorder} bg-[var(--paper-card)] shadow-xs`
                    : 'border-dashed border-[var(--paper-border)] bg-[var(--paper-elevated)]/60 opacity-60 text-[var(--ink-muted)]'
                }`}
              >
                {/* Physical ink stamp appearance */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div
                      className={`p-2 rounded-xs border ${
                        b.unlocked
                          ? `${inkBorder} bg-transparent`
                          : 'border-[var(--paper-border)] text-[var(--ink-muted)]'
                      }`}
                    >
                      {getBadgeIcon(b.icon_name)}
                    </div>

                    {b.unlocked ? (
                      <span className="text-[9px] font-mono-time uppercase px-1.5 py-0.5 rounded-xs border font-bold tracking-wider">
                        STAMPED
                      </span>
                    ) : (
                      <span className="text-[9px] font-mono-time uppercase px-1.5 py-0.5 rounded-xs bg-[var(--paper-border)] text-[var(--ink-muted)]">
                        LOCKED
                      </span>
                    )}
                  </div>

                  <div>
                    <h5 className="font-serif-title text-base font-bold leading-tight">
                      {b.title}
                    </h5>
                    <span className="text-[11px] font-serif-title italic opacity-80 block">
                      {b.title_hi}
                    </span>
                  </div>

                  <p className="text-xs font-body leading-snug text-[var(--ink-primary)] opacity-90">
                    {b.description}
                  </p>
                </div>

                {b.unlocked_date && (
                  <div className="mt-3 pt-2 border-t border-current/20 text-[10px] font-mono-time opacity-75">
                    Unlocked: {b.unlocked_date}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Class Leaderboard */}
      <div className="space-y-3">
        <div>
          <span className="text-xs font-mono-time uppercase text-[var(--marigold-accent)] font-semibold">
            PEER REVISION BOARD
          </span>
          <h3 className="font-serif-title text-xl font-bold text-[var(--ink-primary)]">
            Class 12 Study Group Leaderboard
          </h3>
          <p className="text-xs text-[var(--ink-muted)] mt-0.5">
            Measured strictly by active recall practice questions solved and streak consistency.
          </p>
        </div>

        <div className="rounded-sm border border-[var(--paper-border)] bg-[var(--paper-card)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-[var(--paper-border)] bg-[var(--paper-elevated)] font-mono-time text-[var(--ink-muted)]">
                  <th className="py-2.5 px-4 w-12 text-center">#</th>
                  <th className="py-2.5 px-4">Student Name</th>
                  <th className="py-2.5 px-4">Exam Target</th>
                  <th className="py-2.5 px-4">Streak</th>
                  <th className="py-2.5 px-4">Mastery Stamp</th>
                  <th className="py-2.5 px-4 text-right">Recall XP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--paper-rule)] font-body">
                {leaderboard.map((student) => (
                  <tr
                    key={student.name}
                    className={`transition-colors ${
                      student.is_current_user
                        ? 'bg-[var(--marigold-light)]/50 font-medium'
                        : 'hover:bg-[var(--paper-elevated)]'
                    }`}
                  >
                    <td className="py-3 px-4 text-center font-mono-time font-bold">
                      {student.rank === 1 ? (
                        <span className="text-[var(--marigold-accent)]">🥇 1</span>
                      ) : student.rank === 2 ? (
                        <span className="text-[var(--ink-primary)]">🥈 2</span>
                      ) : (
                        <span>{student.rank}</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-[var(--ink-primary)] font-semibold">
                          {student.name}
                        </span>
                        {student.is_current_user && (
                          <span className="text-[10px] font-mono-time text-[var(--marigold-accent)] bg-[var(--marigold-light)] px-1.5 py-0.2 rounded-xs border border-[var(--marigold-border)]">
                            You
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono-time text-[var(--ink-muted)]">
                      {student.exam}
                    </td>
                    <td className="py-3 px-4 font-mono-time text-[var(--marigold-accent)] font-semibold">
                      🔥 {student.streak_days}d
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[11px] font-mono-time px-2 py-0.5 rounded-[2px] bg-[var(--paper-elevated)] border border-[var(--paper-border)] text-[var(--ink-primary)]">
                        {student.mastery_badge}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono-time font-bold text-[var(--ink-primary)]">
                      {student.xp}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
