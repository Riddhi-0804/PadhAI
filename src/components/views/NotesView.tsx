import React, { useState, useEffect } from 'react';
import {
  BookMarked,
  UploadCloud,
  Search,
  X,
  Filter,
  Sparkles,
  Layers,
  FileCheck2,
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { Note, NoteChunk, SearchResult } from '../../types/notes';
import { notesService } from '../../services/notesService';
import { NoteCard } from '../notes/NoteCard';
import { NoteUploadModal } from '../notes/NoteUploadModal';
import { NoteViewerModal } from '../notes/NoteViewerModal';
import { Tabs } from '../ui/Tabs';
import { Button } from '../ui/Button';
import { Tag } from '../ui/Tag';
import { EmptyState } from '../ui/EmptyState';

interface NotesViewProps {
  onTriggerToast: (title: string, desc?: string, type?: 'info' | 'success' | 'correction') => void;
}

export const NotesView: React.FC<NotesViewProps> = ({ onTriggerToast }) => {
  const { t, language } = useLanguage();

  const [notes, setNotes] = useState<Note[]>([]);
  const [activeSubject, setActiveSubject] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  // Modals state
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);
  const [viewingNote, setViewingNote] = useState<Note | null>(null);
  const [viewingChunks, setViewingChunks] = useState<NoteChunk[]>([]);

  useEffect(() => {
    loadNotes();
  }, [activeSubject]);

  const loadNotes = async () => {
    const list = await notesService.getNotes(activeSubject);
    setNotes(list);
  };

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setSearchQuery(q);
    if (!q.trim()) {
      setSearchResults([]);
      return;
    }
    const results = await notesService.searchNotes(q, activeSubject);
    setSearchResults(results);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleOpenViewer = async (note: Note) => {
    const detail = await notesService.getNoteById(note.id);
    if (detail) {
      setViewingNote(detail.note);
      setViewingChunks(detail.chunks);
    }
  };

  const handleDelete = async (noteId: string) => {
    const success = await notesService.deleteNote(noteId);
    if (success) {
      onTriggerToast(
        language === 'hi' ? 'नोटबुक हटाई गई' : 'Note Deleted',
        'Removed from SQLite and Vector DB index.',
        'correction'
      );
      loadNotes();
    }
  };

  const handleUploadSuccess = (newNote: Note) => {
    onTriggerToast(
      language === 'hi' ? 'नोट्स इंडेक्स हुए' : 'Notebook Indexed',
      `Indexed ${newNote.page_count} pages with vector embeddings.`,
      'success'
    );
    loadNotes();
  };

  const subjectTabs = [
    { id: 'all', label: language === 'hi' ? 'सभी विषय' : 'All Subjects' },
    { id: 'physics', label: language === 'hi' ? 'भौतिक विज्ञान (Physics)' : 'Physics' },
    { id: 'accountancy', label: language === 'hi' ? 'लेखाशास्त्र (Accounts)' : 'Accountancy' },
    { id: 'economics', label: language === 'hi' ? 'अर्थशास्त्र (Economics)' : 'Economics' },
    { id: 'chemistry', label: language === 'hi' ? 'रसायन विज्ञान (Chemistry)' : 'Chemistry' },
  ];

  return (
    <div className="w-full text-left space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono-time uppercase text-[var(--marigold-accent)] font-semibold">
            GROUND-TRUTH REPOSITORY
          </span>
          <h2 className="font-serif-title text-2xl font-bold text-[var(--ink-primary)]">
            {t.nav.notes}
          </h2>
          <p className="text-xs text-[var(--ink-muted)] mt-0.5">
            Student notes with page numbers & section headings indexed into the Vector DB.
          </p>
        </div>

        <Button
          variant="marigold"
          onClick={() => setIsUploadOpen(true)}
          className="gap-2 self-start sm:self-auto font-semibold"
        >
          <UploadCloud className="w-4 h-4" />
          <span>{t.emptyStates.notes.action}</span>
        </Button>
      </div>

      {/* Search Bar with Search Hit Counter */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ink-muted)]" />
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder={
            language === 'hi'
              ? 'नोट्स और सूत्रों में खोजें (उदा. "Lens Maker", "Goodwill AS-26", "Multiplier")...'
              : 'Search notes by keyword or formula (e.g. "Lens Maker", "Goodwill AS-26", "Multiplier")...'
          }
          className="w-full pl-9 pr-9 py-2.5 text-xs sm:text-sm bg-[var(--paper-card)] text-[var(--ink-primary)] border border-[var(--paper-border)] rounded-sm focus:outline-none focus:ring-1 focus:ring-[var(--marigold-accent)]"
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--ink-muted)] hover:text-[var(--ink-primary)] p-0.5 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Vector Search Matches Preview (When user is searching) */}
      {searchQuery.trim() && (
        <div className="p-4 rounded-sm border border-[var(--marigold-border)] bg-[var(--marigold-light)] space-y-2">
          <div className="flex items-center justify-between text-xs font-mono-time text-[var(--marigold-accent)] font-semibold">
            <span className="flex items-center gap-1.5">
              <FileCheck2 className="w-4 h-4" />
              <span>Vector DB Semantic Matches ({searchResults.length})</span>
            </span>
            <span className="text-[10px] text-[var(--ink-muted)]">
              Cosine Similarity Ranking
            </span>
          </div>

          {searchResults.length === 0 ? (
            <p className="text-xs text-[var(--ink-muted)]">
              No direct vector chunks match "{searchQuery}".
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {searchResults.map((hit) => (
                <div
                  key={hit.chunk_id}
                  onClick={() => {
                    const matchedNote = notes.find((n) => n.id === hit.note_id);
                    if (matchedNote) handleOpenViewer(matchedNote);
                  }}
                  className="p-2.5 rounded-xs bg-[var(--paper-card)] border border-[var(--paper-border)] hover:border-[var(--marigold-accent)] cursor-pointer text-left transition-colors"
                >
                  <div className="flex items-center justify-between text-[10px] font-mono-time mb-1">
                    <span className="font-semibold text-[var(--ink-primary)]">
                      {hit.heading}
                    </span>
                    <span className="text-[var(--marigold-accent)] font-bold">
                      {(hit.similarity * 100).toFixed(0)}% Match
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--ink-secondary)] line-clamp-2 leading-relaxed">
                    {hit.content}
                  </p>
                  <span className="text-[9px] font-mono-time text-[var(--ink-muted)] block mt-1">
                    Found on Page {hit.page_number}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Subject Filter Tabs */}
      <Tabs
        tabs={subjectTabs}
        activeTab={activeSubject}
        onChange={setActiveSubject}
      />

      {/* Notes Grid or Empty State */}
      {notes.length === 0 ? (
        <EmptyState
          categoryTag={activeSubject.toUpperCase()}
          icon={<BookMarked className="w-6 h-6" />}
          title={t.emptyStates.notes.title}
          description={t.emptyStates.notes.description}
          actionLabel={t.emptyStates.notes.action}
          onAction={() => setIsUploadOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onOpenViewer={handleOpenViewer}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Upload Modal (PDF / Images with OCR / Typed Text) */}
      <NoteUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSuccess={handleUploadSuccess}
      />

      {/* Page-by-Page Note Viewer Modal */}
      <NoteViewerModal
        note={viewingNote}
        chunks={viewingChunks}
        isOpen={!!viewingNote}
        onClose={() => setViewingNote(null)}
      />
    </div>
  );
};
