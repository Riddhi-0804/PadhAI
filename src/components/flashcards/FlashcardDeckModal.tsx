import React, { useState } from 'react';
import { X, Layers, PlusCircle, Sparkles, BookOpen } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { plannerService } from '../../services/plannerService';

interface FlashcardDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (count: number) => void;
}

export const FlashcardDeckModal: React.FC<FlashcardDeckModalProps> = ({
  isOpen,
  onClose,
  onCreated,
}) => {
  const [tab, setTab] = useState<'create' | 'auto'>('auto');
  const [subject, setSubject] = useState('Physics');
  const [chapter, setChapter] = useState('Ray Optics');
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [analogy, setAnalogy] = useState('');
  const [sourceCitation, setSourceCitation] = useState('Class 12 Notes • Page 2');
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handleManualCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!front.trim() || !back.trim()) return;

    plannerService.createFlashcard({
      user_id: 'usr_student_01',
      subject,
      chapter,
      front,
      back,
      bilingual_analogy: analogy ? `💡 Analogy: ${analogy}` : undefined,
      source_citation: sourceCitation || 'My Notes',
    });

    onCreated(1);
    onClose();
  };

  const handleAutoGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const generated = plannerService.autoGenerateFromNotesAndDoubts();
      setIsGenerating(false);
      onCreated(generated);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-[var(--paper-bg)] border border-[var(--paper-border)] shadow-[var(--paper-shadow-lift)] rounded-sm p-6 text-left space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--paper-border)] pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[var(--marigold-accent)]" />
            <h3 className="font-serif-title text-lg font-bold text-[var(--ink-primary)]">
              Active Recall Flashcards
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[var(--ink-muted)] hover:text-[var(--ink-primary)] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex rounded-sm border border-[var(--paper-border)] p-1 bg-[var(--paper-elevated)] text-xs font-mono-time">
          <button
            onClick={() => setTab('auto')}
            className={`flex-1 py-1.5 px-3 rounded-[2px] transition-colors cursor-pointer ${
              tab === 'auto'
                ? 'bg-[var(--ink-primary)] text-[var(--paper-bg)] font-semibold'
                : 'text-[var(--ink-muted)] hover:text-[var(--ink-primary)]'
            }`}
          >
            Auto-Extract from Notes & Doubts
          </button>
          <button
            onClick={() => setTab('create')}
            className={`flex-1 py-1.5 px-3 rounded-[2px] transition-colors cursor-pointer ${
              tab === 'create'
                ? 'bg-[var(--ink-primary)] text-[var(--paper-bg)] font-semibold'
                : 'text-[var(--ink-muted)] hover:text-[var(--ink-primary)]'
            }`}
          >
            Create Custom Card
          </button>
        </div>

        {tab === 'auto' ? (
          <div className="space-y-4 py-2">
            <div className="p-4 rounded-sm border border-[var(--marigold-border)] bg-[var(--marigold-light)] space-y-2 text-xs">
              <span className="font-semibold text-[var(--marigold-accent)] font-mono-time uppercase text-[10px] block">
                Source Material Found
              </span>
              <p className="text-[var(--ink-primary)] leading-relaxed">
                PadhAI will scan your uploaded Ray Optics PDF notes and your saved lecture doubts
                (such as the Lens Maker Formula at 02:00) to create SM-2 spaced repetition cards.
              </p>
              <ul className="list-disc list-inside text-[var(--ink-muted)] text-[11px] space-y-1">
                <li>Extracts key definitions & formula sign conventions</li>
                <li>Appends cricket/chai/rickshaw local analogies</li>
                <li>Includes exact citation references to your note pages</li>
              </ul>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant="ink"
                size="sm"
                onClick={handleAutoGenerate}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  'Extracting Flashcards...'
                ) : (
                  <>
                    <BookOpen className="w-3.5 h-3.5 mr-1.5 text-[var(--marigold-accent)]" />
                    Extract & Add to SM-2 Deck
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleManualCreate} className="space-y-3 py-1 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-mono-time text-[var(--ink-muted)] mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-sm border border-[var(--paper-border)] bg-[var(--paper-card)] text-[var(--ink-primary)]"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono-time text-[var(--ink-muted)] mb-1">
                  Chapter
                </label>
                <input
                  type="text"
                  value={chapter}
                  onChange={(e) => setChapter(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-sm border border-[var(--paper-border)] bg-[var(--paper-card)] text-[var(--ink-primary)]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono-time text-[var(--ink-muted)] mb-1">
                Front (Question / Prompt)
              </label>
              <textarea
                value={front}
                onChange={(e) => setFront(e.target.value)}
                rows={2}
                placeholder="e.g. What is Brewster's Law for polarisation?"
                className="w-full px-2.5 py-1.5 text-xs rounded-sm border border-[var(--paper-border)] bg-[var(--paper-card)] text-[var(--ink-primary)] font-body"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono-time text-[var(--ink-muted)] mb-1">
                Back (Answer / Formula)
              </label>
              <textarea
                value={back}
                onChange={(e) => setBack(e.target.value)}
                rows={3}
                placeholder="e.g. μ = tan(ip). Reflected and refracted rays are perpendicular."
                className="w-full px-2.5 py-1.5 text-xs rounded-sm border border-[var(--paper-border)] bg-[var(--paper-card)] text-[var(--ink-primary)] font-body"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono-time text-[var(--ink-muted)] mb-1">
                Local Analogy / Mnemonic (Optional)
              </label>
              <input
                type="text"
                value={analogy}
                onChange={(e) => setAnalogy(e.target.value)}
                placeholder="e.g. Cricket pitch / Cutting chai / Auto rickshaw comparison"
                className="w-full px-2.5 py-1.5 text-xs rounded-sm border border-[var(--paper-border)] bg-[var(--paper-card)] text-[var(--ink-primary)]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono-time text-[var(--ink-muted)] mb-1">
                Notebook Citation
              </label>
              <input
                type="text"
                value={sourceCitation}
                onChange={(e) => setSourceCitation(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-sm border border-[var(--paper-border)] bg-[var(--paper-card)] text-[var(--ink-primary)] font-mono-time"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--paper-border)]">
              <Button variant="outline" size="sm" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button variant="marigold" size="sm" type="submit">
                <PlusCircle className="w-3.5 h-3.5 mr-1.5 text-white" />
                Add to Deck
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
