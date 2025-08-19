'use client';

import { memo, useEffect, useRef } from 'react';

interface TradingViewChartProps {
  symbol: string;
  interval?: string;
  theme?: 'light' | 'dark';
  height?: number;
}

function TradingViewChart({
  symbol,
  interval = '60',
  theme = 'dark',
  height = 500,
}: TradingViewChartProps) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) {
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      if (typeof (window as any).TradingView !== 'undefined') {
        const tradingViewSymbol = symbol
          .replace('/', '')
          .replace('USDT', 'USDT.P');

        if (!container.current) {
          return;
        }

        new (window as any).TradingView.widget({
          autosize: true,
          symbol: `BINANCE:${tradingViewSymbol}`,
          interval: interval,
          timezone: 'Etc/UTC',
          theme: theme,
          style: '1',
          locale: 'en',
          enable_publishing: false,
          hide_top_toolbar: false,
          hide_legend: false,
          save_image: false,
          container_id: container.current.id,
          studies: [
            'MASimple@tv-basicstudies',
            'RSI@tv-basicstudies',
            'MACD@tv-basicstudies',
          ],
          disabled_features: ['use_localstorage_for_settings'],
          enabled_features: ['study_templates'],
          overrides: {
            'mainSeriesProperties.showCountdown': true,
            'paneProperties.background':
              theme === 'dark' ? '#1a1a1a' : '#ffffff',
            'paneProperties.vertGridProperties.color':
              theme === 'dark' ? '#363636' : '#e1e1e1',
            'paneProperties.horzGridProperties.color':
              theme === 'dark' ? '#363636' : '#e1e1e1',
            'scalesProperties.textColor': theme === 'dark' ? '#AAA' : '#555',
          },
        });
      }
    };

    const head = document.getElementsByTagName('head')[0];
    head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      if (container.current) {
        container.current.innerHTML = '';
      }
    };
  }, [symbol, interval, theme]);

  return (
    <div
      id={`tradingview_${Math.random().toString(36).substring(7)}`}
      ref={container}
      style={{ height: `${height}px` }}
      className="tradingview-widget-container"
    />
  );
}

export default memo(TradingViewChart);
export { TradingViewChart };
