import React, { useState, useEffect } from 'react';
import {
  Video,
  Clock,
  ShieldCheck,
  BookOpen,
  Sparkles,
  Play,
  RotateCcw,
  Zap,
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useBandwidth } from '../../context/BandwidthContext';
import { VideoLecture, TranscriptChunk, PauseDoubtResult } from '../../types/lectures';
import { lecturesService } from '../../services/lecturesService';
import { LecturePlayer } from '../lecture/LecturePlayer';
import { PauseDoubtModal } from '../lecture/PauseDoubtModal';
import { MarginNotesPanel } from '../lecture/MarginNotesPanel';
import { PredictBeforePlay } from '../lecture/PredictBeforePlay';
import { Tag } from '../ui/Tag';
import { Button } from '../ui/Button';

interface LecturesViewProps {
  onTriggerToast: (title: string, desc?: string, type?: 'info' | 'success' | 'correction') => void;
}

export const LecturesView: React.FC<LecturesViewProps> = ({ onTriggerToast }) => {
  const { language } = useLanguage();
  const { isLowBandwidth } = useBandwidth();

  const [video, setVideo] = useState<VideoLecture | null>(null);
  const [transcript, setTranscript] = useState<TranscriptChunk[]>([]);
  const [currentTime, setCurrentTime] = useState<number>(120); // Defaults to 02:00 pause point
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Doubts and so-far summary
  const [doubts, setDoubts] = useState<PauseDoubtResult[]>([]);
  const [soFarSummary, setSoFarSummary] = useState<string>('');
  const [isDoubtModalOpen, setIsDoubtModalOpen] = useState<boolean>(false);
  const [isSolving, setIsSolving] = useState<boolean>(false);
  const [showPredictPrompt, setShowPredictPrompt] = useState<boolean>(false);

  useEffect(() => {
    loadLecture();
  }, []);

  const loadLecture = async () => {
    const data = await lecturesService.getVideo('vid_physics_rayoptics_01');
    setVideo(data.video);
    setTranscript(data.transcript);
    updateSoFarSummary(120, data.transcript);
  };

  const updateSoFarSummary = (t: number, chunks: TranscriptChunk[]) => {
    const taught = chunks.filter((c) => c.end_time <= t);
    if (taught.length === 0) {
      setSoFarSummary('Lecture has just commenced; introductory concepts are being defined by Sir.');
    } else {
      const titles = taught.map((c) => c.section_title);
      setSoFarSummary(`Concepts taught up to this minute: ${titles.join(', ')}.`);
    }
  };

  const handleTimeChange = (newTime: number) => {
    setCurrentTime(newTime);
    updateSoFarSummary(newTime, transcript);
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      // Pausing
      setIsPlaying(false);
      setShowPredictPrompt(true);
    } else {
      // Resuming
      setIsPlaying(true);
      setShowPredictPrompt(false);
    }
  };

  const handleSubmitDoubt = async (doubtText: string) => {
    if (!video) return;
    setIsSolving(true);

    try {
      const result = await lecturesService.askPauseDoubt({
        videoId: video.id,
        timestampSeconds: currentTime,
        doubt: doubtText,
        language,
      });

      setDoubts((prev) => [result, ...prev]);
      if (result.taught_summary) {
        setSoFarSummary(result.taught_summary);
      }
      setIsSolving(false);
      setShowPredictPrompt(true);

      onTriggerToast(
        result.outcome === 'answered_later' ? 'Doubt Protected (No Spoiler)' : 'Margin Note Recorded',
        result.outcome === 'answered_later'
          ? `Sir explains this at ${result.timestamp}. Hint added to margin notes.`
          : 'Answer generated using strictly taught material.',
        result.outcome === 'answered_later' ? 'info' : 'success'
      );
    } catch {
      setIsSolving(false);
    }
  };

  const handleRevealAnyway = (doubtId: string) => {
    setDoubts((prev) =>
      prev.map((d) => {
        if (d.doubt_id === doubtId) {
          return {
            ...d,
            revealed_anyway: true,
            answer:
              language === 'hi'
                ? `**[स्पॉइलर रिवील किया गया]:**\nलेंस मेकर सूत्र: \`1/f = (n₂₁ - 1) × [1/R₁ - 1/R₂]\`\n(ध्यान दें: यह व्युत्पत्ति 04:45 पर विस्तृत रूप से आएगी)।`
                : `**[Revealed early upon student request]:**\nLens Maker's Formula: \`1/f = (n21 - 1) * [1/R1 - 1/R2]\`\n(Note: Sir derives this step-by-step at 04:45).`,
          };
        }
        return d;
      })
    );
    onTriggerToast('Spoiler Revealed', 'Full formula displayed from future timestamp.', 'correction');
  };

  const handleMakeFlashcard = (doubt: PauseDoubtResult) => {
    const card = lecturesService.saveFlashcard({
      front: doubt.hint || doubt.answer?.slice(0, 100) || 'Ray Optics Pause Point',
      back: doubt.answer || doubt.hint || 'Refraction Formula Review',
      subject: video?.subject || 'Physics',
      sourceTimestamp: doubt.timestamp_formatted,
    });

    onTriggerToast(
      'Flashcard Created',
      `Saved active recall card from timestamp [${doubt.timestamp_formatted}].`,
      'success'
    );
  };

  if (!video) {
    return <div className="p-8 text-center text-xs font-mono-time">Loading lecture workspace...</div>;
  }

  return (
    <div className="w-full text-left space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Tag variant="marigold">TIMESTAMP-LOCKED CLASSROOM</Tag>
            <span className="text-xs font-mono-time text-[var(--ink-muted)]">
              {video.subject} • {video.chapter}
            </span>
          </div>
          <h2 className="font-serif-title text-2xl font-bold text-[var(--ink-primary)]">
            {video.title}
          </h2>
          <p className="text-xs text-[var(--ink-muted)] mt-0.5">
            Faculty: {video.teacher_name} • Duration: 07:00
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono-time text-[var(--marigold-accent)] bg-[var(--marigold-light)] border border-[var(--marigold-border)] px-3 py-1.5 rounded-sm">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>Zero-Spoiler Lookahead Guard Active</span>
        </div>
      </div>

      {/* Low-Bandwidth Mode Callout */}
      {isLowBandwidth && (
        <div className="p-3.5 rounded-sm bg-[var(--marigold-light)] border border-[var(--marigold-border)] flex items-center justify-between gap-3 text-xs text-[var(--ink-primary)]">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[var(--marigold-accent)] shrink-0" />
            <span>
              <strong>Low-Bandwidth (2G Text-First) Mode Active:</strong> Streaming video preview is paused to conserve cellular data. Audio, synchronized transcript timestamps, and pause-point doubts remain 100% functional.
            </span>
          </div>
        </div>
      )}

      {/* Two Column Layout: Video Player on Left, Margin Notes on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Player & Predict Prompt (7 cols on desktop) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <LecturePlayer
            video={video}
            transcript={transcript}
            currentTime={currentTime}
            isPlaying={isPlaying}
            onTimeChange={handleTimeChange}
            onTogglePlay={handleTogglePlay}
            onOpenDoubtModal={() => setIsDoubtModalOpen(true)}
          />

          {/* Predict Before You Play Prompt (shown when paused) */}
          {showPredictPrompt && !isPlaying && (
            <PredictBeforePlay
              currentTime={currentTime}
              onConfirmResume={() => {
                setIsPlaying(true);
                setShowPredictPrompt(false);
              }}
            />
          )}
        </div>

        {/* Right Column: Margin Notes Panel (5 cols on desktop, stacked below on mobile) */}
        <div className="lg:col-span-5 w-full">
          <MarginNotesPanel
            doubts={doubts}
            soFarSummary={soFarSummary}
            onMakeFlashcard={handleMakeFlashcard}
            onRevealAnyway={handleRevealAnyway}
          />
        </div>
      </div>

      {/* Pause Doubt Modal (Typed & Voice Input) */}
      <PauseDoubtModal
        isOpen={isDoubtModalOpen}
        onClose={() => setIsDoubtModalOpen(false)}
        timestampSeconds={currentTime}
        onSubmitDoubt={handleSubmitDoubt}
        isLoading={isSolving}
      />
    </div>
  );
};
