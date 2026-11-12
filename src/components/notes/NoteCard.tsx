import React from 'react';
import { BookOpen, Trash2, Layers, FileText } from 'lucide-react';
import { Note } from '../../types/notes';
import { Tag } from '../ui/Tag';

interface NoteCardProps {
  note: Note;
  onOpenViewer: (note: Note) => void;
  onDelete: (noteId: string) => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({
  note,
  onOpenViewer,
  onDelete,
}) => {
  return (
    <div className="p-4 rounded-sm border border-[var(--paper-border)] bg-[var(--paper-card)] hover:border-[var(--marigold-accent)] transition-all shadow-[var(--paper-shadow-sm)] flex flex-col justify-between text-left group">
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <Tag
            variant={
              note.subject.toLowerCase() === 'physics'
                ? 'marigold'
                : note.subject.toLowerCase() === 'accountancy'
                ? 'ink'
                : 'neutral'
            }
            size="sm"
          >
            {note.subject}
          </Tag>
          <span className="text-[10px] font-mono-time text-[var(--ink-muted)]">
            CH. {String(note.chapter_num).padStart(2, '0')}
          </span>
        </div>

        <h3
          onClick={() => onOpenViewer(note)}
          className="font-serif-title text-base font-semibold text-[var(--ink-primary)] leading-snug mb-2 line-clamp-2 cursor-pointer hover:text-[var(--marigold-accent)] transition-colors"
        >
          {note.title}
        </h3>

        <p className="text-xs text-[var(--ink-muted)] line-clamp-3 leading-relaxed mb-4">
          {note.content.replace(/--- Page \d+ ---|###/g, '').trim()}
        </p>
      </div>

      <div className="pt-3 border-t border-[var(--paper-rule)] flex items-center justify-between text-xs font-mono-time">
        <div className="flex items-center gap-2 text-[var(--ink-muted)] text-[11px]">
          <span className="flex items-center gap-1">
            <BookOpen className="w-3 h-3 text-[var(--marigold-accent)]" />
            <span>{note.page_count} {note.page_count === 1 ? 'Page' : 'Pages'}</span>
          </span>
          <span>•</span>
          <span>{note.chunks_count || note.page_count} Chunks</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onOpenViewer(note)}
            className="px-2 py-1 rounded-xs bg-[var(--paper-elevated)] hover:bg-[var(--marigold-light)] hover:text-[var(--marigold-accent)] text-[var(--ink-secondary)] text-[11px] font-medium transition-colors cursor-pointer"
          >
            Read
          </button>
          <button
            type="button"
            onClick={() => onDelete(note.id)}
            className="p-1 rounded-xs text-[var(--ink-muted)] hover:text-[var(--brick-red)] hover:bg-[var(--brick-red-light)] transition-colors cursor-pointer"
            title="Delete note"
            aria-label="Delete note"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
