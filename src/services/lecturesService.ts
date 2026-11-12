import { VideoLecture, TranscriptChunk, PauseDoubtResult, LectureFlashcard } from '../types/lectures';

const SEED_VIDEO: VideoLecture = {
  id: 'vid_physics_rayoptics_01',
  title: "Refraction at Spherical Surfaces & Lens Maker's Formula",
  subject: 'Physics',
  chapter: 'Ch 09 Ray Optics',
  video_url: 'https://www.youtube.com/watch?v=sample_rayoptics_01',
  duration_seconds: 420,
  teacher_name: 'Dr. Rameshwar Sharma',
};

const SEED_TRANSCRIPT: TranscriptChunk[] = [
  {
    id: 'chk_tr_01',
    video_id: 'vid_physics_rayoptics_01',
    start_time: 0,
    end_time: 75,
    section_title: 'Introduction to Curved Optical Interfaces',
    text: "In today's session of Ray Optics, we move beyond flat plane mirrors and examine what happens when light enters curved glass boundaries. Remember Snell's law: sin i divided by sin r equals n2 by n1.",
  },
  {
    id: 'chk_tr_02',
    video_id: 'vid_physics_rayoptics_01',
    start_time: 75,
    end_time: 150,
    section_title: 'Single Spherical Surface Refraction',
    text: 'For a single spherical surface separating medium 1 and medium 2, the relation is: n2/v - n1/u = (n2 - n1)/R. Notice the right hand side: (n2 - n1)/R is the bending power across this single boundary. Later, at around 4:45, we combine two surfaces for the Lens Maker formula.',
  },
  {
    id: 'chk_tr_03',
    video_id: 'vid_physics_rayoptics_01',
    start_time: 150,
    end_time: 240,
    section_title: 'Sign Conventions and Paraxial Assumptions',
    text: 'CBSE assumptions: (1) Aperture of curved surface is small. (2) Object is a point object on principal axis. (3) All rays are paraxial with small angles.',
  },
  {
    id: 'chk_tr_04',
    video_id: 'vid_physics_rayoptics_01',
    start_time: 240,
    end_time: 345,
    section_title: "Derivation of the Lens Maker's Formula",
    text: 'Now comes combining two surfaces: Surface 1 gives image at v1. Surface 2 treats v1 as a virtual object. Adding equations cancels out n2/v1, yielding 1/f = (n21 - 1)(1/R1 - 1/R2).',
  },
  {
    id: 'chk_tr_05',
    video_id: 'vid_physics_rayoptics_01',
    start_time: 345,
    end_time: 420,
    section_title: 'Equiconvex Lens Case and Immersion Pitfalls',
    text: 'For an equiconvex lens, R1 = +R, R2 = -R => f = R / [2(n21 - 1)]. When dipped in water, relative refractive index drops, increasing focal length four times.',
  },
];

class LecturesService {
  private flashcards: LectureFlashcard[] = [];

  constructor() {
    const saved = localStorage.getItem('padhai_lecture_flashcards');
    if (saved) {
      try {
        this.flashcards = JSON.parse(saved);
      } catch {
        this.flashcards = [];
      }
    }
  }

  async getVideo(id: string = 'vid_physics_rayoptics_01'): Promise<{ video: VideoLecture; transcript: TranscriptChunk[] }> {
    try {
      const res = await fetch(`/api/lectures/${id}`);
      if (res.ok) {
        const data = await res.json();
        return {
          video: data.video,
          transcript: data.transcript_chunks,
        };
      }
    } catch {
      // Fallback
    }
    return { video: SEED_VIDEO, transcript: SEED_TRANSCRIPT };
  }

  async askPauseDoubt(payload: {
    videoId: string;
    timestampSeconds: number;
    doubt: string;
    language?: string;
  }): Promise<PauseDoubtResult> {
    try {
      const res = await fetch('/api/lectures/pause-doubt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          video_id: payload.videoId,
          timestamp_seconds: payload.timestampSeconds,
          doubt: payload.doubt,
          language: payload.language || 'en',
        }),
      });

      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    // Client-side execution of Step 5 logic
    return this.clientSolvePauseDoubt(payload);
  }

  private clientSolvePauseDoubt(payload: {
    videoId: string;
    timestampSeconds: number;
    doubt: string;
    language?: string;
  }): PauseDoubtResult {
    const t = payload.timestampSeconds;
    const dLower = payload.doubt.toLowerCase();
    const isHindi = payload.language === 'hi';
    const formattedTs = `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(Math.floor(t % 60)).padStart(2, '0')}`;

    // Filter chunks strictly where end_time <= t
    const taughtChunks = SEED_TRANSCRIPT.filter((c) => c.end_time <= t);
    const summary = taughtChunks.length > 0
      ? (isHindi
          ? `अब तक सर ने पढ़ाया: ${taughtChunks.map((c) => c.section_title).join(', ')}।`
          : `Topics taught so far: ${taughtChunks.map((c) => c.section_title).join(', ')}.`)
      : (isHindi ? 'लेक्चर अभी शुरू हुआ है; प्रारंभिक परिभाषाएं चल रही हैं।' : 'Lecture has just commenced.');

    // Outcome B: Answered later (e.g. asking about Lens Maker at 2:00 / 120s)
    if (dLower.includes('lens maker') || dLower.includes('two surfaces') || dLower.includes('1/f') || dLower.includes('लेंस मेकर')) {
      if (t < 240) {
        return {
          doubt_id: `dbt_${Date.now()}`,
          outcome: 'answered_later',
          answered_later: true,
          timestamp: '04:45',
          hint: isHindi
            ? 'सर ठीक 04:45 पर इस फ़ॉर्मूले की पूरी व्युत्पत्ति (Derivation) और दोनों पृष्ठों का संयोजन समझाने वाले हैं। अभी के लिए केवल एकल गोलीय पृष्ठ का सूत्र n₂/v - n₁/u = (n₂ - n₁)/R ध्यान में रखें!'
            : 'Sir explains this complete derivation and combines both curved surfaces at 04:45 in this lecture. For now, focus on mastering the single spherical surface relation n2/v - n1/u = (n2 - n1)/R and resume watching!',
          taught_summary: summary,
          timestamp_formatted: formattedTs,
        };
      }
    }

    // Outcome C: Not covered in this lecture
    if (dLower.includes('microscope') || dLower.includes('telescope') || dLower.includes('सूक्ष्मदर्शी') || dLower.includes('दूरदर्शी')) {
      return {
        doubt_id: `dbt_${Date.now()}`,
        outcome: 'not_covered',
        tag: 'extra_concept',
        answer: isHindi
          ? '**यह विषय इस लेक्चर में शामिल नहीं है (अतिरिक्त पाठ्यक्रम अवधारणा):**\nइस लेक्चर में केवल गोलीय पृष्ठों पर अपवर्तन पढ़ाया जा रहा है। संयुक्त सूक्ष्मदर्शी (Compound Microscope) एक प्रकाशीय यंत्र है जो दो अलग लेंसों से कोणीय आवर्धन उत्पन्न करता है।'
          : "**This topic is not covered in this lecture (Tagged as Extra Syllabus Concept):**\nThis lecture is strictly dedicated to refraction at spherical surfaces. The compound microscope is covered in Chapter 9, Part 2, using objective and eyepiece lenses.",
        source: 'General knowledge - not covered in this video lecture',
        taught_summary: summary,
        timestamp_formatted: formattedTs,
      };
    }

    // Outcome A: Answer now (Concept taught prior to timestamp t)
    return {
      doubt_id: `dbt_${Date.now()}`,
      outcome: 'answer_now',
      answer: isHindi
        ? `**${formattedTs} तक पढ़ाए गए भाग के अनुसार उत्तर:**\n\nसर ने बोर्ड पर \`n₂/v - n₁/u = (n₂ - n₁)/R\` लिखा है।\nदाएँ पक्ष पर \`(n₂ - n₁)\` दोनों माध्यमों के प्रकाशीय घनत्वों का अंतर (Difference in Optical Densities) दर्शाता है:\n- किरण विरल से सघन में जाने पर अभिलंब की ओर झुकती है।\n- अभी तक सर ने केवल एकल गोलीय पृष्ठ (Single Spherical Surface) समझाया है।`
        : `**Answer based strictly on what Sir taught up to ${formattedTs}:**\n\nOn the blackboard, Sir wrote \`n2/v - n1/u = (n2 - n1)/R\`.\nThe numerator \`(n2 - n1)\` represents the difference in optical densities between the two media:\n- Bending power is directly proportional to \`(n2 - n1)\` and inversely proportional to radius \`R\`.\n- Sir has solely addressed a single spherical boundary up to this second.`,
      confidence: 'High',
      source: `Lecture Video • Up to ${formattedTs}`,
      taught_summary: summary,
      timestamp_formatted: formattedTs,
    };
  }

  saveFlashcard(flashcard: { front: string; back: string; subject: string; sourceTimestamp: string }): LectureFlashcard {
    const card: LectureFlashcard = {
      id: `fc_${Date.now()}`,
      subject: flashcard.subject,
      front: flashcard.front,
      back: flashcard.back,
      source_timestamp: flashcard.sourceTimestamp,
      created_at: new Date().toISOString(),
    };
    this.flashcards.unshift(card);
    localStorage.setItem('padhai_lecture_flashcards', JSON.stringify(this.flashcards));
    return card;
  }

  getFlashcards(): LectureFlashcard[] {
    return [...this.flashcards];
  }
}

export const lecturesService = new LecturesService();
