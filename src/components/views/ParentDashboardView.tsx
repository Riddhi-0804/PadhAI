import React, { useState } from 'react';
import {
  Heart,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Award,
  BookOpen,
  MessageSquare,
  Calendar,
  Languages,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Tag } from '../ui/Tag';
import { Button } from '../ui/Button';

export const ParentDashboardView: React.FC = () => {
  const { user } = useAuth();
  const [reportLang, setReportLang] = useState<'hi' | 'en'>('hi');

  return (
    <div className="w-full text-left space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-sm border border-[var(--paper-border)] bg-[var(--paper-card)]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Tag variant="ink">PARENT PORTAL</Tag>
            <span className="text-xs font-mono-time text-[var(--ink-muted)]">
              {reportLang === 'hi'
                ? 'विद्यार्थी: अर्जुन शर्मा (कक्षा 12वीं CBSE - भौतिक विज्ञान)'
                : 'Student: Arjun Sharma (Class 12 CBSE - Physics & Maths)'}
            </span>
          </div>
          <h2 className="font-serif-title text-2xl font-bold text-[var(--ink-primary)]">
            {reportLang === 'hi'
              ? 'साप्ताहिक अध्ययन प्रगति रिपोर्ट'
              : 'Weekly Student Progress Digest'}
          </h2>
          <p className="text-xs text-[var(--ink-muted)] mt-0.5">
            {reportLang === 'hi'
              ? 'माता-पिता के लिए सरल और स्पष्ट भाषा में अर्जुन के अध्ययन और आत्मविश्वास का साप्ताहिक विवरण।'
              : 'Plain, reassuring weekly summary of study hours, concept mastery, and teacher feedback.'}
          </p>
        </div>

        {/* Parent Language Switcher */}
        <div className="flex items-center gap-2 rounded-sm border border-[var(--paper-border)] p-1 bg-[var(--paper-elevated)] text-xs font-mono-time shrink-0">
          <Languages className="w-3.5 h-3.5 text-[var(--marigold-accent)] ml-1" />
          <button
            onClick={() => setReportLang('hi')}
            className={`py-1 px-2.5 rounded-[2px] transition-colors cursor-pointer ${
              reportLang === 'hi'
                ? 'bg-[var(--marigold-accent)] text-white font-bold'
                : 'text-[var(--ink-muted)] hover:text-[var(--ink-primary)]'
            }`}
          >
            हिंदी में पढ़ें
          </button>
          <button
            onClick={() => setReportLang('en')}
            className={`py-1 px-2.5 rounded-[2px] transition-colors cursor-pointer ${
              reportLang === 'en'
                ? 'bg-[var(--ink-primary)] text-[var(--paper-bg)] font-bold'
                : 'text-[var(--ink-muted)] hover:text-[var(--ink-primary)]'
            }`}
          >
            In English
          </button>
        </div>
      </div>

      {/* Reassuring Big Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-sm border border-[var(--paper-border)] bg-[var(--paper-card)]">
          <span className="text-[10px] font-mono-time uppercase text-[var(--ink-muted)] block">
            {reportLang === 'hi' ? 'इस सप्ताह कुल अध्ययन' : 'Weekly Study Time'}
          </span>
          <span className="text-2xl font-bold font-mono-time text-[var(--marigold-accent)] block mt-1">
            {reportLang === 'hi' ? '9.5 घंटे' : '9.5 Hours'}
          </span>
          <span className="text-xs text-[var(--ink-muted)] mt-1 block">
            {reportLang === 'hi'
              ? 'बिना तनाव के नियमित समय (औसतन 1.5 घंटे प्रतिदिन)'
              : 'Consistent schedule without late-night cramming'}
          </span>
        </div>

        <div className="p-4 rounded-sm border border-[var(--paper-border)] bg-[var(--paper-card)]">
          <span className="text-[10px] font-mono-time uppercase text-[var(--ink-muted)] block">
            {reportLang === 'hi' ? 'न्यूमेरिकल अभ्यास' : 'Numericals Solved'}
          </span>
          <span className="text-2xl font-bold font-mono-time text-[var(--ink-primary)] block mt-1">
            {reportLang === 'hi' ? '25 सवाल हल किए' : '25 Solved'}
          </span>
          <span className="text-xs text-[var(--ink-muted)] mt-1 block">
            {reportLang === 'hi'
              ? 'रे ऑप्टिक्स में 88% सटीकता हासिल की'
              : '88% accuracy in Ray Optics & Lens Maker'}
          </span>
        </div>

        <div className="p-4 rounded-sm border border-[var(--paper-border)] bg-[var(--paper-card)]">
          <span className="text-[10px] font-mono-time uppercase text-[var(--ink-muted)] block">
            {reportLang === 'hi' ? 'शंका समाधान (Doubts)' : 'Lecture Doubts Asked'}
          </span>
          <span className="text-2xl font-bold font-mono-time text-[var(--ink-primary)] block mt-1">
            {reportLang === 'hi' ? '6 प्रश्न पूछे' : '6 Questions'}
          </span>
          <span className="text-xs text-[var(--ink-muted)] mt-1 block">
            {reportLang === 'hi'
              ? 'वीडियो रोककर तुरंत शंका दूर की गई'
              : 'Paused and resolved immediately at key points'}
          </span>
        </div>
      </div>

      {/* Main Narrative Report */}
      <div className="p-5 sm:p-6 rounded-sm border border-[var(--paper-border)] bg-[var(--paper-card)] space-y-4">
        <div className="flex items-center gap-2 border-b border-[var(--paper-rule)] pb-3">
          <Heart className="w-4 h-4 text-[var(--brick-red)]" />
          <h3 className="font-serif-title text-lg font-bold text-[var(--ink-primary)]">
            {reportLang === 'hi' ? 'साप्ताहिक सारांश और मार्गदर्शन' : 'Weekly Academic Summary & Advice'}
          </h3>
        </div>

        {reportLang === 'hi' ? (
          <div className="text-xs sm:text-sm text-[var(--ink-primary)] leading-relaxed space-y-3 font-body">
            <p>
              नमस्ते <strong>सुनीता जी</strong>, इस सप्ताह अर्जुन ने भौतिक विज्ञान (Physics) में बहुत अच्छा अनुशासन दिखाया है।
              उसने लेंस मेकर फॉर्मूला और अपवर्तन (Refraction) के 25 संख्यात्मक प्रश्नों का अभ्यास किया और
              <strong> 88% सटीकता</strong> हासिल की।
            </p>

            <div className="p-3.5 rounded-sm bg-[var(--marigold-light)] border border-[var(--marigold-border)] text-xs text-[var(--ink-primary)] space-y-1">
              <strong className="block text-[var(--marigold-accent)] font-semibold font-mono-time">
                ✓ अर्जुन की सबसे बड़ी सफलता:
              </strong>
              <span>
                उसने कठिन अध्यायों को छोड़ा नहीं। लेक्चर के दौरान 02:00 मिनट पर जब लेंस मेकर फॉर्मूला आया, तो उसने वीडियो रोककर
                अपनी शंका तुरंत पूछी और समझकर आगे बढ़ा।
              </span>
            </div>

            <div className="p-3.5 rounded-sm bg-[var(--brick-red-light)] border border-[var(--brick-red-border)] text-xs text-[var(--brick-red)] space-y-1">
              <strong className="block font-semibold font-mono-time">
                ⚠ जिस पर थोड़ा और ध्यान देना है:
              </strong>
              <span>
                वेव ऑप्टिक्स (Wave Optics) में हाइगेंस तरंग सिद्धांत के कुछ सवालों में गलती हुई है।
                डॉ. शर्मा ने उसे 3 छोटे अभ्यास प्रश्न दिए हैं जिन्हें वह कल शाम तक पूरा करेगा।
              </span>
            </div>
          </div>
        ) : (
          <div className="text-xs sm:text-sm text-[var(--ink-primary)] leading-relaxed space-y-3 font-body">
            <p>
              Dear <strong>Sunita Sharma</strong>, Arjun has maintained steady, disciplined study habits this week.
              He completed 25 numerical problems in Ray Optics & Optical Instruments with an impressive
              <strong> 88% accuracy rate</strong>.
            </p>

            <div className="p-3.5 rounded-sm bg-[var(--marigold-light)] border border-[var(--marigold-border)] text-xs text-[var(--ink-primary)] space-y-1">
              <strong className="block text-[var(--marigold-accent)] font-semibold font-mono-time">
                ✓ Arjun's Key Highlight This Week:
              </strong>
              <span>
                Instead of being a passive listener, he actively paused the lecture at 02:00 to clarify the Lens Maker sign conventions
                before the teacher revealed the solution.
              </span>
            </div>

            <div className="p-3.5 rounded-sm bg-[var(--brick-red-light)] border border-[var(--brick-red-border)] text-xs text-[var(--brick-red)] space-y-1">
              <strong className="block font-semibold font-mono-time">
                ⚠ Area Recommended for Gentle Attention:
              </strong>
              <span>
                Wave Optics (Huygens wavefront derivations) scored 58%. Dr. Sharma has provided a 3-question targeted drill
                which Arjun will revise on Wednesday without disrupting his schedule.
              </span>
            </div>
          </div>
        )}

        {/* Teacher Note Box */}
        <div className="mt-4 pt-4 border-t border-[var(--paper-rule)] flex flex-col sm:flex-row items-start gap-3 text-xs bg-[var(--paper-elevated)] p-4 rounded-sm border border-[var(--paper-border)]">
          <BookOpen className="w-5 h-5 text-[var(--marigold-accent)] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold text-[var(--ink-primary)] font-mono-time">
              {reportLang === 'hi'
                ? 'अध्यापक की टिप्पणी (डॉ. रामेश्वर शर्मा, भौतिकी विभागाध्यक्ष):'
                : 'Teacher Note from Dr. Rameshwar Sharma (HOD Physics):'}
            </span>
            <p className="text-[var(--ink-secondary)] italic font-body">
              {reportLang === 'hi'
                ? '"अर्जुन का बुनियादी गणित और फॉर्मूला प्रयोग मजबूत है। घर पर बस शाम की चाय के बाद 20 मिनट बिना मोबाइल के फॉर्मूला शीट दोहराने के लिए कहें। किसी अतिरिक्त ट्यूशन की आवश्यकता नहीं है।"'
                : '"Arjun has solid mathematical fundamentals and formula application. At home, just encourage 20 minutes of quiet formula sheet revision after evening tea. No expensive private coaching needed."'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
