import React, { useState } from 'react';
import { Check, ArrowRight, ArrowLeft, BookOpen } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { AcademicLevel, OnboardingData } from '../../types/auth';
import { Button } from '../ui/Button';
import { Tag } from '../ui/Tag';

interface OnboardingModalProps {
  isOpen: boolean;
  onSuccess: (msg: string) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onSuccess,
}) => {
  const { user, completeOnboarding } = useAuth();
  const { t, setLanguage } = useLanguage();

  const [step, setStep] = useState<number>(1);
  const [selectedLang, setSelectedLang] = useState<'en' | 'hi'>('hi');
  const [selectedExam, setSelectedExam] = useState<string>('CBSE 12th Science');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([
    'Physics',
    'Chemistry',
    'Mathematics',
  ]);
  const [selectedLevel, setSelectedLevel] = useState<AcademicLevel>('intermediate');

  if (!isOpen) return null;

  const examsList = [
    { id: 'CBSE 12th Science', label: 'CBSE Class 12 Science (PCM/PCB)', desc: 'Board exams with NCERT syllabus' },
    { id: 'JEE Main & Advanced', label: 'JEE Main & Advanced 2025', desc: 'Engineering entrance test' },
    { id: 'NEET 2025', label: 'NEET UG 2025', desc: 'Medical entrance test' },
    { id: 'CBSE 12th Commerce', label: 'CBSE Class 12 Commerce', desc: 'Accounts, Economics, Business Studies' },
    { id: 'State Board 12th', label: 'State Higher Secondary Board', desc: 'State curriculum & vernacular textbooks' },
  ];

  const subjectsList = [
    { id: 'Physics', label: 'Physics (भौतिक विज्ञान)', stream: 'Science' },
    { id: 'Chemistry', label: 'Chemistry (रसायन विज्ञान)', stream: 'Science' },
    { id: 'Mathematics', label: 'Mathematics (गणित)', stream: 'Science' },
    { id: 'Biology', label: 'Biology (जीव विज्ञान)', stream: 'Science' },
    { id: 'Accountancy', label: 'Accountancy (लेखाशास्त्र)', stream: 'Commerce' },
    { id: 'Economics', label: 'Economics (अर्थशास्त्र)', stream: 'Commerce/Arts' },
    { id: 'Business Studies', label: 'Business Studies (व्यवसाय अध्ययन)', stream: 'Commerce' },
  ];

  const levelsList: { id: AcademicLevel; title: string; desc: string }[] = [
    {
      id: 'beginner',
      title: 'Foundation / Beginner',
      desc: 'Focus on NCERT basic definitions, formula derivations, and standard solved textbook examples.',
    },
    {
      id: 'intermediate',
      title: 'Moderate / Intermediate',
      desc: 'Comfortable with chapter theories; need practice with tricky numericals and board answer formats.',
    },
    {
      id: 'advanced',
      title: 'Exam-Ready / Advanced',
      desc: 'Focus on multi-concept JEE/NEET previous year questions (PYQs) and speed drills.',
    },
  ];

  const toggleSubject = (sub: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(sub) ? prev.filter((s) => s !== sub) : [...prev, sub]
    );
  };

  const handleFinish = async () => {
    const data: OnboardingData = {
      language: selectedLang,
      exam: selectedExam,
      subjects: selectedSubjects,
      level: selectedLevel,
    };
    setLanguage(selectedLang);
    await completeOnboarding(data);
    onSuccess('Onboarding completed! Your study desk has been calibrated.');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in"
    >
      <div className="relative w-full max-w-2xl bg-[var(--paper-card)] border border-[var(--paper-border)] shadow-[var(--paper-shadow-lift)] rounded-sm p-6 sm:p-8 text-left max-h-[90vh] overflow-y-auto">
        {/* Step indicator */}
        <div className="flex items-center justify-between border-b border-[var(--paper-rule)] pb-3 mb-6">
          <div className="flex items-center gap-2">
            <Tag variant="marigold" size="sm">
              STEP 0{step} OF 04
            </Tag>
            <span className="text-xs font-mono-time text-[var(--ink-muted)]">
              CALIBRATING: {user?.name || 'Student'}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4].map((s) => (
              <span
                key={s}
                className={`w-5 h-1.5 rounded-xs transition-colors ${
                  s <= step ? 'bg-[var(--marigold-accent)]' : 'bg-[var(--paper-border)]'
                }`}
              />
            ))}
          </div>
        </div>

        {/* STEP 1: Language */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h3 className="font-serif-title text-xl font-bold text-[var(--ink-primary)]">
                {t.auth.step1Language}
              </h3>
              <p className="text-xs text-[var(--ink-muted)] mt-1">
                Choose the primary language for your AI notes, doubt explanations, and practice hints.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedLang('hi')}
                className={`p-4 rounded-sm border text-left cursor-pointer transition-all ${
                  selectedLang === 'hi'
                    ? 'border-2 border-[var(--marigold-accent)] bg-[var(--marigold-light)] shadow-[var(--paper-shadow-sm)]'
                    : 'border-[var(--paper-border)] bg-[var(--paper-card)] hover:bg-[var(--paper-elevated)]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-serif-title text-lg font-bold text-[var(--ink-primary)]">
                    हिन्दी / Hinglish
                  </span>
                  {selectedLang === 'hi' && (
                    <Check className="w-4 h-4 text-[var(--marigold-accent)]" />
                  )}
                </div>
                <p className="text-xs text-[var(--ink-secondary)]">
                  सरल भाषा में व्याख्या, एनसीईआरटी के पारिभाषिक शब्दों के साथ।
                </p>
              </button>

              <button
                type="button"
                onClick={() => setSelectedLang('en')}
                className={`p-4 rounded-sm border text-left cursor-pointer transition-all ${
                  selectedLang === 'en'
                    ? 'border-2 border-[var(--marigold-accent)] bg-[var(--marigold-light)] shadow-[var(--paper-shadow-sm)]'
                    : 'border-[var(--paper-border)] bg-[var(--paper-card)] hover:bg-[var(--paper-elevated)]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-serif-title text-lg font-bold text-[var(--ink-primary)]">
                    English
                  </span>
                  {selectedLang === 'en' && (
                    <Check className="w-4 h-4 text-[var(--marigold-accent)]" />
                  )}
                </div>
                <p className="text-xs text-[var(--ink-secondary)]">
                  Clear, concise English with authentic syllabus terminology.
                </p>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Target Exam */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h3 className="font-serif-title text-xl font-bold text-[var(--ink-primary)]">
                {t.auth.step2Exam}
              </h3>
              <p className="text-xs text-[var(--ink-muted)] mt-1">
                Sets the marking rubrics, question weighting, and chapter syllabus.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              {examsList.map((exam) => (
                <button
                  key={exam.id}
                  type="button"
                  onClick={() => setSelectedExam(exam.id)}
                  className={`w-full p-3 rounded-sm border text-left flex items-center justify-between cursor-pointer transition-all ${
                    selectedExam === exam.id
                      ? 'border-[var(--marigold-accent)] bg-[var(--marigold-light)] shadow-[var(--paper-shadow-sm)]'
                      : 'border-[var(--paper-border)] bg-[var(--paper-card)] hover:bg-[var(--paper-elevated)]'
                  }`}
                >
                  <div>
                    <span className="text-sm font-semibold text-[var(--ink-primary)] block">
                      {exam.label}
                    </span>
                    <span className="text-xs text-[var(--ink-muted)]">{exam.desc}</span>
                  </div>
                  {selectedExam === exam.id && (
                    <Check className="w-4 h-4 text-[var(--marigold-accent)] shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: Active Subjects */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <h3 className="font-serif-title text-xl font-bold text-[var(--ink-primary)]">
                {t.auth.step3Subjects}
              </h3>
              <p className="text-xs text-[var(--ink-muted)] mt-1">
                Select all subjects currently in your study plan.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
              {subjectsList.map((sub) => {
                const isSelected = selectedSubjects.includes(sub.id);
                return (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => toggleSubject(sub.id)}
                    className={`p-3 rounded-sm border text-left flex items-center justify-between cursor-pointer transition-colors ${
                      isSelected
                        ? 'border-[var(--marigold-accent)] bg-[var(--marigold-light)] text-[var(--ink-primary)]'
                        : 'border-[var(--paper-border)] bg-[var(--paper-card)] text-[var(--ink-secondary)]'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-semibold block">{sub.label}</span>
                      <span className="text-[10px] font-mono-time text-[var(--ink-muted)]">
                        {sub.stream}
                      </span>
                    </div>
                    {isSelected && (
                      <Check className="w-4 h-4 text-[var(--marigold-accent)] shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4: Level */}
        {step === 4 && (
          <div className="space-y-4">
            <div>
              <h3 className="font-serif-title text-xl font-bold text-[var(--ink-primary)]">
                {t.auth.step4Level}
              </h3>
              <p className="text-xs text-[var(--ink-muted)] mt-1">
                This calibrates the difficulty of doubt explanations and practice sets.
              </p>
            </div>

            <div className="space-y-2.5 pt-2">
              {levelsList.map((lvl) => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => setSelectedLevel(lvl.id)}
                  className={`w-full p-3.5 rounded-sm border text-left cursor-pointer transition-all ${
                    selectedLevel === lvl.id
                      ? 'border-[var(--marigold-accent)] bg-[var(--marigold-light)] shadow-[var(--paper-shadow-sm)]'
                      : 'border-[var(--paper-border)] bg-[var(--paper-card)] hover:bg-[var(--paper-elevated)]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-[var(--ink-primary)]">
                      {lvl.title}
                    </span>
                    {selectedLevel === lvl.id && (
                      <Check className="w-4 h-4 text-[var(--marigold-accent)]" />
                    )}
                  </div>
                  <p className="text-xs text-[var(--ink-secondary)] leading-relaxed">
                    {lvl.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-6 mt-6 border-t border-[var(--paper-rule)]">
          {step > 1 ? (
            <Button
              variant="outline"
              size="md"
              onClick={() => setStep((s) => s - 1)}
              className="gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t.auth.prevStep}</span>
            </Button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <Button
              variant="marigold"
              size="md"
              onClick={() => setStep((s) => s + 1)}
              className="gap-1.5"
            >
              <span>{t.auth.nextStep}</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              variant="marigold"
              size="md"
              onClick={handleFinish}
              className="gap-1.5 font-semibold"
            >
              <span>{t.auth.completeOnboarding}</span>
              <Check className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
