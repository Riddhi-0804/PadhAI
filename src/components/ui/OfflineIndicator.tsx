import React from 'react';
import { WifiOff, Zap } from 'lucide-react';
import { useBandwidth } from '../../context/BandwidthContext';

export const OfflineIndicator: React.FC = () => {
  const { isOnline, isLowBandwidth } = useBandwidth();

  if (isOnline && !isLowBandwidth) return null;

  return (
    <div className="fixed bottom-16 sm:bottom-4 left-4 z-40 flex items-center gap-2 px-3 py-1.5 rounded-sm border shadow-xs text-xs font-mono-time">
      {!isOnline ? (
        <div className="flex items-center gap-2 bg-[var(--brick-red-light)] border-[var(--brick-red-border)] text-[var(--brick-red)]">
          <WifiOff className="w-3.5 h-3.5 animate-pulse" />
          <span>Offline Mode • Notes & Tests cached locally</span>
        </div>
      ) : isLowBandwidth ? (
        <div className="flex items-center gap-2 bg-[var(--marigold-light)] border-[var(--marigold-border)] text-[var(--marigold-accent)]">
          <Zap className="w-3.5 h-3.5" />
          <span>Low-Bandwidth (2G) Mode • Text-first, videos deferred</span>
        </div>
      ) : null}
    </div>
  );
};
