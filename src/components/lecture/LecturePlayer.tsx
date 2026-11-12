import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  Clock,
  HelpCircle,
  Video,
  Info,
} from 'lucide-react';
import { VideoLecture, TranscriptChunk } from '../../types/lectures';
import { Tag } from '../ui/Tag';
import { Button } from '../ui/Button';

interface LecturePlayerProps {
  video: VideoLecture;
  transcript: TranscriptChunk[];
  currentTime: number;
  isPlaying: boolean;
  onTimeChange: (time: number) => void;
  onTogglePlay: () => void;
  onOpenDoubtModal: () => void;
}

export const LecturePlayer: React.FC<LecturePlayerProps> = ({
  video,
  transcript,
  currentTime,
  isPlaying,
  onTimeChange,
  onTogglePlay,
  onOpenDoubtModal,
}) => {
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const activeChunk = transcript.find(
    (c) => currentTime >= c.start_time && currentTime < c.end_time
  ) || transcript[0];

  const quickJumps = [
    { label: '00:30 (Intro)', time: 30 },
    { label: '01:45 (Single Surface)', time: 105 },
    { label: '02:00 (Pause Point)', time: 120 },
    { label: '04:45 (Lens Maker)', time: 285 },
    { label: '05:50 (Equiconvex)', time: 350 },
  ];

  return (
    <div className="w-full flex flex-col gap-3 text-left">
      {/* 16:9 Video Canvas Container */}
      <div className="relative aspect-video w-full rounded-sm bg-[#0E131F] border border-[var(--paper-border)] overflow-hidden flex flex-col justify-between p-4 shadow-[var(--paper-shadow-lift)] select-none">
        {/* Top Video Header */}
        <div className="flex items-center justify-between gap-2 z-10">
          <div className="flex items-center gap-2">
            <Tag variant="marigold" size="sm">
              {video.subject.toUpperCase()}
            </Tag>
            <span className="text-[11px] font-mono-time text-[#E2E8F0]">
              {video.chapter} • {video.teacher_name}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] font-mono-time text-[#94A3B8] bg-black/40 px-2 py-0.5 rounded-xs">
            <Info className="w-3 h-3 text-[var(--marigold-accent)]" />
            <span>TRANSCRIPT-SYNCED (NO FRAME UI)</span>
          </div>
        </div>

        {/* Center Blackboard Area with Live Transcript Stream */}
        <div className="my-auto text-center px-4 sm:px-8 z-10">
          <span className="text-[11px] font-mono-time text-[var(--marigold-accent)] block mb-1">
            CLASSROOM LECTURE BOARD // {activeChunk?.section_title}
          </span>
          <p className="font-serif-title text-base sm:text-lg text-white font-medium italic leading-relaxed max-w-xl mx-auto">
            "{activeChunk?.text}"
          </p>
        </div>

        {/* Pause Doubt Callout Overlay when Paused */}
        {!isPlaying && (
          <div className="absolute inset-0 bg-black/55 backdrop-blur-[2px] flex flex-col items-center justify-center p-4 z-20 animate-in fade-in">
            <div className="p-4 rounded-sm border border-[var(--marigold-border)] bg-[var(--paper-card)] text-[var(--ink-primary)] max-w-md w-full shadow-lg text-center space-y-3">
              <div className="flex items-center justify-center gap-1.5 text-xs font-mono-time text-[var(--marigold-accent)] font-semibold">
                <Clock className="w-4 h-4" />
                <span>PAUSED AT {formatTime(currentTime)}</span>
              </div>

              <h4 className="font-serif-title text-base font-bold text-[var(--ink-primary)]">
                Stuck on this derivation step or formula?
              </h4>

              <p className="text-xs text-[var(--ink-secondary)]">
                Ask a question now. The AI will explain strictly up to {formatTime(currentTime)} without spoiling later formulas.
              </p>

              <div className="flex items-center justify-center gap-3 pt-1">
                <Button
                  variant="marigold"
                  onClick={onOpenDoubtModal}
                  className="gap-2 font-semibold text-xs"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>I Have a Doubt at {formatTime(currentTime)}</span>
                </Button>

                <Button
                  variant="outline"
                  onClick={onTogglePlay}
                  className="gap-1.5 text-xs"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Resume Play</span>
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Playback Control Bar */}
        <div className="flex flex-col gap-2 z-10 pt-2">
          {/* Scrubber Line */}
          <div className="relative w-full flex items-center">
            <input
              type="range"
              min={0}
              max={video.duration_seconds}
              value={currentTime}
              onChange={(e) => onTimeChange(Number(e.target.value))}
              className="w-full h-1.5 bg-[#334155] rounded-xs appearance-none cursor-pointer accent-[var(--marigold-accent)]"
            />
          </div>

          <div className="flex items-center justify-between text-white text-xs">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onTogglePlay}
                className="p-1.5 rounded-xs bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>

              <span className="font-mono-time text-[11px] text-[#CBD5E1]">
                {formatTime(currentTime)} / {formatTime(video.duration_seconds)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onOpenDoubtModal}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xs bg-[var(--marigold-accent)] hover:bg-[var(--marigold-hover)] text-white text-xs font-semibold cursor-pointer transition-colors"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Pause & Ask</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Jump Timeline Ribbon */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs">
        <span className="text-[10px] font-mono-time uppercase text-[var(--ink-muted)] mr-1">
          Jump to key points:
        </span>
        {quickJumps.map((jump) => (
          <button
            key={jump.time}
            type="button"
            onClick={() => onTimeChange(jump.time)}
            className={`px-2.5 py-1 rounded-xs border text-[11px] font-mono-time transition-colors cursor-pointer ${
              Math.abs(currentTime - jump.time) < 10
                ? 'border-[var(--marigold-accent)] bg-[var(--marigold-light)] text-[var(--marigold-accent)] font-semibold'
                : 'border-[var(--paper-border)] bg-[var(--paper-card)] text-[var(--ink-secondary)] hover:border-[var(--ink-muted)]'
            }`}
          >
            {jump.label}
          </button>
        ))}
      </div>
    </div>
  );
};
