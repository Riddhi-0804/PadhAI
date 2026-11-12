import {
  TestQuestion,
  AnswerSubmission,
  TestResult,
  TopicStat,
  DifficultyLevel,
} from '../types/practice';

const DEFAULT_TOPIC_STATS: TopicStat[] = [
  {
    id: 'stat_01',
    subject: 'Physics',
    topic: 'Ray Optics - Spherical Refraction & Lenses',
    accuracy: 0.88,
    attempts_count: 25,
    last_practiced: '2025-02-11',
    is_weak: false,
  },
  {
    id: 'stat_02',
    subject: 'Physics',
    topic: 'Wave Optics - Huygens Principle',
    accuracy: 0.65,
    attempts_count: 14,
    last_practiced: '2025-02-10',
    is_weak: true,
  },
  {
    id: 'stat_03',
    subject: 'Accountancy',
    topic: 'Partnership - Goodwill & Revaluation',
    accuracy: 0.78,
    attempts_count: 18,
    last_practiced: '2025-02-09',
    is_weak: false,
  },
  {
    id: 'stat_04',
    subject: 'Economics',
    topic: 'Macroeconomics - Investment Multiplier',
    accuracy: 0.72,
    attempts_count: 9,
    last_practiced: '2025-02-08',
    is_weak: true,
  },
];

class PracticeService {
  private stats: TopicStat[] = [];
  private pastResults: TestResult[] = [];

  constructor() {
    const savedStats = localStorage.getItem('padhai_topic_stats');
    if (savedStats) {
      try {
        this.stats = JSON.parse(savedStats);
      } catch {
        this.stats = [...DEFAULT_TOPIC_STATS];
      }
    } else {
      this.stats = [...DEFAULT_TOPIC_STATS];
      this.saveStats();
    }

    const savedResults = localStorage.getItem('padhai_test_results');
    if (savedResults) {
      try {
        this.pastResults = JSON.parse(savedResults);
      } catch {
        this.pastResults = [];
      }
    }
  }

  private saveStats() {
    localStorage.setItem('padhai_topic_stats', JSON.stringify(this.stats));
  }

  private saveResults() {
    localStorage.setItem('padhai_test_results', JSON.stringify(this.pastResults));
  }

  async getStats(): Promise<{ stats: TopicStat[]; revise_these: TopicStat[]; average_accuracy: number }> {
    try {
      const res = await fetch('/api/practice/stats');
      if (res.ok) {
        const data = await res.json();
        this.stats = data.stats;
        this.saveStats();
        return data;
      }
    } catch {
      // Offline fallback
    }

    const revise_these = this.stats.filter((s) => s.accuracy < 0.75);
    const avg = this.stats.length
      ? Math.round((this.stats.reduce((acc, s) => acc + s.accuracy, 0) / this.stats.length) * 100) / 100
      : 0.75;

    return {
      stats: this.stats,
      revise_these,
      average_accuracy: avg,
    };
  }

  async generateTest(payload: {
    subject: string;
    difficulty: DifficultyLevel;
    is_mock_exam?: boolean;
    topicFilter?: string;
  }): Promise<{ test_id: string; questions: TestQuestion[]; difficulty_assigned: string }> {
    try {
      const res = await fetch('/api/practice/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: payload.subject,
          difficulty: payload.difficulty,
          is_mock_exam: !!payload.is_mock_exam,
          topic_filter: payload.topicFilter,
        }),
      });

      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Offline fallback
    }

    // Determine adaptive difficulty
    let assignedDiff = payload.difficulty;
    if (payload.difficulty === 'adaptive') {
      const avg = this.stats.length
        ? this.stats.reduce((acc, s) => acc + s.accuracy, 0) / this.stats.length
        : 0.75;
      assignedDiff = avg < 0.70 ? 'beginner' : (avg < 0.85 ? 'intermediate' : 'advanced');
    }

    const isPhysics = payload.subject.toLowerCase() === 'physics';
    const questions: TestQuestion[] = isPhysics
      ? [
          {
            id: 'q_phy_01',
            type: 'mcq',
            marks: 1,
            question: 'For refraction across a single spherical boundary from medium 1 to medium 2, what is the correct relation connecting u, v, and radius R?',
            question_hi: 'एकल गोलीय पृष्ठ पर माध्यम 1 से माध्यम 2 में अपवर्तन के लिए u, v और वक्रता त्रिज्या R में सही संबंध क्या है?',
            options: [
              'n2/v - n1/u = (n2 - n1)/R',
              'n1/v - n2/u = (n2 - n1)/R',
              '1/v - 1/u = 1/f',
              'n2/u - n1/v = (n1 - n2)/R',
            ],
            correct_option_index: 0,
            source_chunk_id: 'chk_phy_01',
            source_page: 1,
            source_section: '1. Refraction at Spherical Surfaces',
            rubric: ['Direct formula identification (1 Mark)'],
          },
          {
            id: 'q_phy_02',
            type: 'short',
            marks: 3,
            question: 'State the three essential assumptions made while deriving the refraction formula at a single spherical surface.',
            question_hi: 'एकल गोलीय पृष्ठ पर अपवर्तन सूत्र व्युत्पन्न करते समय मानी जाने वाली तीन मुख्य मान्यताएँ (Assumptions) लिखिए।',
            source_chunk_id: 'chk_phy_01',
            source_page: 1,
            source_section: '1. Refraction at Spherical Surfaces (Assumptions)',
            rubric: [
              'Aperture of surface is very small (1 Mark)',
              'Object is treated as a point on principal axis (1 Mark)',
              'Rays make small angles with normal (paraxial rays) (1 Mark)',
            ],
          },
          {
            id: 'q_phy_03',
            type: 'long',
            marks: 5,
            question: "State the Lens Maker's Formula. Show how it simplifies for an equiconvex lens of radius R, and explain why immersing the lens in water increases its focal length.",
            question_hi: 'लेंस मेकर सूत्र लिखिए। दर्शाइए कि यह R वक्रता त्रिज्या वाले उभयोत्तल लेंस के लिए कैसे सरल होता है, और पानी में डुबोने पर फोकस दूरी क्यों बढ़ती है?',
            source_chunk_id: 'chk_phy_02',
            source_page: 2,
            source_section: "2. Lens Maker's Formula & Equiconvex Case",
            rubric: [
              'Formula statement 1/f = (n21 - 1)(1/R1 - 1/R2) (1.5 Marks)',
              'Equiconvex substitution R1 = +R, R2 = -R yielding f = R / [2(n21 - 1)] (1.5 Marks)',
              'Water immersion explanation: n21 drops causing focal length to increase ~4x (2 Marks)',
            ],
          },
        ]
      : [
          {
            id: 'q_acc_01',
            type: 'mcq',
            marks: 1,
            question: 'Under AS-26, the Premium for Goodwill brought in cash by an incoming partner is shared among existing partners in:',
            question_hi: 'लेखांकन मानक AS-26 के अनुसार नया साझेदार जो ख्याति का प्रीमियम लाता है, वह पुराने साझेदारों में किस अनुपात में बाँटा जाता है?',
            options: [
              'Sacrificing Ratio',
              'Old Profit Sharing Ratio',
              'New Profit Sharing Ratio',
              'Equal Ratio',
            ],
            correct_option_index: 0,
            source_chunk_id: 'chk_acc_01',
            source_page: 1,
            source_section: '1. Sacrificing Ratio & Goodwill',
            rubric: ['Direct rule identification (1 Mark)'],
          },
          {
            id: 'q_acc_02',
            type: 'short',
            marks: 3,
            question: 'Explain the nature of a Revaluation Account and state any two items that are credited to it.',
            question_hi: 'पुनर्मूल्यांकन खाते की प्रकृति समझाइए और इसमें जमा (Credit) की जाने वाली किन्हीं दो मदों का उल्लेख कीजिए।',
            source_chunk_id: 'chk_acc_01',
            source_page: 3,
            source_section: '3. Revaluation Account',
            rubric: [
              'Nominal nature explained (1 Mark)',
              'Item 1: Increase in asset values (1 Mark)',
              'Item 2: Decrease in liabilities or unrecorded assets (1 Mark)',
            ],
          },
        ];

    return {
      test_id: `test_${Date.now()}`,
      questions,
      difficulty_assigned: assignedDiff,
    };
  }

  async evaluateTest(payload: {
    subject: string;
    topic: string;
    is_mock_exam: boolean;
    time_spent_seconds: number;
    submissions: AnswerSubmission[];
    questions: TestQuestion[];
  }): Promise<TestResult> {
    try {
      const res = await fetch('/api/practice/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data: TestResult = await res.json();
        this.pastResults.unshift(data);
        this.saveResults();
        return data;
      }
    } catch {
      // Offline fallback
    }

    // Client-side evaluation
    let totalScore = 0;
    const maxTotal = payload.questions.reduce((sum, q) => sum + q.marks, 0);
    const subMap = new Map(payload.submissions.map((s) => [s.question_id, s]));

    const evaluations = payload.questions.map((q) => {
      const sub = subMap.get(q.id);
      const userText = sub?.answer_text.trim().toLowerCase() || '';
      const selected = sub?.selected_option_index;

      let score = 0;
      const missing: string[] = [];

      if (q.type === 'mcq') {
        if (selected === q.correct_option_index) {
          score = q.marks;
        } else {
          missing.push(
            `Selected Option ${selected !== undefined ? selected + 1 : 'None'} is incorrect. Correct option: Option ${(q.correct_option_index ?? 0) + 1} (${q.options?.[q.correct_option_index ?? 0]}).`
          );
        }
      } else if (q.type === 'short') {
        if (userText.includes('aperture') || userText.includes('small')) score += 1;
        else missing.push('Deduction (-1.0 Mark): Missing assumption that the aperture of the curved boundary is small.');

        if (userText.includes('point') || userText.includes('axis')) score += 1;
        else missing.push('Deduction (-1.0 Mark): Missing assumption that object is a point on the principal axis.');

        if (userText.includes('paraxial') || userText.includes('small angle')) score += 1;
        else missing.push('Deduction (-1.0 Mark): Missing assumption that rays are paraxial with small incident angles.');

        if (userText.length > 20 && score === 0) {
          score = 1.5;
        }
      } else {
        // Long question
        if (userText.includes('1/f') && (userText.includes('n21') || userText.includes('μ'))) score += 1.5;
        else missing.push("Deduction (-1.5 Marks): Primary Lens Maker statement '1/f = (n21 - 1)(1/R1 - 1/R2)' was missing or improperly formatted.");

        if (userText.includes('equiconvex') || userText.includes('+r') || userText.includes('2(n')) score += 1.5;
        else missing.push('Deduction (-1.5 Marks): Equiconvex substitution step R1 = +R, R2 = -R was omitted.');

        if (userText.includes('water') || userText.includes('increase') || userText.includes('4') || userText.includes('four')) score += 2.0;
        else missing.push('Deduction (-2.0 Marks): Water immersion explanation incomplete. Relative optical density drops from 1.5 to 1.125, extending focal length ~4 times.');

        if (userText.length > 30 && score < 2) {
          score = 2.5;
        }
      }

      totalScore += score;
      return {
        question_id: q.id,
        score_awarded: Math.round(score * 10) / 10,
        max_marks: q.marks,
        what_is_missing: missing.length ? missing : undefined,
        model_answer: `CBSE Step-wise Marking Scheme: ${q.rubric.join(' • ')}`,
        source_citation: `Class Notes • Page ${q.source_page} • ${q.source_section}`,
        bilingual_notes: 'हिंदी व्याख्या: उत्तर लिखते समय "उपाक्षीय किरणें (Paraxial rays)" और "बिंदु बिंब (Point object)" शब्दों का प्रयोग अनिवार्य है।',
        feedback_sentiment: (score >= q.marks ? 'full' : score > 0 ? 'partial' : 'incorrect') as any,
      };
    });

    const percentage = Math.round((totalScore / maxTotal) * 1000) / 10;

    // Update topic stats
    this.updateTopicStats(payload.topic, percentage / 100);

    const result: TestResult = {
      attempt_id: `atm_${Date.now()}`,
      subject: payload.subject,
      topic: payload.topic,
      score: Math.round(totalScore * 10) / 10,
      total_marks: maxTotal,
      percentage,
      evaluations,
      time_spent_seconds: payload.time_spent_seconds,
      is_mock_exam: payload.is_mock_exam,
      date: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }),
      summary_feedback:
        percentage >= 80
          ? 'Exceptional mastery! You stated primary equations and paraxial assumptions with precision.'
          : percentage >= 50
          ? 'Good attempt! Review the brick-red missing steps before your upcoming pre-board test.'
          : 'Needs revision. Review your Class Notes Page 1-2 before retrying this chapter test.',
    };

    this.pastResults.unshift(result);
    this.saveResults();
    return result;
  }

  private updateTopicStats(topicName: string, recentAccuracy: number) {
    const existing = this.stats.find((s) => s.topic.toLowerCase().includes(topicName.toLowerCase()) || topicName.toLowerCase().includes(s.topic.toLowerCase()));
    if (existing) {
      existing.accuracy = Math.round(((existing.accuracy * 0.7) + (recentAccuracy * 0.3)) * 100) / 100;
      existing.attempts_count += 1;
      existing.is_weak = existing.accuracy < 0.75;
      existing.last_practiced = new Date().toISOString().split('T')[0];
    } else {
      this.stats.push({
        id: `stat_${Date.now()}`,
        subject: 'Physics',
        topic: topicName,
        accuracy: Math.round(recentAccuracy * 100) / 100,
        attempts_count: 1,
        last_practiced: new Date().toISOString().split('T')[0],
        is_weak: recentAccuracy < 0.75,
      });
    }
    this.saveStats();
  }

  getPastResults(): TestResult[] {
    return [...this.pastResults];
  }
}

export const practiceService = new PracticeService();
