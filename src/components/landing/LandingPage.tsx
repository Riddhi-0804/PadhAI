import React from 'react';
import { ArrowRight, Play, CheckCircle2, BookOpen, Clock, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { AppRoute } from '../../types';
import { Card } from '../ui/Card';
import { Tag } from '../ui/Tag';
import { Button } from '../ui/Button';

interface LandingPageProps {
  onStart: (route: AppRoute) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const { t, language } = useLanguage();

  return (
    <div className="w-full text-left py-8 sm:py-16 px-4 sm:px-8 max-w-6xl mx-auto">
      {/* Asymmetric Left-Aligned Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left main column (7 cols) */}
        <div className="lg:col-span-7 flex flex-col items-start">
          <div className="mb-4">
            <Tag variant="marigold" size="md">
              {t.landing.badge}
            </Tag>
          </div>

          <h1 className="font-serif-title text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--ink-primary)] leading-[1.15] mb-5">
            {t.landing.heroTitle}
          </h1>

          <p className="text-base sm:text-lg text-[var(--ink-secondary)] leading-relaxed mb-6 max-w-xl">
            {t.landing.heroDescription}
          </p>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <Button
              variant="marigold"
              size="lg"
              onClick={() => onStart('dashboard')}
              className="gap-2"
            >
              <span>{t.landing.heroCtaPrimary}</span>
              <ArrowRight className="w-4 h-4" />
            </Button>

            <a
              href="#pause-and-ask"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium rounded-sm border border-[var(--paper-border)] bg-[var(--paper-card)] text-[var(--ink-primary)] hover:bg-[var(--paper-elevated)] transition-colors"
            >
              <Clock className="w-4 h-4 text-[var(--marigold-accent)]" />
              <span>{t.landing.heroCtaSecondary}</span>
            </a>
          </div>

          {/* Senior student endorsement quote */}
          <div className="p-4 rounded-sm border-l-3 border-[var(--marigold-accent)] bg-[var(--paper-card)] border border-[var(--paper-border)] max-w-lg mb-6">
            <p className="font-serif-title text-sm italic text-[var(--ink-secondary)]">
              {t.landing.quoteSenior}
            </p>
            <span className="text-[11px] font-mono-time uppercase text-[var(--ink-muted)] block mt-1.5">
              — Ayush S., AIR 412 (JEE Advanced 2024 mentor)
            </span>
          </div>
        </div>

        {/* Right side asymmetric visual: Realistic Notebook Annotation Card (NOT generic chatbot) */}
        <div className="lg:col-span-5 w-full">
          <div className="text-[11px] font-mono-time uppercase text-[var(--ink-muted)] mb-2 flex items-center justify-between">
            <span>Sample Student Annotation</span>
            <span className="text-[var(--marigold-accent)] font-semibold">TAPE 04 • 14:20</span>
          </div>

          <Card withMarginRule elevation="lift" className="border-t-2 border-t-[var(--marigold-accent)]">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <Tag variant="neutral" size="sm">PHYSICS 12</Tag>
                <span className="text-[11px] font-mono-time text-[var(--ink-muted)]">
                  Ch. 09 Ray Optics
                </span>
              </div>
              <span className="text-[10px] font-mono-time text-[var(--marigold-accent)] bg-[var(--marigold-light)] border border-[var(--marigold-border)] px-1.5 py-0.5 rounded-[2px] font-semibold">
                NO SPOILERS
              </span>
            </div>

            <div className="space-y-3 text-xs leading-relaxed">
              <div className="p-2.5 rounded-sm bg-[var(--paper-elevated)] border border-[var(--paper-border)]">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[var(--ink-primary)] mb-1">
                  <Clock className="w-3.5 h-3.5 text-[var(--marigold-accent)]" />
                  <span>Student paused at 14:20:</span>
                </div>
                <p className="italic text-[var(--ink-secondary)] font-serif-title text-sm">
                  "{language === 'hi' 
                    ? 'सर ने यहाँ sin(i) / sin(r) = constant क्यों लिखा? क्या n2/n1 अलग से लिखना पड़ेगा?'
                    : 'Why did Sir write sin(i)/sin(r) = constant? Do I need to write n2/n1 separately?'}"
                </p>
              </div>

              {/* Senior Annotation Answer */}
              <div className="space-y-1.5 text-left">
                <p className="text-[var(--ink-primary)] font-medium">
                  {language === 'hi'
                    ? '14:20 तक सर सिर्फ स्नेल के नियम की पहली परिभाषा बता रहे हैं। आपकी क्लास नोटबुक के अनुसार:'
                    : 'Up to 14:20, Sir is introducing Snell’s primary ratio only. As recorded in your notes:'}
                </p>
                <div className="pl-3 border-l-2 border-[var(--marigold-accent)] text-[var(--ink-secondary)] space-y-1">
                  <p>
                    1. <code className="font-mono-time bg-[var(--paper-elevated)] px-1">sin i / sin r = μ</code> (सघन माध्यम का अपवर्तनांक)
                  </p>
                  <p>
                    2. <span className="text-[var(--ink-muted)]">नोट:</span> अभी <code className="font-mono-time">n2/n1</code> वाले सूत्र पर मत कूदो, सर 19:40 पर सापेक्ष अपवर्तनांक समझाएंगे।
                  </p>
                </div>
              </div>

              {/* Source & Confidence Line */}
              <div className="pt-2 border-t border-[var(--paper-rule)] flex items-center justify-between text-[10px] font-mono-time text-[var(--ink-muted)]">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-[var(--marigold-accent)]" />
                  <span>Notebook Page 14 • Fig 9.2</span>
                </span>
                <span className="text-[var(--ink-secondary)]">Confidence: 98%</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Feature Section: Pause & Ask deep-dive */}
      <section id="pause-and-ask" className="mt-16 sm:mt-24 pt-12 border-t border-[var(--paper-rule)]">
        <div className="max-w-3xl">
          <Tag variant="neutral" size="sm" className="mb-3">
            METHODOLOGY
          </Tag>
          <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-[var(--ink-primary)] mb-4">
            {t.landing.featurePauseTitle}
          </h2>
          <p className="text-base font-medium text-[var(--marigold-accent)] mb-4">
            {t.landing.featurePauseSubtitle}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="p-5 rounded-sm border border-[var(--paper-border)] bg-[var(--paper-card)]">
              <div className="flex items-center gap-2 mb-2 text-[var(--brick-red)]">
                <AlertCircle className="w-4 h-4" />
                <span className="text-xs font-mono-time uppercase font-semibold">
                  Standard Web Chatbots
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[var(--ink-secondary)] leading-relaxed">
                {t.landing.featurePauseText1}
              </p>
            </div>

            <div className="p-5 rounded-sm border-2 border-[var(--marigold-border)] bg-[var(--paper-card)] shadow-[var(--paper-shadow-sm)]">
              <div className="flex items-center gap-2 mb-2 text-[var(--marigold-accent)]">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-xs font-mono-time uppercase font-semibold">
                  PadhAI Guardrail
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[var(--ink-primary)] leading-relaxed">
                {t.landing.featurePauseText2}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Real Indian Exam Subjects Grid */}
      <section className="mt-16 pt-12 border-t border-[var(--paper-rule)]">
        <div className="mb-6">
          <Tag variant="neutral" size="sm" className="mb-2">SYLLABUS COVERAGE</Tag>
          <h2 className="font-serif-title text-xl sm:text-2xl font-bold text-[var(--ink-primary)]">
            {t.landing.subjectsHeading}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              code: 'PHY-12',
              name: t.landing.subjectPhysics,
              desc: 'Electrostatics, Optics, Magnetism & Wave Theory',
            },
            {
              code: 'ACC-12',
              name: t.landing.subjectAccounts,
              desc: 'Reconstitution, Goodwill, Debentures, Cash Flows',
            },
            {
              code: 'ECO-12',
              name: t.landing.subjectEconomics,
              desc: 'National Income, Monetary Policy, Rural Credit',
            },
            {
              code: 'CHE-12',
              name: t.landing.subjectChemistry,
              desc: 'Coordination Compounds, Aldehydes & NCERT reactions',
            },
          ].map((item) => (
            <div
              key={item.code}
              className="p-4 rounded-sm border border-[var(--paper-border)] bg-[var(--paper-card)] hover:border-[var(--marigold-accent)] transition-colors text-left"
            >
              <span className="text-[10px] font-mono-time uppercase text-[var(--marigold-accent)] font-semibold block mb-1">
                {item.code}
              </span>
              <h3 className="font-serif-title text-base font-semibold text-[var(--ink-primary)] mb-1">
                {item.name}
              </h3>
              <p className="text-xs text-[var(--ink-muted)] leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* The Notebook Rule Section */}
      <section className="mt-16 pt-12 border-t border-[var(--paper-rule)] mb-12">
        <div className="p-6 rounded-sm border border-[var(--paper-border)] bg-[var(--paper-card)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-xl text-left">
            <span className="text-[10px] font-mono-time uppercase text-[var(--ink-muted)] block mb-1">
              DESIGN CONSTITUTION
            </span>
            <h3 className="font-serif-title text-lg sm:text-xl font-bold text-[var(--ink-primary)] mb-2">
              {t.landing.notebookConceptHeading}
            </h3>
            <p className="text-xs sm:text-sm text-[var(--ink-secondary)] leading-relaxed">
              {t.landing.notebookConceptDesc}
            </p>
          </div>

          <Button
            variant="ink"
            size="lg"
            onClick={() => onStart('dashboard')}
            className="whitespace-nowrap shrink-0"
          >
            {t.app.openApp}
          </Button>
        </div>
      </section>
    </div>
  );
};
