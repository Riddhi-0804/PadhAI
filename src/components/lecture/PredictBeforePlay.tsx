import React, { useState } from 'react';
import { Play, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { Tag } from '../ui/Tag';

interface PredictBeforePlayProps {
  onConfirmResume: () => void;
  currentTime: number;
}

export const PredictBeforePlay: React.FC<PredictBeforePlayProps> = ({
  onConfirmResume,
  currentTime,
}) => {
  const [showAnswer, setShowAnswer] = useState(false);

  // Dynamic prediction questions based on timeline
  const getPrediction = (t: number) => {
    if (t < 90) {
      return {
        q: "In Snell's ratio sin(i)/sin(r) = n2/n1, if light enters glass from air (n2 > n1), will the refracted angle r be smaller or larger than i?",
        a: "Smaller! Light bends towards the normal as it decelerates in an optically denser medium (n2 > n1)."
      };
    } else if (t < 200) {
      return {
        q: "In n2/v - n1/u = (n2 - n1)/R, if the surface is flat (plane interface, R = ∞), what does the equation simplify to?",
        a: "It simplifies to n2/v = n1/u, which gives apparent depth: v = (n2/n1) * u!"
      };
    } else {
      return {
        q: "If an equiconvex glass lens (n=1.5) is immersed in water (n=1.33), does its focal length increase or decrease?",
        a: "It increases roughly 4 times, because the optical density contrast (n2 - n1) is much smaller!"
      };
    }
  };

  const prediction = getPrediction(currentTime);

  return (
    <div className="p-3.5 rounded-sm border-2 border-[var(--marigold-border)] bg-[var(--marigold-light)] text-left space-y-2 animate-in fade-in">
      <div className="flex items-center justify-between text-xs font-mono-time">
        <span className="text-[var(--marigold-accent)] font-semibold flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>PREDICT BEFORE YOU PLAY</span>
        </span>
        <Tag variant="neutral" size="sm">ACTIVE RECALL CHECK</Tag>
      </div>

      <p className="font-serif-title text-xs sm:text-sm font-semibold text-[var(--ink-primary)] leading-snug">
        "{prediction.q}"
      </p>

      {showAnswer ? (
        <div className="p-2 rounded-xs bg-[var(--paper-card)] border border-[var(--paper-border)] text-xs text-[var(--ink-primary)]">
          <strong className="text-[var(--marigold-accent)]">Answer: </strong>
          <span>{prediction.a}</span>
        </div>
      ) : null}

      <div className="flex items-center justify-between pt-1">
        {!showAnswer ? (
          <button
            type="button"
            onClick={() => setShowAnswer(true)}
            className="text-[11px] font-mono-time text-[var(--marigold-accent)] hover:underline cursor-pointer"
          >
            Show prediction answer
          </button>
        ) : (
          <span className="text-[10px] font-mono-time text-[var(--ink-muted)]">
            Ready to resume playback!
          </span>
        )}

        <Button
          variant="marigold"
          size="sm"
          onClick={onConfirmResume}
          className="gap-1.5 text-xs font-semibold"
        >
          <Play className="w-3.5 h-3.5" />
          <span>Resume Lecture</span>
        </Button>
      </div>
    </div>
  );
};
