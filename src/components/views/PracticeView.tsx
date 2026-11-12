import React, { useState, useEffect } from 'react';
import {
  PenTool,
  Sparkles,
  BookOpen,
  Award,
  Clock,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import {
  TestQuestion,
  AnswerSubmission,
  TestResult,
  TopicStat,
  DifficultyLevel,
} from '../../types/practice';
import { practiceService } from '../../services/practiceService';
import { WeakTopicDashboard } from '../practice/WeakTopicDashboard';
import { TestGeneratorModal } from '../practice/TestGeneratorModal';
import { TestTakingSheet } from '../practice/TestTakingSheet';
import { TestResultView } from '../practice/TestResultView';
import { Tag } from '../ui/Tag';
import { Button } from '../ui/Button';

interface PracticeViewProps {
  onTriggerToast: (title: string, desc?: string, type?: 'info' | 'success' | 'correction') => void;
}

export const PracticeView: React.FC<PracticeViewProps> = ({ onTriggerToast }) => {
  const { t, language } = useLanguage();

  // State: 'dashboard' | 'taking' | 'result'
  const [viewState, setViewState] = useState<'dashboard' | 'taking' | 'result'>('dashboard');

  const [stats, setStats] = useState<TopicStat[]>([]);
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [initialTopicFilter, setInitialTopicFilter] = useState<string>('');

  // Active Test State
  const [currentTestId, setCurrentTestId] = useState<string>('');
  const [currentSubject, setCurrentSubject] = useState<string>('Physics');
  const [currentTopic, setCurrentTopic] = useState<string>('Ray Optics');
  const [activeQuestions, setActiveQuestions] = useState<TestQuestion[]>([]);
  const [isMockExam, setIsMockExam] = useState<boolean>(false);
  const [timerMinutes, setTimerMinutes] = useState<number>(15);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);

  // Active Result State
  const [latestResult, setLatestResult] = useState<TestResult | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const data = await practiceService.getStats();
    setStats(data.stats);
  };

  const handleOpenGenerator = (topicFilter?: string) => {
    setInitialTopicFilter(topicFilter || '');
    setIsGeneratorOpen(true);
  };

  const handleGenerateTest = async (config: {
    subject: string;
    difficulty: DifficultyLevel;
    isMockExam: boolean;
    timerMinutes: number;
    topicFilter?: string;
  }) => {
    try {
      const generated = await practiceService.generateTest({
        subject: config.subject,
        difficulty: config.difficulty,
        is_mock_exam: config.isMockExam,
        topicFilter: config.topicFilter,
      });

      setCurrentTestId(generated.test_id);
      setCurrentSubject(config.subject);
      setCurrentTopic(config.topicFilter || `${config.subject} Syllabus`);
      setActiveQuestions(generated.questions);
      setIsMockExam(config.isMockExam);
      setTimerMinutes(config.timerMinutes);
      setViewState('taking');

      onTriggerToast(
        config.isMockExam ? 'CBSE Mock Exam Activated' : 'Test Generated',
        `Assigned difficulty: ${generated.difficulty_assigned}. ${generated.questions.length} questions from notes.`,
        'info'
      );
    } catch {
      onTriggerToast('Generation Error', 'Failed to generate test. Check offline mode.', 'correction');
    }
  };

  const handleLaunchRevise = (topic: TopicStat) => {
    handleGenerateTest({
      subject: topic.subject,
      difficulty: 'adaptive',
      isMockExam: false,
      timerMinutes: 10,
      topicFilter: topic.topic,
    });
  };

  const handleSubmitAnswers = async (submissions: AnswerSubmission[], timeSpentSeconds: number) => {
    setIsEvaluating(true);
    try {
      const evalResult = await practiceService.evaluateTest({
        subject: currentSubject,
        topic: currentTopic,
        is_mock_exam: isMockExam,
        time_spent_seconds: timeSpentSeconds,
        submissions,
        questions: activeQuestions,
      });

      setLatestResult(evalResult);
      setIsEvaluating(false);
      setViewState('result');
      loadStats(); // refresh updated topic stats

      onTriggerToast(
        'Answer Sheet Evaluated',
        `Scored ${evalResult.score} / ${evalResult.total_marks} (${evalResult.percentage}%). Red ink markings recorded.`,
        'success'
      );
    } catch {
      setIsEvaluating(false);
      onTriggerToast('Evaluation Error', 'Failed to evaluate answers.', 'correction');
    }
  };

  return (
    <div className="w-full text-left space-y-6">
      {viewState === 'dashboard' && (
        <div className="space-y-6">
          {/* Top Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Tag variant="marigold">EXAM-PATTERN PRACTICE DESK</Tag>
                <span className="text-xs font-mono-time text-[var(--ink-muted)]">
                  CBSE BLUEPRINT 2025
                </span>
              </div>
              <h2 className="font-serif-title text-2xl font-bold text-[var(--ink-primary)]">
                {t.nav.practice}
              </h2>
              <p className="text-xs text-[var(--ink-muted)] mt-0.5">
                Generate MCQs, short and long derivation questions strictly from your uploaded notebook chunks.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  handleGenerateTest({
                    subject: 'Physics',
                    difficulty: 'adaptive',
                    isMockExam: true,
                    timerMinutes: 30,
                  })
                }
                className="gap-1.5 text-xs font-semibold"
              >
                <Clock className="w-3.5 h-3.5 text-[var(--marigold-accent)]" />
                <span>Quick Mock Exam</span>
              </Button>

              <Button
                variant="marigold"
                size="sm"
                onClick={() => handleOpenGenerator()}
                className="gap-1.5 text-xs font-semibold"
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>Create Practice Test</span>
              </Button>
            </div>
          </div>

          {/* Weak Topic Radar Dashboard */}
          <WeakTopicDashboard
            stats={stats}
            onLaunchRevise={handleLaunchRevise}
            onOpenTestGenerator={() => handleOpenGenerator()}
          />

          {/* Generator Modal */}
          <TestGeneratorModal
            isOpen={isGeneratorOpen}
            onClose={() => setIsGeneratorOpen(false)}
            onGenerate={handleGenerateTest}
            initialTopicFilter={initialTopicFilter}
          />
        </div>
      )}

      {/* Taking Active Test Sheet */}
      {viewState === 'taking' && (
        <TestTakingSheet
          testId={currentTestId}
          subject={currentSubject}
          questions={activeQuestions}
          isMockExam={isMockExam}
          timerMinutes={timerMinutes}
          onCancel={() => setViewState('dashboard')}
          onSubmit={handleSubmitAnswers}
          isEvaluating={isEvaluating}
        />
      )}

      {/* Result Screen */}
      {viewState === 'result' && latestResult && (
        <TestResultView
          result={latestResult}
          questions={activeQuestions}
          onRetake={() => setViewState('taking')}
          onBackToDashboard={() => setViewState('dashboard')}
        />
      )}
    </div>
  );
};
