import React, { useState } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Layers,
  Calendar,
  CheckCircle2,
  Copy,
} from 'lucide-react';
import { Note, NoteChunk } from '../../types/notes';
import { Tag } from '../ui/Tag';
import { Button } from '../ui/Button';

interface NoteViewerModalProps {
  note: Note | null;
  chunks: NoteChunk[];
  isOpen: boolean;
  onClose: () => void;
}

export const NoteViewerModal: React.FC<NoteViewerModalProps> = ({
  note,
  chunks,
  isOpen,
  onClose,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  if (!isOpen || !note) return null;

  // Split content by page markers
  const pageSegments = note.content.split(/(?:---|===)?\s*page\s*(\d+)[\s:=-]*\n?/i);
  const parsedPages: { pageNum: number; content: string }[] = [];

  if (pageSegments.length > 1) {
    let i = 1;
    while (i < pageSegments.length) {
      parsedPages.push({
        pageNum: parseInt(pageSegments[i], 10) || parsedPages.length + 1,
        content: (pageSegments[i + 1] || '').trim(),
      });
      i += 2;
    }
  } else {
    parsedPages.push({
      pageNum: 1,
      content: note.content.trim(),
    });
  }

  const totalPages = Math.max(1, parsedPages.length);
  const activePageData = parsedPages.find((p) => p.pageNum === currentPage) || parsedPages[0];

  // Chunks on current page
  const pageChunks = chunks.filter((c) => c.page_number === currentPage);

  const handleCopy = () => {
    navigator.clipboard.writeText(activePageData.content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-xs animate-in fade-in"
    >
      <div className="relative w-full max-w-3xl bg-[var(--paper-card)] border border-[var(--paper-border)] shadow-[var(--paper-shadow-lift)] rounded-sm p-6 text-left max-h-[92vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[var(--ink-muted)] hover:text-[var(--ink-primary)] p-1 cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="border-b border-[var(--paper-rule)] pb-4 mb-4 pr-8">
          <div className="flex items-center gap-2 mb-1">
            <Tag variant="marigold" size="sm">
              {note.subject.toUpperCase()}
            </Tag>
            <span className="text-[11px] font-mono-time text-[var(--ink-muted)]">
              CHAPTER {String(note.chapter_num).padStart(2, '0')} • {totalPages} PAGES
            </span>
          </div>
          <h2 className="font-serif-title text-xl sm:text-2xl font-bold text-[var(--ink-primary)]">
            {note.title}
          </h2>
        </div>

        {/* Page Switcher Bar */}
        <div className="flex items-center justify-between bg-[var(--paper-elevated)] p-2.5 rounded-sm border border-[var(--paper-border)] mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono-time font-semibold text-[var(--ink-primary)]">
              PAGE {currentPage} OF {totalPages}
            </span>
            <span className="text-[10px] font-mono-time text-[var(--marigold-accent)] bg-[var(--marigold-light)] border border-[var(--marigold-border)] px-1.5 py-0.5 rounded-xs">
              {pageChunks.length} INDEXED CHUNKS
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="gap-1 text-xs"
            >
              <Copy className="w-3 h-3" />
              <span>{isCopied ? 'Copied' : 'Copy Page'}</span>
            </Button>

            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-xs border border-[var(--paper-border)] bg-[var(--paper-card)] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[var(--paper-elevated)] cursor-pointer"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4 text-[var(--ink-primary)]" />
            </button>

            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-xs border border-[var(--paper-border)] bg-[var(--paper-card)] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[var(--paper-elevated)] cursor-pointer"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4 text-[var(--ink-primary)]" />
            </button>
          </div>
        </div>

        {/* Notebook Ruled Page View */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          <div className="p-5 rounded-sm border border-[var(--paper-border)] bg-[var(--paper-bg)] notebook-margin-left pl-14 text-xs sm:text-sm text-[var(--ink-primary)] leading-relaxed whitespace-pre-wrap font-body shadow-[var(--paper-shadow-sm)]">
            <span
              aria-hidden="true"
              className="absolute left-6 top-5 text-[10px] font-mono-time text-[var(--brick-red)] opacity-70 select-none"
            >
              P.{currentPage}
            </span>
            {activePageData.content}
          </div>

          {/* Extracted Chunks Inspector */}
          {pageChunks.length > 0 && (
            <div className="mt-4 pt-3 border-t border-[var(--paper-rule)]">
              <span className="text-[10px] font-mono-time uppercase text-[var(--ink-muted)] block mb-2">
                Vector DB Chunks on Page {currentPage}
              </span>
              <div className="grid grid-cols-1 gap-2">
                {pageChunks.map((c) => (
                  <div
                    key={c.id}
                    className="p-2.5 rounded-xs border border-[var(--paper-border)] bg-[var(--paper-elevated)] text-left"
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono-time mb-1 text-[var(--marigold-accent)]">
                      <span className="font-semibold">{c.heading}</span>
                      <span className="text-[var(--ink-muted)]">CHUNK #{c.chunk_index + 1}</span>
                    </div>
                    <p className="text-[11px] text-[var(--ink-secondary)] line-clamp-2 leading-relaxed">
                      {c.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
