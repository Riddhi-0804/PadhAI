export interface VideoLecture {
  id: string;
  title: string;
  subject: string;
  chapter: string;
  video_url: string;
  duration_seconds: number;
  teacher_name: string;
}

export interface TranscriptChunk {
  id: string;
  video_id: string;
  start_time: number;
  end_time: number;
  text: string;
  section_title: string;
}

export type DoubtOutcome = 'answer_now' | 'answered_later' | 'not_covered';

export interface PauseDoubtResult {
  doubt_id: string;
  outcome: DoubtOutcome;
  answer?: string;
  hint?: string;
  timestamp?: string;
  answered_later?: boolean;
  confidence?: 'High' | 'Medium' | 'Low';
  source?: string;
  tag?: string;
  leak_guarded?: boolean;
  taught_summary?: string;
  timestamp_formatted: string;
  taught_chunks_count?: number;
  revealed_anyway?: boolean;
}

export interface LectureFlashcard {
  id: string;
  subject: string;
  front: string;
  back: string;
  source_timestamp: string;
  created_at: string;
}
