export type SM2Rating = 1 | 2 | 3 | 4; // 1: Again, 2: Hard, 3: Good, 4: Easy

export interface SM2Flashcard {
  id: string;
  user_id: string;
  subject: string;
  chapter: string;
  front: string;
  back: string;
  bilingual_analogy?: string; // Cricket, chai, auto-rickshaw analogy
  next_review: string;
  interval_days: number;
  repetition_count: number;
  ease_factor: number;
  source_citation: string;
}

export interface DayScheduleItem {
  day_number: number;
  date_formatted: string;
  date_iso: string;
  subject: string;
  chapter: string;
  target_topics: string[];
  numerical_count: number;
  daily_minutes: number;
  is_completed: boolean;
  is_missed: boolean;
}

export interface StudyPlanConfig {
  id: string;
  target_exam: string;
  exam_date: string;
  days_remaining: number;
  daily_goal_minutes: number;
  schedule: DayScheduleItem[];
}

export interface StampBadge {
  id: string;
  title: string;
  title_hi: string;
  description: string;
  unlocked: boolean;
  unlocked_date?: string;
  ink_color: 'marigold' | 'ink' | 'brick';
  icon_name: string;
}

export interface LeaderboardStudent {
  rank: number;
  name: string;
  exam: string;
  streak_days: number;
  xp: number;
  is_current_user: boolean;
  mastery_badge: string;
}
