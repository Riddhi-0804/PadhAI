import React, { useState, useEffect } from 'react';
import {
  HelpCircle,
  Send,
  Sparkles,
  RotateCcw,
  BookOpen,
  AlertCircle,
  Clock,
  History,
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { doubtsService } from '../../services/doubtsService';
import {
  DoubtResponse,
  AnswerMode,
  DetectedIntent,
} from '../../types/doubts';
import { UnderstoodHeader } from '../ask/UnderstoodHeader';
import { ClarificationPrompt } from '../ask/ClarificationPrompt';
import { AnnotationAnswerCard } from '../ask/AnnotationAnswerCard';
import { Skeleton } from '../ui/Skeleton';
import { Button } from '../ui/Button';
import { Tag } from '../ui/Tag';

interface AskViewProps {
  onTriggerToast: (title: string, desc?: string, type?: 'info' | 'success' | 'correction') => void;
}

export const AskView: React.FC<AskViewProps> = ({ onTriggerToast }) => {
  const { t, language } = useLanguage();

  const [questionInput, setQuestionInput] = useState<string>('');
  const [currentResponse, setCurrentResponse] = useState<DoubtResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [lastAskedQuestion, setLastAskedQuestion] = useState<string>('');
  const [history, setHistory] = useState<DoubtResponse[]>([]);
  const [showHistory, setShowHistory] = useState<boolean>(false);

  useEffect(() => {
    setHistory(doubtsService.getHistory());
  }, []);

  const handleAsk = async (
    questionToAsk: string,
    mode: AnswerMode = 'simple',
    detectedOverride?: DetectedIntent
  ) => {
    const q = questionToAsk.trim();
    if (!q) return;

    setError('');
    setIsLoading(true);
    setLastAskedQuestion(q);

    try {
      const resp = await doubtsService.askDoubt(q, mode, detectedOverride);
      setCurrentResponse(resp);
      setHistory(doubtsService.getHistory());
      setIsLoading(false);
    } catch (err: any) {
      setError(err?.message || 'Failed to generate answer. Check offline connection.');
      setIsLoading(false);
    }
  };

  const handleModeChange = (newMode: AnswerMode) => {
    if (!currentResponse) return;
    handleAsk(currentResponse.question, newMode, currentResponse.detected);
  };

  const handleUnderstoodUpdate = (newDetected: DetectedIntent) => {
    if (!currentResponse) return;
    onTriggerToast(
      'Understanding Calibrated',
      `Re-running answer in ${newDetected.language === 'hi' ? 'Hindi' : 'English'} for ${newDetected.topic}.`,
      'info'
    );
    handleAsk(currentResponse.question, currentResponse.mode, newDetected);
  };

  const handleSelectClarification = (option: string) => {
    const refinedQ = `${currentResponse?.question || lastAskedQuestion} (${option})`;
    setQuestionInput(refinedQ);
    handleAsk(refinedQ, currentResponse?.mode || 'simple');
  };

  const sampleSuggestions = [
    {
      label: language === 'hi' ? 'लेंस मेकर सूत्र और चिह्न परिपाटी' : "Lens Maker's Formula & Sign Convention",
      query: language === 'hi' ? 'लेंस मेकर सूत्र क्या है? उभयोत्तल लेंस के लिए इसे कैसे सिद्ध करते हैं?' : "Explain the Lens Maker's Formula and how to apply it for an equiconvex lens.",
    },
    {
      label: language === 'hi' ? 'त्याग अनुपात (AS-26) लेखांकन' : 'Sacrificing Ratio in Partnership (AS-26)',
      query: language === 'hi' ? 'नए साझेदार के आने पर त्याग अनुपात क्यों निकालते हैं? ख्याति का क्या नियम है?' : 'Why is the sacrificing ratio calculated upon the admission of a partner under AS-26?',
    },
    {
      label: language === 'hi' ? 'निवेश गुणक की कार्यप्रणाली' : 'Investment Multiplier (k) in Macroeconomics',
      query: language === 'hi' ? 'निवेश गुणक (k) राष्ट्रीय आय को कैसे बढ़ाता है? सूत्र क्या है?' : 'How does the investment multiplier (k = 1/MPS) expand national income in macroeconomics?',
    },
  ];

  return (
    <div className="w-full text-left space-y-6">
      {/* Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono-time uppercase text-[var(--marigold-accent)] font-semibold">
            UNDERSTAND-FIRST PIPELINE
          </span>
          <h2 className="font-serif-title text-2xl font-bold text-[var(--ink-primary)]">
            {t.nav.ask}
          </h2>
          <p className="text-xs text-[var(--ink-muted)] mt-0.5">
            Ask in Hindi, Hinglish, or English. All answers are cited from your uploaded notes.
          </p>
        </div>

        {history.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowHistory(!showHistory)}
            className="gap-1.5 self-start sm:self-auto text-xs"
          >
            <History className="w-3.5 h-3.5" />
            <span>{showHistory ? 'Hide History' : `Doubt History (${history.length})`}</span>
          </Button>
        )}
      </div>

      {/* Input inquiry bar */}
      <div className="p-4 rounded-sm border border-[var(--paper-border)] bg-[var(--paper-card)] shadow-[var(--paper-shadow-sm)]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAsk(questionInput, 'simple');
          }}
          className="flex flex-col sm:flex-row gap-2.5"
        >
          <div className="flex-1 relative">
            <input
              type="text"
              value={questionInput}
              onChange={(e) => setQuestionInput(e.target.value)}
              placeholder={
                language === 'hi'
                  ? 'अपनी नोटबुक से सवाल पूछें (उदा. "सर ने लेंस मेकर सूत्र में n21 क्यों लिखा?")...'
                  : 'Ask from your notebook (e.g. "Why is n21 used in the lens maker equation?")...'
              }
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[var(--paper-elevated)] text-[var(--ink-primary)] border border-[var(--paper-border)] rounded-sm focus:outline-none focus:ring-1 focus:ring-[var(--marigold-accent)]"
            />
          </div>

          <Button
            type="submit"
            variant="marigold"
            disabled={isLoading || !questionInput.trim()}
            isLoading={isLoading}
            className="gap-2 shrink-0 font-semibold text-xs sm:text-sm"
          >
            <Send className="w-4 h-4" />
            <span>{language === 'hi' ? 'हल खोजें' : 'Ask Notes'}</span>
          </Button>
        </form>

        {/* Suggestion Chips */}
        <div className="mt-3 pt-3 border-t border-[var(--paper-rule)] flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-[10px] font-mono-time uppercase text-[var(--ink-muted)] mr-1">
            Try syllabus queries:
          </span>
          {sampleSuggestions.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setQuestionInput(s.query);
                handleAsk(s.query, 'simple');
              }}
              className="px-2.5 py-1 text-[11px] rounded-xs border border-[var(--paper-border)] bg-[var(--paper-card)] hover:border-[var(--marigold-accent)] hover:text-[var(--marigold-accent)] text-[var(--ink-secondary)] transition-colors cursor-pointer"
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading state (ruined paper shimmer) */}
      {isLoading && (
        <div className="p-6 rounded-sm border border-[var(--paper-border)] bg-[var(--paper-card)] space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono-time text-[var(--marigold-accent)]">
            <span className="inline-block w-2 h-2 rounded-full bg-[var(--marigold-accent)] animate-ping" />
            <span>UNDERSTAND-FIRST PIPELINE: Detecting language, gathering notes & calibrating response...</span>
          </div>
          <Skeleton lines={4} />
        </div>
      )}

      {/* Error state with Retry button */}
      {error && !isLoading && (
        <div className="p-4 rounded-sm border border-[var(--brick-red-border)] bg-[var(--brick-red-light)] text-left flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[var(--brick-red)]">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <Button
            variant="brick"
            size="sm"
            onClick={() => handleAsk(lastAskedQuestion, currentResponse?.mode || 'simple')}
            className="gap-1.5 self-start sm:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </Button>
        </div>
      )}

      {/* Active Doubt Response Display */}
      {currentResponse && !isLoading && (
        <div className="space-y-3">
          {/* 1. Editable "What I understood" line */}
          <UnderstoodHeader
            detected={currentResponse.detected}
            onUpdate={handleUnderstoodUpdate}
            isLoading={isLoading}
          />

          {/* 2. Clarifying question with tappable options if ambiguous */}
          {currentResponse.clarification && (
            <ClarificationPrompt
              clarification={currentResponse.clarification}
              onSelectOption={handleSelectClarification}
            />
          )}

          {/* 3. Annotation Answer Card */}
          <AnnotationAnswerCard
            response={currentResponse}
            onModeChange={handleModeChange}
            isLoadingMode={isLoading}
          />
        </div>
      )}

      {/* Doubt History List */}
      {showHistory && history.length > 0 && (
        <div className="p-5 rounded-sm border border-[var(--paper-border)] bg-[var(--paper-card)] space-y-3">
          <div className="flex items-center justify-between border-b border-[var(--paper-rule)] pb-2">
            <span className="text-xs font-mono-time uppercase text-[var(--marigold-accent)] font-semibold">
              Recent Doubt Inquiries ({history.length})
            </span>
          </div>
          <div className="space-y-2">
            {history.map((h, i) => (
              <div
                key={i}
                onClick={() => setCurrentResponse(h)}
                className="p-3 rounded-xs border border-[var(--paper-border)] bg-[var(--paper-elevated)] hover:border-[var(--marigold-accent)] cursor-pointer text-left transition-colors flex items-center justify-between"
              >
                <div>
                  <h4 className="font-serif-title text-sm font-semibold text-[var(--ink-primary)]">
                    {h.question}
                  </h4>
                  <span className="text-[10px] font-mono-time text-[var(--ink-muted)]">
                    {h.detected.topic} • Confidence: {h.confidence}
                  </span>
                </div>
                <Tag variant="neutral" size="sm">
                  {h.mode.toUpperCase()}
                </Tag>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
