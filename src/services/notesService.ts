import { Note, NoteChunk, SearchResult } from '../types/notes';

const SEED_NOTES: Note[] = [
  {
    id: 'note_phy_01',
    user_id: 'usr_student_01',
    title: 'Ch 09 Ray Optics - Spherical Refraction & Lens Maker’s Formula',
    subject: 'Physics',
    chapter_num: 9,
    content: `--- Page 1 ---
### 1. Refraction at Spherical Surfaces
When light refracts from a medium of refractive index n1 into a medium of refractive index n2 across a spherical surface of radius R:
Formula: n2/v - n1/u = (n2 - n1)/R
Sign Convention: Light travels from left to right. All distances measured from the pole. Distances opposite to incident ray are negative.
Assumptions:
1. The aperture of the spherical surface is very small compared to radius R.
2. The object is a point object situated on the principal axis.
3. Incident, refracted, and normal rays make small angles with the principal axis.

--- Page 2 ---
### 2. Lens Maker's Formula
Relates focal length f with refractive index μ and radii of curvature R1, R2:
Formula: 1/f = (n21 - 1) * [1/R1 - 1/R2]
Where n21 = n2 / n1 (refractive index of lens material w.r.t surrounding medium).
Special Case (Equiconvex lens): R1 = +R, R2 = -R
1/f = (μ - 1) * [1/R - (-1/R)] = 2(μ - 1) / R => f = R / [2(μ - 1)]

--- Page 3 ---
### 3. Total Internal Reflection (TIR)
Condition: Light travels from optically denser medium to optically rarer medium at an angle of incidence greater than the critical angle (i > ic).
Formula: sin(ic) = 1 / μ (relative to rarer medium).
Applications in CBSE syllabus:
- Optical fibres (core μ1 > cladding μ2).
- Totally reflecting prisms (45°-90°-45°).
- Sparkling of diamond.`,
    page_count: 3,
    chunks_count: 3,
    created_at: '2025-02-10T14:30:00Z',
  },
  {
    id: 'note_acc_01',
    user_id: 'usr_student_01',
    title: 'Ch 03 Partnership - Admission of a Partner & Revaluation Account',
    subject: 'Accountancy',
    chapter_num: 3,
    content: `--- Page 1 ---
### 1. New Profit Sharing Ratio & Sacrificing Ratio
On admission of a new partner C for a given share (e.g. 1/4th):
Let total firm share = 1. Remaining share for existing partners = 1 - 1/4 = 3/4.
Sacrificing Ratio = Old Profit Share - New Profit Share.
Purpose: Sacrificing ratio is used exclusively to distribute Premium for Goodwill brought in by the incoming partner.

--- Page 2 ---
### 2. Treatment of Goodwill (Under AS-26)
Accounting Standard 26 states purchased goodwill alone can be shown on balance sheet.
In cash:
Bank A/c Dr. To Premium for Goodwill A/c.
Premium for Goodwill A/c Dr. To Sacrificing Partners' Capital A/cs (in Sacrificing Ratio).

--- Page 3 ---
### 3. Revaluation Account (Profit & Loss Adjustment A/c)
Nominal account in nature:
- DEBIT: Decrease in asset values, increase in liabilities, unrecorded liabilities.
- CREDIT: Increase in asset values, decrease in liabilities, unrecorded assets.
Balance: Profit or loss on revaluation is transferred to Old Partners' Capital Accounts in their Old Profit Sharing Ratio.`,
    page_count: 3,
    chunks_count: 3,
    created_at: '2025-02-08T10:15:00Z',
  },
  {
    id: 'note_eco_01',
    user_id: 'usr_student_01',
    title: 'Ch 04 Macroeconomics - Aggregate Demand & Investment Multiplier',
    subject: 'Economics',
    chapter_num: 4,
    content: `--- Page 1 ---
### 1. Aggregate Demand (AD) Components in a 2-Sector Economy
AD = C + I (Consumption + Autonomous Investment)
Consumption Function: C = c_bar + bY, where:
- c_bar = Autonomous consumption at zero national income
- b = Marginal Propensity to Consume (MPC = ΔC / ΔY)
- Y = National Income
Since MPC + MPS = 1, MPS = 1 - b.

--- Page 2 ---
### 2. Investment Multiplier (k) Mechanism
Definition: The number of times change in national income exceeds initial change in investment expenditure.
Formula: k = ΔY / ΔI = 1 / (1 - MPC) = 1 / MPS.
Working mechanism: Initial injection of investment produces a multiplier expansion through successive rounds of consumption spending until the leakage into savings equals fresh investment.`,
    page_count: 2,
    chunks_count: 2,
    created_at: '2025-02-05T09:00:00Z',
  },
];

class NotesService {
  private notes: Note[] = [];

  constructor() {
    const saved = localStorage.getItem('padhai_notes_cache');
    if (saved) {
      try {
        this.notes = JSON.parse(saved);
      } catch {
        this.notes = [...SEED_NOTES];
      }
    } else {
      this.notes = [...SEED_NOTES];
      this.saveCache();
    }
  }

  private saveCache() {
    localStorage.setItem('padhai_notes_cache', JSON.stringify(this.notes));
  }

  async getNotes(subject?: string): Promise<Note[]> {
    if (!subject || subject.toLowerCase() === 'all') {
      return [...this.notes];
    }
    return this.notes.filter(
      (n) => n.subject.toLowerCase() === subject.toLowerCase()
    );
  }

  async getNoteById(id: string): Promise<{ note: Note; chunks: NoteChunk[] } | null> {
    const note = this.notes.find((n) => n.id === id);
    if (!note) return null;

    const chunks = this.extractChunks(note);
    return { note, chunks };
  }

  private extractChunks(note: Note): NoteChunk[] {
    const pages = note.content.split(/(?:---|===)?\s*page\s*(\d+)[\s:=-]*\n?/i);
    const chunks: NoteChunk[] = [];
    let chunkIndex = 0;

    if (pages.length > 1) {
      let i = 1;
      while (i < pages.length) {
        const pageNum = parseInt(pages[i], 10) || 1;
        const pageText = pages[i + 1] || '';
        const sections = pageText.split('\n\n').filter((s) => s.trim());

        let currentHeading = `${note.subject} - Page ${pageNum}`;
        sections.forEach((sec) => {
          const headingMatch = sec.match(/^(?:#+|\d+\.)\s*([^\n]+)/);
          if (headingMatch) {
            currentHeading = headingMatch[1].trim();
          }
          chunks.push({
            id: `chk_${note.id}_${chunkIndex}`,
            note_id: note.id,
            page_number: pageNum,
            chunk_index: chunkIndex,
            content: sec.trim(),
            heading: currentHeading,
          });
          chunkIndex++;
        });
        i += 2;
      }
    } else {
      const paras = note.content.split('\n\n').filter((p) => p.trim());
      paras.forEach((p, idx) => {
        chunks.push({
          id: `chk_${note.id}_${idx}`,
          note_id: note.id,
          page_number: Math.floor(idx / 2) + 1,
          chunk_index: idx,
          content: p.trim(),
          heading: `Section ${idx + 1}`,
        });
      });
    }

    return chunks;
  }

  async uploadTypedNote(payload: {
    title: string;
    subject: string;
    chapter_num: number;
    content: string;
    userId?: string;
  }): Promise<Note> {
    const pageMatches = payload.content.match(/page\s*\d+/gi);
    const pageCount = pageMatches ? Math.max(1, pageMatches.length) : Math.max(1, Math.ceil(payload.content.split('\n\n').length / 2));

    const newNote: Note = {
      id: `note_${Date.now()}`,
      user_id: payload.userId || 'usr_student_01',
      title: payload.title,
      subject: payload.subject,
      chapter_num: payload.chapter_num || 1,
      content: payload.content,
      page_count: pageCount,
      chunks_count: Math.max(1, payload.content.split('\n\n').length),
      created_at: new Date().toISOString(),
    };

    this.notes.unshift(newNote);
    this.saveCache();
    return newNote;
  }

  async deleteNote(id: string): Promise<boolean> {
    const initialLen = this.notes.length;
    this.notes = this.notes.filter((n) => n.id !== id);
    if (this.notes.length !== initialLen) {
      this.saveCache();
      return true;
    }
    return false;
  }

  async searchNotes(query: string, subject?: string): Promise<SearchResult[]> {
    const cleanQ = query.toLowerCase().trim();
    if (!cleanQ) return [];

    const results: SearchResult[] = [];
    const targetNotes = subject && subject.toLowerCase() !== 'all'
      ? this.notes.filter((n) => n.subject.toLowerCase() === subject.toLowerCase())
      : this.notes;

    for (const note of targetNotes) {
      const chunks = this.extractChunks(note);
      for (const chunk of chunks) {
        const text = chunk.content.toLowerCase();
        const heading = chunk.heading.toLowerCase();
        let score = 0;

        if (heading.includes(cleanQ)) score += 0.95;
        if (text.includes(cleanQ)) score += 0.82;
        
        // Word matches
        const qWords = cleanQ.split(/\s+/);
        const matchCount = qWords.filter((w) => text.includes(w) || heading.includes(w)).length;
        if (matchCount > 0) {
          score += (matchCount / qWords.length) * 0.4;
        }

        if (score > 0.4) {
          results.push({
            chunk_id: chunk.id,
            note_id: note.id,
            page_number: chunk.page_number,
            heading: chunk.heading,
            content: chunk.content,
            similarity: Math.min(0.99, Math.round(score * 100) / 100),
          });
        }
      }
    }

    results.sort((a, b) => b.similarity - a.similarity);
    return results.slice(0, 6);
  }
}

export const notesService = new NotesService();
