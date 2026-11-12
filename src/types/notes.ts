export interface Note {
  id: string;
  user_id: string;
  title: string;
  subject: string;
  chapter_num: number;
  content: string;
  page_count: number;
  chunks_count?: number;
  created_at: string;
}

export interface NoteChunk {
  id: string;
  note_id: string;
  page_number: number;
  chunk_index: number;
  content: string;
  heading: string;
}

export interface SearchResult {
  chunk_id: string;
  note_id: string;
  page_number: number;
  heading: string;
  content: string;
  similarity: number;
}
