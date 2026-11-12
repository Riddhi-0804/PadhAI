import React, { createContext, useContext, useState, useEffect } from 'react';

interface BandwidthContextType {
  isLowBandwidth: boolean;
  toggleLowBandwidth: () => void;
  isOnline: boolean;
}

const BandwidthContext = createContext<BandwidthContextType | undefined>(undefined);

export const BandwidthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLowBandwidth, setIsLowBandwidth] = useState<boolean>(() => {
    return localStorage.getItem('padhai_low_bandwidth') === 'true';
  });

  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const toggleLowBandwidth = () => {
    setIsLowBandwidth((prev) => {
      const next = !prev;
      localStorage.setItem('padhai_low_bandwidth', String(next));
      return next;
    });
  };

  return (
    <BandwidthContext.Provider value={{ isLowBandwidth, toggleLowBandwidth, isOnline }}>
      {children}
    </BandwidthContext.Provider>
  );
};

export const useBandwidth = () => {
  const context = useContext(BandwidthContext);
  if (!context) {
    throw new Error('useBandwidth must be used within a BandwidthProvider');
  }
  return context;
};
