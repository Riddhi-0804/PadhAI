export type Language = 'en' | 'hi';
export type Theme = 'light' | 'dark';

export type AppRoute = 
  | 'landing'
  | 'dashboard'
  | 'notes'
  | 'ask'
  | 'lectures'
  | 'practice'
  | 'flashcards'
  | 'planner'
  | 'teacher-desk'
  | 'parent-desk'
  | 'admin-desk';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: 'info' | 'success' | 'correction';
  duration?: number;
}
