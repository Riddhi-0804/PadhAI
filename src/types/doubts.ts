export type AnswerMode = 'simple' | 'exam' | 'deep';

export interface DetectedIntent {
  language: 'hi' | 'en';
  question_type: 'conceptual' | 'numerical' | 'derivation' | 'definition' | 'application';
  topic: string;
  level: 'beginner' | 'intermediate' | 'advanced';
}

export interface ClarificationPrompt {
  question: string;
  options: string[];
}

export interface Citation {
  source: string;
  section: string;
  exact_snippet?: string;
}

export interface DoubtResponse {
  id?: string;
  question: string;
  detected: DetectedIntent;
  clarification?: ClarificationPrompt | null;
  answer: string;
  mode: AnswerMode;
  confidence: 'High' | 'Medium' | 'Low';
  citations: Citation[];
  low_confidence_warning?: string | null;
  weak_topics_noted?: string[];
  created_at?: string;
}
