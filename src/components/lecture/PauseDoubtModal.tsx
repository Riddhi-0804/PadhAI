import React, { useState, useEffect } from 'react';
import {
  X,
  Mic,
  MicOff,
  Send,
  Clock,
  Sparkles,
  HelpCircle,
  AlertCircle,
  Volume2,
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { Button } from '../ui/Button';
import { Tag } from '../ui/Tag';

interface PauseDoubtModalProps {
  isOpen: boolean;
  onClose: () => void;
  timestampSeconds: number;
  onSubmitDoubt: (doubt: string) => void;
  isLoading?: boolean;
}

export const PauseDoubtModal: React.FC<PauseDoubtModalProps> = ({
  isOpen,
  onClose,
  timestampSeconds,
  onSubmitDoubt,
  isLoading = false,
}) => {
  const { language } = useLanguage();
  const [doubtText, setDoubtText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(true);
  const [speechError, setSpeechError] = useState('');

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      setVoiceSupported(false);
    }
  }, []);

  if (!isOpen) return null;

  const handleStartVoice = () => {
    setSpeechError('');
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechError('Web Speech API is not supported in this browser. Please type your doubt.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setDoubtText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        setIsListening(false);
        setSpeechError(`Voice input error: ${event.error}. You can type below.`);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err: any) {
      setIsListening(false);
      setSpeechError(err?.message || 'Failed to start microphone.');
    }
  };

  const testSuggestions = [
    {
      outcome: 'A (Answer Now)',
      text: 'What does the difference (n2 - n1) mean in the refraction equation?',
      desc: 'Taught at 01:15',
    },
    {
      outcome: 'B (Answered Later)',
      text: "What is the final Lens Maker's formula for two surfaces combined?",
      desc: 'Taught at 04:45 • Lookahead guard',
    },
    {
      outcome: 'C (Not Covered)',
      text: "How does a compound microscope's eyepiece magnify the image?",
      desc: 'Extra Concept • Tagged outside lecture',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doubtText.trim()) return;
    onSubmitDoubt(doubtText.trim());
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-xs animate-in fade-in"
    >
      <div className="relative w-full max-w-xl bg-[var(--paper-card)] border border-[var(--paper-border)] shadow-[var(--paper-shadow-lift)] rounded-sm p-6 text-left max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[var(--ink-muted)] hover:text-[var(--ink-primary)] p-1 cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Timestamp in Monospace */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <Tag variant="marigold" size="sm">
              PAUSE POINT
            </Tag>
            <span className="text-xs font-mono-time font-bold text-[var(--ink-primary)] bg-[var(--marigold-light)] border border-[var(--marigold-border)] px-2 py-0.5 rounded-xs">
              AT {formatTime(timestampSeconds)}
            </span>
          </div>
          <h2 className="font-serif-title text-xl font-bold text-[var(--ink-primary)]">
            Ask Your Doubt Without Spoilers
          </h2>
          <p className="text-xs text-[var(--ink-muted)] mt-0.5">
            The AI knows what Sir explained up to {formatTime(timestampSeconds)}. If Sir answers it later, you will be given a hint and the exact timestamp.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <textarea
              rows={4}
              value={doubtText}
              onChange={(e) => setDoubtText(e.target.value)}
              placeholder={
                language === 'hi'
                  ? `यहाँ अपना सवाल लिखें या बोलें (उदा. "सर ने n2-n1 क्यों लिखा?")...`
                  : `Type or speak your doubt at ${formatTime(timestampSeconds)}...`
              }
              className="w-full p-3 text-xs sm:text-sm bg-[var(--paper-elevated)] text-[var(--ink-primary)] border border-[var(--paper-border)] rounded-sm focus:outline-none focus:ring-1 focus:ring-[var(--marigold-accent)] leading-relaxed"
              required
            />

            {/* Voice Input Button (Web Speech API) */}
            <div className="absolute right-2.5 bottom-3 flex items-center gap-2">
              {voiceSupported && (
                <button
                  type="button"
                  onClick={handleStartVoice}
                  className={`p-1.5 rounded-xs border text-xs flex items-center gap-1 transition-colors cursor-pointer ${
                    isListening
                      ? 'bg-[var(--brick-red)] text-white border-[var(--brick-red)] animate-pulse'
                      : 'bg-[var(--paper-card)] text-[var(--ink-secondary)] border-[var(--paper-border)] hover:border-[var(--marigold-accent)]'
                  }`}
                  title="Speak doubt (Web Speech API)"
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-mono-time">
                    {isListening ? (language === 'hi' ? 'सुन रहे हैं...' : 'Listening...') : 'Voice'}
                  </span>
                </button>
              )}
            </div>
          </div>

          {speechError && (
            <p className="text-xs text-[var(--brick-red)] font-medium">{speechError}</p>
          )}

          {/* Test Suggestion Chips for the 3 Outcomes */}
          <div className="p-3 rounded-xs bg-[var(--paper-elevated)] border border-[var(--paper-border)] space-y-2">
            <span className="text-[10px] font-mono-time uppercase text-[var(--marigold-accent)] font-semibold block">
              Test the 3 Lecture Outcomes at {formatTime(timestampSeconds)}:
            </span>
            <div className="space-y-1.5">
              {testSuggestions.map((item, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setDoubtText(item.text)}
                  className="w-full text-left p-1.5 rounded-xs hover:bg-[var(--paper-card)] border border-transparent hover:border-[var(--paper-border)] transition-colors cursor-pointer flex items-center justify-between text-xs"
                >
                  <span className="text-[var(--ink-primary)] truncate max-w-[340px]">
                    {item.text}
                  </span>
                  <Tag
                    variant={i === 0 ? 'marigold' : i === 1 ? 'ink' : 'neutral'}
                    size="sm"
                  >
                    Outcome {item.outcome.charAt(0)}
                  </Tag>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="marigold"
              type="submit"
              disabled={isLoading || !doubtText.trim()}
              isLoading={isLoading}
              className="gap-2 font-semibold"
            >
              <Send className="w-4 h-4" />
              <span>Resolve at {formatTime(timestampSeconds)}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
