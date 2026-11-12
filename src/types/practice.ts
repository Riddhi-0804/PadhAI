export type QuestionType = 'mcq' | 'short' | 'long';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'adaptive';

export interface TestQuestion {
  id: string;
  type: QuestionType;
  question: string;
  question_hi?: string;
  options?: string[]; // For MCQs
  correct_option_index?: number;
  marks: number;
  source_chunk_id: string;
  source_page: number;
  source_section: string;
  rubric: string[];
}

export interface AnswerSubmission {
  question_id: string;
  answer_text: string;
  selected_option_index?: number;
}

export interface QuestionEvaluation {
  question_id: string;
  score_awarded: number;
  max_marks: number;
  what_is_missing?: string[];
  model_answer: string;
  source_citation: string;
  bilingual_notes?: string;
  feedback_sentiment: 'full' | 'partial' | 'incorrect';
}

export interface TestResult {
  attempt_id: string;
  subject: string;
  topic: string;
  score: number;
  total_marks: number;
  percentage: number;
  evaluations: QuestionEvaluation[];
  time_spent_seconds: number;
  is_mock_exam: boolean;
  date: string;
  summary_feedback: string;
}

export interface TopicStat {
  id: string;
  subject: string;
  topic: string;
  accuracy: number;
  attempts_count: number;
  last_practiced: string;
  is_weak: boolean;
}
