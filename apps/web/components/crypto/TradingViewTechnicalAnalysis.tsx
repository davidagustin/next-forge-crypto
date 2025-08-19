'use client';

import { useEffect, useRef } from 'react';

interface TradingViewTechnicalAnalysisProps {
  symbol: string;
  theme?: 'light' | 'dark';
  interval?: string;
}

export default function TradingViewTechnicalAnalysis({
  symbol,
  theme = 'dark',
  interval = '1m',
}: TradingViewTechnicalAnalysisProps) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) {
      return;
    }

    const script = document.createElement('script');
    script.src =
      'https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      interval: interval,
      width: '100%',
      isTransparent: false,
      height: '400',
      symbol: symbol,
      showIntervalTabs: true,
      locale: 'en',
      colorTheme: theme,
    });

    container.current.appendChild(script);

    return () => {
      if (container.current) {
        container.current.innerHTML = '';
      }
    };
  }, [symbol, theme]);

  return (
    <div className="tradingview-widget-container">
      <div ref={container} className="tradingview-widget-container__widget" />
    </div>
  );
}
