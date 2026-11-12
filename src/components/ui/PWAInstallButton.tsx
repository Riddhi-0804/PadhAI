import React, { useState } from 'react';
import { Download, Smartphone, X } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running in standalone mode, hide button
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        type="button"
        className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono-time font-semibold rounded-[2px] bg-[var(--marigold-light)] border border-[var(--marigold-border)] text-[var(--marigold-accent)] hover:opacity-90 transition cursor-pointer"
        title="Install PadhAI app on home screen"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Install App</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          type="button"
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono-time rounded-[2px] border border-[var(--paper-border)] bg-[var(--paper-card)] text-[var(--ink-primary)] hover:border-[var(--ink-muted)] transition cursor-pointer"
        >
          <Smartphone className="w-3.5 h-3.5 text-[var(--marigold-accent)]" />
          <span>Add to iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-sm rounded-sm bg-[var(--paper-bg)] border border-[var(--paper-border)] p-5 shadow-[var(--paper-shadow-lift)] text-left space-y-3">
              <div className="flex items-center justify-between border-b border-[var(--paper-border)] pb-2">
                <h4 className="font-serif-title text-base font-bold text-[var(--ink-primary)]">
                  Install PadhAI on iPhone / iPad
                </h4>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 text-[var(--ink-muted)] hover:text-[var(--ink-primary)] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-[var(--ink-secondary)] leading-relaxed">
                1. Tap the <strong>Share</strong> button (box with upward arrow) in the Safari toolbar.<br />
                2. Scroll down and tap <strong>Add to Home Screen</strong>.<br />
                3. Open PadhAI directly without browser bars for distraction-free study.
              </p>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full py-2 rounded-xs bg-[var(--ink-primary)] text-[var(--paper-bg)] text-xs font-mono-time font-semibold cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Default subtle fallback button if browser hasn't fired beforeinstallprompt yet
  return (
    <button
      onClick={() => {
        alert('To install PadhAI: On Chrome/Edge, click the install icon in the address bar; on Android tap "Add to Home Screen" in browser menu.');
      }}
      type="button"
      className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono-time rounded-[2px] border border-[var(--paper-border)] bg-[var(--paper-card)] text-[var(--ink-muted)] hover:text-[var(--ink-primary)] transition cursor-pointer"
      title="Install PWA"
    >
      <Download className="w-3 h-3 text-[var(--marigold-accent)]" />
      <span>Install App</span>
    </button>
  );
};
