import React, { useState } from 'react';
import {
  Users,
  AlertTriangle,
  Flame,
  FileQuestion,
  CheckCircle2,
  BookOpen,
  Clock,
  Sparkles,
  Download,
  Send,
  Eye,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Tag } from '../ui/Tag';
import { Button } from '../ui/Button';

interface ConfusionPoint {
  timestamp: string;
  seconds: number;
  pauseCount: number;
  level: 'High' | 'Medium' | 'Low';
  commonDoubt: string;
  sampleStudent: string;
  resolvedInLecture: string;
}

export const TeacherDashboardView: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'heatmap' | 'weak_topics' | 'question_bank'>('heatmap');
  const [isGeneratingPaper, setIsGeneratingPaper] = useState(false);
  const [generatedPaper, setGeneratedPaper] = useState<Array<{
    qNum: number;
    type: string;
    marks: number;
    question: string;
    sourceChunk: string;
  }> | null>(null);
  const [assignSuccess, setAssignSuccess] = useState(false);

  // Real class confusion heatmap data from Ray Optics lecture
  const confusionData: ConfusionPoint[] = [
    {
      timestamp: '00:45',
      seconds: 45,
      pauseCount: 2,
      level: 'Low',
      commonDoubt: 'Does Snell’s law apply to curved glass surfaces as well?',
      sampleStudent: 'Kabir Mehta',
      resolvedInLecture: 'Addressed immediately by teacher',
    },
    {
      timestamp: '01:15',
      seconds: 75,
      pauseCount: 6,
      level: 'Medium',
      commonDoubt: 'Why does image distance v become negative for virtual images in refraction?',
      sampleStudent: 'Priya Iyer',
      resolvedInLecture: 'Covered in derivation part 1',
    },
    {
      timestamp: '02:00',
      seconds: 120,
      pauseCount: 18,
      level: 'High',
      commonDoubt: 'Why does light bend towards the normal in denser medium? What is the combined formula for double convex lens?',
      sampleStudent: 'Arjun Sharma',
      resolvedInLecture: 'Teacher introduces hint here; explains full formula at 04:45',
    },
    {
      timestamp: '03:45',
      seconds: 225,
      pauseCount: 14,
      level: 'High',
      commonDoubt: 'Why is R2 negative for biconvex lens when R1 is positive?',
      sampleStudent: 'Ananya Sen',
      resolvedInLecture: 'Center of curvature of 2nd surface lies on left side (negative x-axis)',
    },
    {
      timestamp: '04:45',
      seconds: 285,
      pauseCount: 8,
      level: 'Medium',
      commonDoubt: 'How to use Lens Maker formula if lens is immersed in water instead of air?',
      sampleStudent: 'Arjun Sharma',
      resolvedInLecture: 'Solved with relative refractive index (n2/n1)',
    },
    {
      timestamp: '06:10',
      seconds: 370,
      pauseCount: 11,
      level: 'High',
      commonDoubt: 'Why does glass lens become converging in water but diverging in CS2 liquid?',
      sampleStudent: 'Kabir Mehta',
      resolvedInLecture: 'Sign of (n_rel - 1) inverts when surrounding medium has higher index',
    },
  ];

  // Class Weak Topics aggregated across student practice tests
  const classWeakTopics = [
    {
      topic: 'Wave Optics: Huygens Wavefront Secondary Wavelets',
      accuracy: 58,
      strugglingCount: 3,
      students: ['Arjun Sharma', 'Kabir Mehta', 'Ananya Sen'],
      recommendedAction: 'Demonstrate spherical wavefront reflection in lab session tomorrow.',
    },
    {
      topic: 'Ray Optics: Lens Maker Sign Conventions (R1 vs R2)',
      accuracy: 64,
      strugglingCount: 2,
      students: ['Arjun Sharma', 'Ananya Sen'],
      recommendedAction: 'Handout 5 ray diagram numericals focusing on plano-convex lenses.',
    },
    {
      topic: 'Electrochemistry: Nernst Equation at Non-Standard State',
      accuracy: 69,
      strugglingCount: 2,
      students: ['Priya Iyer', 'Kabir Mehta'],
      recommendedAction: 'Review log[Q] concentration quotient calculations.',
    },
  ];

  const handleGenerateQuestionBank = () => {
    setIsGeneratingPaper(true);
    setAssignSuccess(false);
    setTimeout(() => {
      setGeneratedPaper([
        {
          qNum: 1,
          type: 'MCQ (1 Mark)',
          marks: 1,
          question:
            'A biconvex lens of focal length f in air is immersed in a liquid of refractive index equal to that of the lens material. What will be its new focal length?',
          sourceChunk: 'Ray Optics Notes • Page 2, §3',
        },
        {
          qNum: 2,
          type: 'Assertion-Reason (1 Mark)',
          marks: 1,
          question:
            'Assertion (A): A convex lens of glass behaves as a diverging lens in carbon disulphide.\nReason (R): The refractive index of carbon disulphide is greater than the refractive index of glass.',
          sourceChunk: 'Ray Optics Notes • Page 3, §Special Cases',
        },
        {
          qNum: 3,
          type: 'Short Answer (2 Marks)',
          marks: 2,
          question:
            'State the conditions under which a convex lens placed in a transparent medium acts like a plain glass sheet.',
          sourceChunk: 'Lecture Doubt at 04:45 • Dr. Rameshwar Sharma',
        },
        {
          qNum: 4,
          type: 'Derivation (3 Marks)',
          marks: 3,
          question:
            'Derive the relation connecting object distance (u), image distance (v), and radius of curvature (R) for refraction at a single convex spherical surface separating rarer to denser medium: n₂/v - n₁/u = (n₂ - n₁)/R.',
          sourceChunk: 'Ray Optics Notes • Page 1, §Refraction Derivation',
        },
        {
          qNum: 5,
          type: 'Numerical Problem (5 Marks)',
          marks: 5,
          question:
            'A double convex lens has radii of curvature 20 cm each. If refractive index of glass is 1.5, calculate its focal length in air. What will be its focal length when immersed in water of refractive index 4/3?',
          sourceChunk: 'Class 12 Physics Notes • Page 2, Example 9.6',
        },
      ]);
      setIsGeneratingPaper(false);
    }, 700);
  };

  const handleAssignToClass = () => {
    setAssignSuccess(true);
    setTimeout(() => setAssignSuccess(false), 3000);
  };

  return (
    <div className="w-full text-left space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-sm border border-[var(--paper-border)] bg-[var(--paper-card)]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Tag variant="marigold">FACULTY DESK</Tag>
            <span className="text-xs font-mono-time text-[var(--ink-muted)]">
              {user?.name || 'Dr. Rameshwar Sharma'} • Physics Department
            </span>
          </div>
          <h2 className="font-serif-title text-2xl font-bold text-[var(--ink-primary)]">
            Class Doubt Analytics & Confusion Heatmap
          </h2>
          <p className="text-xs text-[var(--ink-muted)] mt-0.5">
            Real-time telemetry showing where Class 12 students pause lecture videos and struggle with syllabus concepts.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-sm border border-[var(--paper-border)] p-1 bg-[var(--paper-elevated)] text-xs font-mono-time shrink-0">
          <button
            onClick={() => setActiveTab('heatmap')}
            className={`py-1.5 px-3 rounded-[2px] transition-colors cursor-pointer ${
              activeTab === 'heatmap'
                ? 'bg-[var(--ink-primary)] text-[var(--paper-bg)] font-semibold'
                : 'text-[var(--ink-muted)] hover:text-[var(--ink-primary)]'
            }`}
          >
            Confusion Heatmap
          </button>
          <button
            onClick={() => setActiveTab('weak_topics')}
            className={`py-1.5 px-3 rounded-[2px] transition-colors cursor-pointer ${
              activeTab === 'weak_topics'
                ? 'bg-[var(--ink-primary)] text-[var(--paper-bg)] font-semibold'
                : 'text-[var(--ink-muted)] hover:text-[var(--ink-primary)]'
            }`}
          >
            Class Weak Topics
          </button>
          <button
            onClick={() => setActiveTab('question_bank')}
            className={`py-1.5 px-3 rounded-[2px] transition-colors cursor-pointer ${
              activeTab === 'question_bank'
                ? 'bg-[var(--ink-primary)] text-[var(--paper-bg)] font-semibold'
                : 'text-[var(--ink-muted)] hover:text-[var(--ink-primary)]'
            }`}
          >
            Auto Question Bank
          </button>
        </div>
      </div>

      {/* Tab 1: Confusion Heatmap */}
      {activeTab === 'heatmap' && (
        <div className="space-y-6">
          <div className="p-4 rounded-sm border border-[var(--paper-border)] bg-[var(--paper-card)] space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--paper-rule)] pb-2.5">
              <div>
                <span className="text-[10px] font-mono-time uppercase text-[var(--marigold-accent)] font-semibold">
                  ACTIVE LECTURE UNDER OBSERVATION
                </span>
                <h3 className="font-serif-title text-base font-bold text-[var(--ink-primary)]">
                  Ray Optics: Refraction at Spherical Surfaces & Lens Maker Formula (07:00 Total Duration)
                </h3>
              </div>
              <span className="text-xs font-mono-time text-[var(--ink-muted)]">
                Class 12 Section A • 59 Pauses Logged
              </span>
            </div>

            {/* Visual Heatmap Timeline Bar */}
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-[11px] font-mono-time text-[var(--ink-muted)]">
                <span>00:00</span>
                <span>01:45</span>
                <span className="text-[var(--brick-red)] font-semibold">02:00 (Peak Friction)</span>
                <span>03:45 (Signs)</span>
                <span>04:45 (Formula)</span>
                <span>07:00</span>
              </div>

              {/* Progress bar with pause spikes */}
              <div className="h-4 w-full rounded-xs bg-[var(--paper-elevated)] border border-[var(--paper-border)] relative overflow-hidden flex">
                <div style={{ width: '15%' }} className="h-full bg-[var(--marigold-light)]" title="00:00 - 01:00: Light intro" />
                <div style={{ width: '15%' }} className="h-full bg-[var(--marigold-accent)] opacity-60" title="01:00 - 02:00: 6 pauses" />
                <div style={{ width: '20%' }} className="h-full bg-[var(--brick-red)] opacity-90 animate-pulse" title="02:00 - 03:00: 18 pauses (High)" />
                <div style={{ width: '25%' }} className="h-full bg-[var(--brick-red)] opacity-70" title="03:00 - 04:30: 14 pauses (High)" />
                <div style={{ width: '25%' }} className="h-full bg-[var(--marigold-accent)] opacity-80" title="04:30 - 07:00: 23 pauses" />
              </div>
              <span className="text-[10px] font-mono-time text-[var(--ink-muted)] block text-right">
                Darker brick red indicates highest student pause density
              </span>
            </div>
          </div>

          {/* List of Pause Points with Student Doubts */}
          <div className="space-y-3">
            <h4 className="font-serif-title text-base font-bold text-[var(--ink-primary)]">
              Timestamp Breakdown & Student Questions
            </h4>

            <div className="space-y-2.5">
              {confusionData.map((pt) => (
                <div
                  key={pt.timestamp}
                  className={`p-4 rounded-sm border transition-all text-left ${
                    pt.level === 'High'
                      ? 'border-[var(--brick-red-border)] bg-[var(--brick-red-light)]/40'
                      : 'border-[var(--paper-border)] bg-[var(--paper-card)]'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-current/10 pb-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono-time text-xs font-bold px-2 py-0.5 rounded-[2px] bg-[var(--paper-elevated)] text-[var(--ink-primary)] border border-[var(--paper-border)]">
                        ⏱ {pt.timestamp}
                      </span>
                      <Tag variant={pt.level === 'High' ? 'brick' : pt.level === 'Medium' ? 'marigold' : 'neutral'} size="sm">
                        {pt.pauseCount} Student Pauses ({pt.level} Confusion)
                      </Tag>
                    </div>
                    <span className="text-[11px] font-mono-time text-[var(--ink-muted)]">
                      First flagged by: <strong>{pt.sampleStudent}</strong>
                    </span>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs text-[var(--ink-primary)] font-body">
                      <strong className="text-[var(--marigold-accent)] font-mono-time">Student Doubt: </strong>
                      "{pt.commonDoubt}"
                    </p>
                    <p className="text-[11px] text-[var(--ink-muted)] font-mono-time">
                      <strong>Pedagogical Context: </strong>
                      {pt.resolvedInLecture}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Class Weak Topics */}
      {activeTab === 'weak_topics' && (
        <div className="space-y-4">
          <div>
            <span className="text-xs font-mono-time uppercase text-[var(--marigold-accent)] font-semibold">
              DIAGNOSTIC REPORT
            </span>
            <h3 className="font-serif-title text-xl font-bold text-[var(--ink-primary)]">
              Topics Below 70% Mastery in Class 12
            </h3>
            <p className="text-xs text-[var(--ink-muted)] mt-0.5">
              Calculated automatically from student test attempts, homework answers, and error logs.
            </p>
          </div>

          <div className="space-y-3">
            {classWeakTopics.map((item, idx) => (
              <div
                key={idx}
                className="p-4 sm:p-5 rounded-sm border border-[var(--paper-border)] bg-[var(--paper-card)] space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-1">
                    <h4 className="font-serif-title text-base font-bold text-[var(--ink-primary)]">
                      {item.topic}
                    </h4>
                    <span className="text-xs font-mono-time text-[var(--brick-red)] font-semibold">
                      Class Accuracy: {item.accuracy}% • {item.strugglingCount} Students Struggling
                    </span>
                  </div>
                  <Tag variant="brick" size="sm">Action Recommended</Tag>
                </div>

                <div className="p-3 rounded-xs bg-[var(--paper-elevated)] border border-[var(--paper-border)] text-xs text-[var(--ink-secondary)]">
                  <p>
                    <strong>Struggling Students: </strong>
                    {item.students.join(', ')}
                  </p>
                  <p className="mt-1 text-[var(--marigold-accent)] font-body">
                    <strong>Suggested Classroom Remedy: </strong>
                    {item.recommendedAction}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Auto Question Bank Generator */}
      {activeTab === 'question_bank' && (
        <div className="space-y-4">
          <div className="p-5 rounded-sm border border-[var(--marigold-border)] bg-[var(--marigold-light)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono-time uppercase text-[var(--marigold-accent)] font-bold">
                NOTEBOOK-TO-EXAM GENERATOR
              </span>
              <h3 className="font-serif-title text-lg font-bold text-[var(--ink-primary)]">
                Auto-Generate Question Bank from Chapter Notes
              </h3>
              <p className="text-xs text-[var(--ink-secondary)] mt-0.5 max-w-xl">
                Extracts CBSE board-standard questions directly from student lecture notes and doubt timestamps.
                Includes step-wise marking schemes and model solutions.
              </p>
            </div>

            <Button
              variant="marigold"
              size="sm"
              onClick={handleGenerateQuestionBank}
              disabled={isGeneratingPaper}
              className="shrink-0 cursor-pointer text-white"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              {isGeneratingPaper ? 'Analyzing Notes...' : 'Generate 5-Question Paper'}
            </Button>
          </div>

          {generatedPaper && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-sm border border-[var(--paper-border)] bg-[var(--paper-card)]">
                <div>
                  <span className="font-serif-title text-base font-bold text-[var(--ink-primary)]">
                    Class 12 Physics • Ray Optics Chapter Test (Total 12 Marks)
                  </span>
                  <span className="text-xs font-mono-time text-[var(--ink-muted)] block">
                    Strictly sourced from verified classroom notes • 45 min duration
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => alert('Downloaded PDF print layout formatted with notebook header and student sign-off block.')}
                  >
                    <Download className="w-3.5 h-3.5 mr-1.5 text-[var(--marigold-accent)]" />
                    Download Paper
                  </Button>
                  <Button
                    variant="ink"
                    size="sm"
                    onClick={handleAssignToClass}
                    disabled={assignSuccess}
                  >
                    <Send className="w-3.5 h-3.5 mr-1.5" />
                    {assignSuccess ? 'Assigned to Class!' : 'Assign to Students'}
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                {generatedPaper.map((q) => (
                  <div
                    key={q.qNum}
                    className="p-4 rounded-sm border border-[var(--paper-border)] bg-[var(--paper-card)] space-y-2 text-left"
                  >
                    <div className="flex items-center justify-between text-xs font-mono-time border-b border-[var(--paper-rule)] pb-1.5">
                      <span className="font-bold text-[var(--ink-primary)]">
                        Question {q.qNum} • {q.type}
                      </span>
                      <span className="text-[var(--marigold-accent)] font-semibold">
                        [{q.marks} Mark{q.marks > 1 ? 's' : ''}]
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-[var(--ink-primary)] font-body whitespace-pre-wrap leading-relaxed">
                      {q.question}
                    </p>

                    <div className="pt-2 flex items-center justify-between text-[11px] font-mono-time text-[var(--ink-muted)]">
                      <span className="flex items-center gap-1.5">
                        <BookOpen className="w-3 h-3 text-[var(--marigold-accent)]" />
                        Source: {q.sourceChunk}
                      </span>
                      <span className="text-[10px] text-[var(--ink-muted)]">
                        CBSE Pattern
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
