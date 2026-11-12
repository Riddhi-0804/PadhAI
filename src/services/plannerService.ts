import {
  SM2Flashcard,
  SM2Rating,
  StudyPlanConfig,
  DayScheduleItem,
  StampBadge,
  LeaderboardStudent,
} from '../types/engagement';

const FLASHCARDS_STORAGE_KEY = 'padhai_sm2_flashcards';
const PLANNER_STORAGE_KEY = 'padhai_study_plan';
const ENGAGEMENT_STORAGE_KEY = 'padhai_engagement_stats';

// Realistic initial flashcards with local Indian analogies (cricket, chai, auto-rickshaw)
export const INITIAL_FLASHCARDS: SM2Flashcard[] = [
  {
    id: 'fc_physics_01',
    user_id: 'usr_student_01',
    subject: 'Physics',
    chapter: 'Ray Optics',
    front: 'What is the Lens Maker Formula and its sign convention?',
    back: '1/f = (n₂₁ - 1) × (1/R₁ - 1/R₂)\nWhere R₁ is positive for convex surface facing left and R₂ is negative.',
    bilingual_analogy: '🏏 Cricket Analogy: When a ball transitions from smooth pitch to lush outfield grass, one side slows down first, bending its path towards the normal.',
    next_review: new Date().toISOString(),
    interval_days: 1,
    repetition_count: 1,
    ease_factor: 2.5,
    source_citation: 'Class 12 Physics Notes • Page 2, §3',
  },
  {
    id: 'fc_physics_02',
    user_id: 'usr_student_01',
    subject: 'Physics',
    chapter: 'Ray Optics',
    front: 'Why does light bend towards the normal when going from rarer to denser medium?',
    back: 'Speed of light decreases in denser medium (v = c/n). Wavefronts compress and tilt according to Huygens principle.',
    bilingual_analogy: '🛺 Auto-Rickshaw Analogy: An auto entering muddy roadside shoulder slows down on the left wheel, turning the steering sharply into the mud.',
    next_review: new Date().toISOString(),
    interval_days: 1,
    repetition_count: 0,
    ease_factor: 2.5,
    source_citation: 'Class 12 Physics Notes • Page 1, §1',
  },
  {
    id: 'fc_chem_01',
    user_id: 'usr_student_01',
    subject: 'Chemistry',
    chapter: 'Electrochemistry',
    front: 'State Kohlrausch’s Law of Independent Migration of Ions.',
    back: 'Limiting molar conductivity of an electrolyte can be represented as the sum of individual contributions of anion and cation: Λ°ₘ = ν₊λ°₊ + ν₋λ°₋',
    bilingual_analogy: '☕ Cutting Chai Analogy: The richness of boiling cutting chai equals the separate flavor strength of tea leaves plus ginger plus buffalo milk boiled individually.',
    next_review: new Date(Date.now() + 86400000).toISOString(),
    interval_days: 2,
    repetition_count: 2,
    ease_factor: 2.6,
    source_citation: 'Class 12 Chemistry Notes • Page 4, §2',
  },
  {
    id: 'fc_accounts_01',
    user_id: 'usr_student_01',
    subject: 'Accountancy',
    chapter: 'Partnership',
    front: 'What is Gaining Ratio on Retirement of a Partner?',
    back: 'Gaining Ratio = New Ratio - Old Ratio.\nUsed to compensate the retiring partner for goodwill paid by continuing partners.',
    bilingual_analogy: '🛺 Shared Auto Analogy: When 1 passenger gets down from a 3-passenger auto, the remaining 2 passengers split the empty seat space in proportion to their legroom.',
    next_review: new Date(Date.now() - 3600000).toISOString(),
    interval_days: 1,
    repetition_count: 1,
    ease_factor: 2.4,
    source_citation: 'Accountancy Notes • Page 1, §Goodwill',
  },
];

// Initial 14-day study plan before CBSE Class 12 Boards
const INITIAL_PLAN: StudyPlanConfig = {
  id: 'plan_cbse_2025_01',
  target_exam: 'CBSE Class 12 Boards',
  exam_date: '2025-03-04',
  days_remaining: 18,
  daily_goal_minutes: 120,
  schedule: [
    {
      day_number: 1,
      date_formatted: '15 Feb (Sat)',
      date_iso: '2025-02-15',
      subject: 'Physics',
      chapter: 'Ray Optics & Optical Instruments',
      target_topics: ['Refraction at spherical surfaces', 'Lens maker formula derivation', 'Sign convention practice'],
      numerical_count: 6,
      daily_minutes: 120,
      is_completed: true,
      is_missed: false,
    },
    {
      day_number: 2,
      date_formatted: '16 Feb (Sun)',
      date_iso: '2025-02-16',
      subject: 'Physics',
      chapter: 'Wave Optics',
      target_topics: ['Huygens wavefront principle', 'Young double slit fringe width', 'Diffraction minima'],
      numerical_count: 5,
      daily_minutes: 110,
      is_completed: false,
      is_missed: true, // Missed day for demonstration of replan feature
    },
    {
      day_number: 3,
      date_formatted: '17 Feb (Mon)',
      date_iso: '2025-02-17',
      subject: 'Chemistry',
      chapter: 'Electrochemistry',
      target_topics: ['Nernst equation calculations', 'Kohlrausch law numericals', 'Fuel cells'],
      numerical_count: 7,
      daily_minutes: 120,
      is_completed: false,
      is_missed: false,
    },
    {
      day_number: 4,
      date_formatted: '18 Feb (Tue)',
      date_iso: '2025-02-18',
      subject: 'Chemistry',
      chapter: 'Chemical Kinetics',
      target_topics: ['Rate law and order of reaction', 'Half-life derivations', 'Arrhenius equation'],
      numerical_count: 8,
      daily_minutes: 130,
      is_completed: false,
      is_missed: false,
    },
    {
      day_number: 5,
      date_formatted: '19 Feb (Wed)',
      date_iso: '2025-02-19',
      subject: 'Mathematics',
      chapter: 'Integrals',
      target_topics: ['Integration by parts', 'Partial fraction decomposition', 'Definite integrals properties'],
      numerical_count: 12,
      daily_minutes: 140,
      is_completed: false,
      is_missed: false,
    },
    {
      day_number: 6,
      date_formatted: '20 Feb (Thu)',
      date_iso: '2025-02-20',
      subject: 'Mathematics',
      chapter: 'Differential Equations',
      target_topics: ['Variable separable method', 'Homogeneous DE', 'Linear differential equations'],
      numerical_count: 9,
      daily_minutes: 120,
      is_completed: false,
      is_missed: false,
    },
    {
      day_number: 7,
      date_formatted: '21 Feb (Fri)',
      date_iso: '2025-02-21',
      subject: 'Physics',
      chapter: 'Full Syllabus Mock Test #1',
      target_topics: ['CBSE 2024 Sample Paper', 'Section C & D Numerical practice', 'Red-ink error log revision'],
      numerical_count: 15,
      daily_minutes: 180,
      is_completed: false,
      is_missed: false,
    },
  ],
};

export const INITIAL_BADGES: StampBadge[] = [
  {
    id: 'badge_chai_calculus',
    title: 'Chai & Calculus',
    title_hi: 'चाय और कलन',
    description: '5 consecutive study mornings before 8:00 AM without skipping.',
    unlocked: true,
    unlocked_date: 'Yesterday',
    ink_color: 'marigold',
    icon_name: 'Coffee',
  },
  {
    id: 'badge_red_ink_survivor',
    title: 'Red Ink Survivor',
    title_hi: 'लाल स्याही विजेता',
    description: 'Targeted and solved 3 weak topics until accuracy reached 80%+.',
    unlocked: true,
    unlocked_date: '3 days ago',
    ink_color: 'brick',
    icon_name: 'Flame',
  },
  {
    id: 'badge_zero_spoiler',
    title: 'Zero Spoiler Master',
    title_hi: 'धैर्य साधक',
    description: 'Paused lecture at 2:00 and predicted formula without clicking "Show me anyway".',
    unlocked: true,
    unlocked_date: 'Today',
    ink_color: 'ink',
    icon_name: 'ShieldCheck',
  },
  {
    id: 'badge_night_owl',
    title: '100 Numericals Club',
    title_hi: 'शतक अभ्यास',
    description: 'Solved 100 physics & maths numericals extracted from notebook pages.',
    unlocked: false,
    unlocked_date: undefined,
    ink_color: 'ink',
    icon_name: 'Target',
  },
];

export const INITIAL_LEADERBOARD: LeaderboardStudent[] = [
  {
    rank: 1,
    name: 'Priya Iyer',
    exam: 'CBSE 12th (Physics 92%)',
    streak_days: 14,
    xp: 1820,
    is_current_user: false,
    mastery_badge: 'Chai & Calculus',
  },
  {
    rank: 2,
    name: 'Arjun Sharma',
    exam: 'CBSE 12th (Physics 84%)',
    streak_days: 5,
    xp: 1450,
    is_current_user: true,
    mastery_badge: 'Zero Spoiler Master',
  },
  {
    rank: 3,
    name: 'Kabir Mehta',
    exam: 'CBSE 12th (Physics 78%)',
    streak_days: 4,
    xp: 1180,
    is_current_user: false,
    mastery_badge: 'Red Ink Survivor',
  },
  {
    rank: 4,
    name: 'Ananya Sen',
    exam: 'CBSE 12th (Physics 76%)',
    streak_days: 3,
    xp: 940,
    is_current_user: false,
    mastery_badge: 'Novice Thinker',
  },
];

export const plannerService = {
  // Flashcards (SM-2)
  getFlashcards(): SM2Flashcard[] {
    const raw = localStorage.getItem(FLASHCARDS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(FLASHCARDS_STORAGE_KEY, JSON.stringify(INITIAL_FLASHCARDS));
      return INITIAL_FLASHCARDS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_FLASHCARDS;
    }
  },

  getDueFlashcards(): SM2Flashcard[] {
    const cards = this.getFlashcards();
    const now = new Date();
    // Return cards where next_review is in the past or today
    return cards.filter((c) => new Date(c.next_review) <= now);
  },

  reviewFlashcard(cardId: string, rating: SM2Rating): SM2Flashcard {
    const cards = this.getFlashcards();
    const idx = cards.findIndex((c) => c.id === cardId);
    if (idx === -1) {
      throw new Error(`Card ${cardId} not found`);
    }

    const card = cards[idx];
    let newInterval = card.interval_days;
    let newReps = card.repetition_count;

    // SM-2 Ease Factor calculation
    // q is 1-4 mapped to 2-5
    const q = rating + 1;
    let newEf = card.ease_factor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
    newEf = Math.max(1.3, Number(newEf.toFixed(2)));

    if (rating === 1) {
      // Again
      newReps = 0;
      newInterval = 1;
    } else if (rating === 2) {
      // Hard
      newReps += 1;
      newInterval = Math.max(1, Math.round(card.interval_days * 1.2));
    } else if (rating === 3) {
      // Good
      if (newReps === 0) newInterval = 1;
      else if (newReps === 1) newInterval = 3;
      else newInterval = Math.round(card.interval_days * newEf);
      newReps += 1;
    } else {
      // Easy
      if (newReps === 0) newInterval = 2;
      else if (newReps === 1) newInterval = 6;
      else newInterval = Math.round(card.interval_days * newEf * 1.3);
      newReps += 1;
    }

    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + newInterval);

    const updatedCard: SM2Flashcard = {
      ...card,
      repetition_count: newReps,
      interval_days: newInterval,
      ease_factor: newEf,
      next_review: nextDate.toISOString(),
    };

    cards[idx] = updatedCard;
    localStorage.setItem(FLASHCARDS_STORAGE_KEY, JSON.stringify(cards));

    // Award +20 XP on card review
    this.addXP(20);

    return updatedCard;
  },

  createFlashcard(card: Omit<SM2Flashcard, 'id' | 'next_review' | 'interval_days' | 'repetition_count' | 'ease_factor'>): SM2Flashcard {
    const cards = this.getFlashcards();
    const newCard: SM2Flashcard = {
      ...card,
      id: `fc_${Date.now()}`,
      next_review: new Date().toISOString(),
      interval_days: 1,
      repetition_count: 0,
      ease_factor: 2.5,
    };
    cards.unshift(newCard);
    localStorage.setItem(FLASHCARDS_STORAGE_KEY, JSON.stringify(cards));
    this.addXP(30);
    return newCard;
  },

  autoGenerateFromNotesAndDoubts(): number {
    const cards = this.getFlashcards();
    const newCards: SM2Flashcard[] = [
      {
        id: `fc_auto_${Date.now()}_1`,
        user_id: 'usr_student_01',
        subject: 'Physics',
        chapter: 'Ray Optics',
        front: 'What happens to the focal length of a glass lens when immersed in water?',
        back: 'The focal length increases (approx 4 times). Since relative refractive index n_w decreases, 1/f = (n_rel - 1)(1/R1 - 1/R2) decreases, making f larger.',
        bilingual_analogy: '🏏 Cricket Analogy: Bowling in heavy dew reduces ball grip and friction, so the trajectory deviates much less.',
        next_review: new Date().toISOString(),
        interval_days: 1,
        repetition_count: 0,
        ease_factor: 2.5,
        source_citation: 'Lecture Doubt at 02:00 • Ray Optics',
      },
      {
        id: `fc_auto_${Date.now()}_2`,
        user_id: 'usr_student_01',
        subject: 'Physics',
        chapter: 'Ray Optics',
        front: 'Why does a convex lens behave as a diverging lens inside carbon disulphide (CS2)?',
        back: 'Because CS2 has a higher refractive index (1.63) than crown glass (1.5). Hence (n_rel - 1) becomes negative, inverting the power of the lens.',
        bilingual_analogy: '🛺 Rickshaw Analogy: When surrounding traffic moves faster than your rickshaw, you appear to move backwards.',
        next_review: new Date().toISOString(),
        interval_days: 1,
        repetition_count: 0,
        ease_factor: 2.5,
        source_citation: 'Class 12 Physics Notes • Page 3, §Special Cases',
      },
    ];

    const merged = [...newCards, ...cards];
    localStorage.setItem(FLASHCARDS_STORAGE_KEY, JSON.stringify(merged));
    this.addXP(50);
    return newCards.length;
  },

  // Study Planner
  getStudyPlan(): StudyPlanConfig {
    const raw = localStorage.getItem(PLANNER_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(PLANNER_STORAGE_KEY, JSON.stringify(INITIAL_PLAN));
      return INITIAL_PLAN;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_PLAN;
    }
  },

  toggleDayComplete(dayNumber: number): StudyPlanConfig {
    const plan = this.getStudyPlan();
    const day = plan.schedule.find((d) => d.day_number === dayNumber);
    if (day) {
      day.is_completed = !day.is_completed;
      if (day.is_completed) {
        day.is_missed = false;
        this.addXP(40);
      }
      localStorage.setItem(PLANNER_STORAGE_KEY, JSON.stringify(plan));
    }
    return plan;
  },

  replanRemainingDays(): { plan: StudyPlanConfig; message: string } {
    const plan = this.getStudyPlan();
    const missedDays = plan.schedule.filter((d) => d.is_missed);
    const uncompletedFutureDays = plan.schedule.filter((d) => !d.is_completed && !d.is_missed);

    if (missedDays.length === 0) {
      return { plan, message: 'All scheduled days are up to date! No missed days to redistribute.' };
    }

    // Collect missed topics
    const missedTopics: string[] = [];
    missedDays.forEach((m) => {
      missedTopics.push(...m.target_topics);
      m.is_missed = false;
      m.target_topics = [`[Buffer Replaced] ${m.target_topics[0] || 'Topic'} (Redistributed)`];
    });

    // Distribute evenly across uncompleted future days
    if (uncompletedFutureDays.length > 0) {
      uncompletedFutureDays.forEach((day, i) => {
        const topicToAbsorb = missedTopics[i % missedTopics.length];
        if (topicToAbsorb) {
          day.target_topics.push(`↻ Catch-up: ${topicToAbsorb}`);
          day.daily_minutes += 15; // Smooth 15-minute adjustment instead of backlog anxiety
        }
      });
    }

    localStorage.setItem(PLANNER_STORAGE_KEY, JSON.stringify(plan));
    this.addXP(25);

    return {
      plan,
      message: `Missed topics redistributed across ${uncompletedFutureDays.length} remaining study days (+15 min/day buffer). Zero backlog panic.`,
    };
  },

  // Streaks, XP & Badges
  getEngagement() {
    const raw = localStorage.getItem(ENGAGEMENT_STORAGE_KEY);
    const defaultStats = {
      streak: 5,
      xp: 1450,
      badges: INITIAL_BADGES,
      leaderboard: INITIAL_LEADERBOARD,
    };
    if (!raw) {
      localStorage.setItem(ENGAGEMENT_STORAGE_KEY, JSON.stringify(defaultStats));
      return defaultStats;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return defaultStats;
    }
  },

  addXP(amount: number) {
    const engagement = this.getEngagement();
    engagement.xp += amount;
    // Update user rank if appropriate
    const userInLeaderboard = engagement.leaderboard.find((s: LeaderboardStudent) => s.is_current_user);
    if (userInLeaderboard) {
      userInLeaderboard.xp = engagement.xp;
    }
    localStorage.setItem(ENGAGEMENT_STORAGE_KEY, JSON.stringify(engagement));
  },
};
