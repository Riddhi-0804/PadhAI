export type UserRole = 'student' | 'teacher' | 'parent' | 'admin';
export type AcademicLevel = 'beginner' | 'intermediate' | 'advanced';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  language: 'en' | 'hi';
  level: AcademicLevel;
  exam: string;
  subjects: string;
  onboarding_completed: boolean | number;
}

export interface OnboardingData {
  language: 'en' | 'hi';
  exam: string;
  subjects: string[];
  level: AcademicLevel;
}

export interface SeedCredential {
  name: string;
  email: string;
  role: UserRole;
  roleLabel: string;
  description: string;
  exam: string;
  subjects: string;
  language: 'en' | 'hi';
  level: AcademicLevel;
}

export const SEED_CREDENTIALS: SeedCredential[] = [
  {
    name: 'Dr. Rameshwar Sharma',
    email: 'rameshwar.sharma@padhai.edu',
    role: 'teacher',
    roleLabel: 'Senior Physics Faculty',
    description: 'Mentoring 120+ CBSE & JEE Advanced aspirants. Inspects doubt logs.',
    exam: 'CBSE 12th & JEE Physics',
    subjects: 'Physics, Applied Mechanics',
    language: 'hi',
    level: 'advanced',
  },
  {
    name: 'Sunita Sharma',
    email: 'sunita.sharma@gmail.com',
    role: 'parent',
    roleLabel: 'Parent of Arjun Sharma',
    description: 'Monitors daily streak, study hours, and weak topic alerts.',
    exam: 'CBSE 12th Science',
    subjects: 'Physics, Chemistry, Mathematics',
    language: 'hi',
    level: 'intermediate',
  },
  {
    name: 'Arjun Sharma',
    email: 'arjun.sharma@student.padhai.in',
    role: 'student',
    roleLabel: 'Class 12 CBSE Aspirant',
    description: 'Active revision on Ray Optics, Lens Maker Formula & Calculus.',
    exam: 'CBSE 12th Science',
    subjects: 'Physics, Chemistry, Mathematics',
    language: 'hi',
    level: 'intermediate',
  },
  {
    name: 'Priya Iyer',
    email: 'priya.iyer@student.padhai.in',
    role: 'student',
    roleLabel: 'NEET 2025 Aspirant',
    description: 'Preparing Botany, Zoology, Organic Chemistry & Optics.',
    exam: 'NEET 2025',
    subjects: 'Physics, Chemistry, Biology',
    language: 'en',
    level: 'advanced',
  },
  {
    name: 'Kabir Mehta',
    email: 'kabir.mehta@student.padhai.in',
    role: 'student',
    roleLabel: 'Class 12 Commerce Aspirant',
    description: 'Partnership Accounts, Cash Flow, Macroeconomics Multiplier.',
    exam: 'CBSE 12th Commerce',
    subjects: 'Accountancy, Economics, Business Studies',
    language: 'en',
    level: 'beginner',
  },
  {
    name: 'Admin Vikramaditya',
    email: 'admin@padhai.in',
    role: 'admin',
    roleLabel: 'System Administrator',
    description: 'Full database table supervision and role assignments.',
    exam: 'All Indian Boards & Competitive',
    subjects: 'System Administration',
    language: 'en',
    level: 'advanced',
  },
];
