import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { AppRoute } from '../../types';
import './landing.css';

interface LandingPageProps {
  onStart: (route: AppRoute) => void;
}

const tilt = (deg: number): React.CSSProperties =>
  ({ '--ln-tilt': `${deg}deg` }) as React.CSSProperties;

/* A torn paper edge, drawn once and reused at the bottom of every sheet. */
const TornEdge: React.FC = () => (
  <svg
    className="ln-torn"
    viewBox="0 0 320 8"
    preserveAspectRatio="none"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M0 0h320v3l-14 3-12-3-16 4-13-2-15 3-14-4-13 3-16-2-14 3-12-3-15 2-14-3-13 3-16-2-13 3-14-3-13 2-15-3-14 3-13-2-16 2z" />
  </svg>
);

const HandArrow: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    className={className}
    viewBox="0 0 60 40"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M5 9c9 15 23 22 38 20" />
    <path d="M34 22l11 7-13 4" />
  </svg>
);

const Tick: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    className={className}
    viewBox="0 0 20 20"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M3 11l5 5 9-12" />
  </svg>
);

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const { t, language } = useLanguage();
  const rootRef = useRef<HTMLDivElement>(null);
  const [showHint, setShowHint] = useState(false);

  /* Papers settle in as they scroll into view; highlighter draws under key words. */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const items = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'));
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced || typeof IntersectionObserver === 'undefined') {
      items.forEach((el) => el.classList.add('is-revealed'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -6% 0px' }
    );

    items.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const page = (n: string) => `${t.landing.pageWord} ${n}`;

  const promises = [
    { title: t.landing.promiseMadeTitle, text: t.landing.promiseMadeText, tint: 'marigold', deg: -1.6 },
    { title: t.landing.promiseYoursTitle, text: t.landing.promiseYoursText, tint: 'green', deg: 1.4 },
    { title: t.landing.promiseSlowTitle, text: t.landing.promiseSlowText, tint: 'green', deg: 0.9 },
    { title: t.landing.promiseTalkTitle, text: t.landing.promiseTalkText, tint: 'marigold', deg: -1.2 },
    { title: t.landing.promisePracticeTitle, text: t.landing.promisePracticeText, tint: 'marigold', deg: 1.7 },
    { title: t.landing.promiseTeacherTitle, text: t.landing.promiseTeacherText, tint: 'green', deg: -0.8 },
  ];

  const steps = [
    { title: t.landing.step1Title, text: t.landing.step1Text, deg: -1 },
    { title: t.landing.step2Title, text: t.landing.step2Text, deg: 0.7 },
    { title: t.landing.step3Title, text: t.landing.step3Text, deg: -0.6 },
  ];

  const slips = [
    { label: t.landing.slipHindiLabel, text: t.landing.slipHindiText, lang: 'hi', deg: -0.9 },
    { label: t.landing.slipTamilLabel, text: t.landing.slipTamilText, lang: 'ta', deg: 0.8 },
    { label: t.landing.slipBengaliLabel, text: t.landing.slipBengaliText, lang: 'bn', deg: -0.5 },
    { label: t.landing.slipEnglishLabel, text: t.landing.slipEnglishText, lang: 'en', deg: 1.1 },
  ];

  return (
    <div
      id="top"
      ref={rootRef}
      className={`ln-root ${language === 'hi' ? 'ln-hi' : ''}`}
    >
      <div className="ln-page">
        <div className="ln-spiral" aria-hidden="true" />
        <span className="ln-margin-line" aria-hidden="true" />

        {/* 1 — cover page */}
        <section className="ln-hero" data-reveal style={tilt(-0.3)}>
          <div>
            <h1 className="ln-h1 ln-hand">
              {t.landing.heroTitleA}
              <span className="ln-hl">{t.landing.heroTitleMark}</span>
              {t.landing.heroTitleB}
            </h1>
            <p className="ln-body ln-hero-sub">{t.landing.heroSubline}</p>

            <div className="ln-actions">
              <button
                type="button"
                className="ln-btn"
                onClick={() => onStart('dashboard')}
              >
                {t.landing.heroPrimary}
                <svg
                  className="ln-btn__arrow"
                  viewBox="0 0 24 12"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path d="M1 6h20" />
                  <path d="M16 1.5L21.5 6 16 10.5" />
                </svg>
              </button>

              <a className="ln-btn ln-btn--quiet" href="#feeling">
                {t.landing.heroSecondary}
              </a>
            </div>

            <p className="ln-stamp ln-stamp--free">{t.landing.freeToStart}</p>
          </div>

          <div className="ln-hero-art">
            <svg
              className="ln-book"
              viewBox="0 0 320 205"
              aria-hidden="true"
              focusable="false"
            >
              <path
                className="ln-fill-paper ln-s"
                d="M14 28c46-9 100-6 148 17 48-23 102-26 148-17v154c-46-9-100-6-148 17-48-23-102-26-148-17z"
              />
              <path className="ln-s ln-s--thin" d="M162 45v154" />
              <path
                className="ln-s ln-s--rule"
                d="M42 66h96M42 88h104M42 110h86M42 132h98M42 154h70"
              />
              <path
                className="ln-s ln-s--rule"
                d="M186 66h96M186 88h86M186 110h104M186 132h78"
              />
              <path className="ln-s ln-s--margin" d="M60 48v146" />
              <path
                className="ln-s ln-s--pencil"
                d="M206 158c10 6 22 4 30-6"
              />
              <path
                className="ln-s ln-s--accent"
                d="M243 140c6-8 16-8 20 0"
              />
              <path
                className="ln-s--star ln-s"
                d="M282 54l3.4 8 8.6.7-6.5 5.6 2 8.4-7.5-4.4-7.5 4.4 2-8.4-6.5-5.6 8.6-.7z"
              />
            </svg>

            <div className="ln-note">
              <span className="ln-write-wrap">
                <span className="ln-pen" aria-hidden="true" />
                <p className="ln-hand ln-write">{t.landing.heroNote}</p>
              </span>
            </div>

            <span className="ln-tape ln-tape--hero" aria-hidden="true" />
          </div>
        </section>

        {/* 2 — the feeling */}
        <section id="feeling" className="ln-section" data-reveal style={tilt(0.4)}>
          <div className="ln-sheet">
            <span className="ln-tape ln-tape--tl" aria-hidden="true" />
            <div className="ln-section-head">
              <span className="ln-stamp">{page('01')}</span>
              <h2 className="ln-h2 ln-hand">{t.landing.feelingHeading}</h2>
            </div>

            <div className="ln-scraps">
              <p className="ln-hand ln-scrap" style={tilt(-1.5)}>
                {t.landing.feeling1}
              </p>
              <p className="ln-hand ln-scrap" style={tilt(1.2)}>
                {t.landing.feeling2}
              </p>
              <p className="ln-hand ln-scrap" style={tilt(-0.9)}>
                {t.landing.feeling3}
              </p>
              <p className="ln-hand ln-scrap" style={tilt(1.6)}>
                {t.landing.feeling4}
              </p>
            </div>

            <p className="ln-hand ln-pencil">
              <HandArrow className="ln-doodle-arrow" />
              <span>{t.landing.feelingMarginNote}</span>
            </p>

            <TornEdge />
          </div>
        </section>

        {/* 3 — how it sits next to you */}
        <section id="how" className="ln-section" data-reveal style={tilt(-0.5)}>
          <div className="ln-sheet">
            <span className="ln-tape ln-tape--tr" aria-hidden="true" />
            <div className="ln-section-head">
              <span className="ln-stamp">{page('02')}</span>
              <h2 className="ln-h2 ln-hand">{t.landing.howHeading}</h2>
            </div>

            <div className="ln-steps">
              {steps.map((step, index) => (
                <React.Fragment key={step.title}>
                  {index > 0 && (
                    <>
                      <svg
                        className="ln-connector ln-connector--v"
                        viewBox="0 0 26 44"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <path d="M13 3c-6 12 8 20 0 33" />
                        <path d="M8 32l5 8 6-7" />
                      </svg>
                      <svg
                        className="ln-connector ln-connector--h"
                        viewBox="0 0 54 40"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <path d="M3 20c12-9 26 9 40-1" />
                        <path d="M35 11l8 8-9 6" />
                      </svg>
                    </>
                  )}

                  <div className="ln-strip" style={tilt(step.deg)}>
                    <span className="ln-strip__num" aria-hidden="true">
                      {index + 1}
                    </span>
                    <h3 className="ln-h3 ln-hand">{step.title}</h3>
                    <p className="ln-body ln-soft">{step.text}</p>
                  </div>
                </React.Fragment>
              ))}
            </div>

            <TornEdge />
          </div>
        </section>

        {/* 4 — the pause moment */}
        <section id="pause" className="ln-section" data-reveal style={tilt(0.6)}>
          <div className="ln-sheet">
            <span className="ln-tape ln-tape--tl" aria-hidden="true" />
            <div className="ln-section-head">
              <span className="ln-stamp">{page('03')}</span>
              <h2 className="ln-h2 ln-hand">{t.landing.pauseHeading}</h2>
            </div>

            <div className="ln-pause">
              <div className="ln-frame">
                <div className="ln-screen">
                  <span className="ln-pause-badge">{t.landing.pauseBadge}</span>
                  <svg viewBox="0 0 200 110" aria-hidden="true" focusable="false">
                    <line x1="14" y1="86" x2="188" y2="86" strokeDasharray="4 6" />
                    <path d="M22 86c22-38 48-38 70 0" />
                    <path d="M96 86c22-38 48-38 70 0" />
                    <path d="M60 24v40" />
                    <path d="M60 34l22 10-22 10" />
                  </svg>
                </div>
                <div className="ln-pause-meta">
                  <span aria-hidden="true">◼ 12:40</span>
                  <span aria-hidden="true">48:10</span>
                </div>
              </div>

              <div>
                <div className="ln-note ln-note--pause">
                  <span className="ln-write-wrap">
                    <span className="ln-pen" aria-hidden="true" />
                    <p className="ln-hand ln-write">{t.landing.pauseNote}</p>
                  </span>
                </div>

                <p className="ln-small ln-pencil-note">
                  <HandArrow className="ln-doodle-arrow" />
                  <span>{t.landing.pauseMarginNote}</span>
                </p>

                <button
                  type="button"
                  className={`ln-stamp-btn ${language === 'hi' ? 'ln-btn-sm-hi' : ''}`}
                  aria-expanded={showHint}
                  aria-controls="pause-hint"
                  onClick={() => setShowHint((open) => !open)}
                >
                  {t.landing.pauseButton}
                </button>

                {showHint && (
                  <p id="pause-hint" className="ln-body ln-hint">
                    {t.landing.pauseReveal}
                  </p>
                )}
              </div>
            </div>

            <TornEdge />
          </div>
        </section>

        {/* 5 — one idea, four languages */}
        <section id="language" className="ln-section" data-reveal style={tilt(-0.4)}>
          <div className="ln-sheet">
            <span className="ln-tape ln-tape--tr" aria-hidden="true" />
            <div className="ln-section-head">
              <span className="ln-stamp">{page('04')}</span>
              <h2 className="ln-h2 ln-hand">{t.landing.languageHeading}</h2>
            </div>

            <p className="ln-body ln-soft">{t.landing.languageLine}</p>

            <div className="ln-slips">
              {slips.map((slip) => (
                <div key={slip.label} className="ln-slip" style={tilt(slip.deg)}>
                  <span className="ln-slip__label">{slip.label}</span>
                  <p className="ln-slip__line" lang={slip.lang}>
                    {slip.text}
                  </p>
                  <p className="ln-slip__word">
                    <span className="ln-exam-word">{t.landing.examWord}</span>{' '}
                    — {t.landing.examWordLabel}
                  </p>
                </div>
              ))}
            </div>

            <TornEdge />
          </div>
        </section>

        {/* 6 — small promises */}
        <section id="promises" className="ln-section" data-reveal style={tilt(0.3)}>
          <div className="ln-sheet">
            <span className="ln-tape ln-tape--tl" aria-hidden="true" />
            <div className="ln-section-head">
              <span className="ln-stamp">{page('05')}</span>
              <h2 className="ln-h2 ln-hand">{t.landing.promisesHeading}</h2>
            </div>

            <div className="ln-stickies">
              {promises.map((promise) => (
                <div
                  key={promise.title}
                  className={`ln-sticky ln-sticky--${promise.tint}`}
                  style={tilt(promise.deg)}
                >
                  <h3 className="ln-h3 ln-hand">{promise.title}</h3>
                  <p>{promise.text}</p>
                </div>
              ))}
            </div>

            <TornEdge />
          </div>
        </section>

        {/* 7 — a student's note */}
        <section id="note" className="ln-section" data-reveal style={tilt(-0.6)}>
          <div className="ln-sheet">
            <span className="ln-clip" aria-hidden="true">
              <svg
                viewBox="0 0 30 52"
                width="30"
                height="52"
                aria-hidden="true"
                focusable="false"
              >
                <path d="M9 42V12a6 6 0 0112 0v26a9 9 0 01-18 0V16" />
              </svg>
            </span>
            <div className="ln-section-head">
              <span className="ln-stamp">{page('06')}</span>
              <h2 className="ln-h2 ln-hand">{t.landing.studentNoteLabel}</h2>
            </div>

            <div className="ln-letter" style={tilt(1.1)}>
              <p className="ln-hand ln-letter__quote">
                {t.landing.studentNoteQuote}
              </p>
              <p className="ln-hand ln-letter__sign">
                {t.landing.studentNoteSign}
              </p>
              <p className="ln-letter__note">{t.landing.studentNoteDisclaimer}</p>
            </div>

            <TornEdge />
          </div>
        </section>

        {/* 8 — closing page */}
        <section id="closing" className="ln-section ln-closing" data-reveal style={tilt(0.2)}>
          <h2 className="ln-h1 ln-hand">{t.landing.closingTitle}</h2>

          <div className="ln-actions">
            <button
              type="button"
              className="ln-btn"
              onClick={() => onStart('dashboard')}
            >
              {t.landing.closingButton}
              <svg
                className="ln-btn__arrow"
                viewBox="0 0 24 12"
                aria-hidden="true"
                focusable="false"
              >
                <path d="M1 6h20" />
                <path d="M16 1.5L21.5 6 16 10.5" />
              </svg>
            </button>
          </div>

          <p className="ln-small" style={{ marginTop: '0.9rem' }}>
            <Tick className="ln-tick" />
            <span className="ln-hand ln-footer__note">{t.landing.footerNote}</span>
          </p>

          <footer className="ln-footer">
            <p className="ln-small ln-footer-note">{t.landing.footerSignature}</p>
            <ul className="ln-footer__links">
              <li>
                <a href="#feeling">{t.landing.footerFeeling}</a>
              </li>
              <li>
                <a href="#how">{t.landing.footerHow}</a>
              </li>
              <li>
                <a href="#promises">{t.landing.footerPromises}</a>
              </li>
              <li>
                <a href="#top">{t.landing.footerTop}</a>
              </li>
            </ul>
          </footer>
        </section>
      </div>
    </div>
  );
};
