'use client';

import AgentPanel from '@/components/crypto/AgentPanel';
import CryptoList from '@/components/crypto/CryptoList';
import { BarChart3 } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const TradingViewChart = dynamic(
  () => import('@/components/crypto/TradingViewChart'),
  { ssr: false }
);

const TradingViewTechnicalAnalysis = dynamic(
  () => import('@/components/crypto/TradingViewTechnicalAnalysis'),
  { ssr: false }
);

export default function CryptoAnalysisPage() {
  const [selectedSymbol, setSelectedSymbol] = useState('BTC/USDT');
  const [timeframe, setTimeframe] = useState('60');
  const [activeTab, setActiveTab] = useState<'chart' | 'technical'>('chart');
  const [currentPrice, setCurrentPrice] = useState<number>(45000);
  const [indicators, setIndicators] = useState<any>({
    rsi: 55,
    sma20: 44000,
    sma50: 43000,
    support: [42000, 41000],
    resistance: [46000, 47000],
  });

  const timeframes = [
    { label: '1m', value: '1' },
    { label: '5m', value: '5' },
    { label: '15m', value: '15' },
    { label: '1H', value: '60' },
    { label: '4H', value: '240' },
    { label: '1D', value: 'D' },
    { label: '1W', value: 'W' },
  ];

  const getInterval = (tf: string): string => {
    if (tf === 'D') {
      return '1D';
    }
    if (tf === 'W') {
      return '1W';
    }
    return '1h';
  };

  // Fetch crypto data when symbol changes
  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        // Simulate fetching real data - in a real app, you'd call your API
        const mockPrices: { [key: string]: number } = {
          'BTC/USDT': 45000,
          'ETH/USDT': 3200,
          'SOL/USDT': 140,
          'BNB/USDT': 560,
          'XRP/USDT': 0.54,
          'ADA/USDT': 0.46,
          'DOGE/USDT': 0.099,
          'AVAX/USDT': 34.5,
        };
        
        const mockIndicators: { [key: string]: any } = {
          'BTC/USDT': { rsi: 55, sma20: 44000, sma50: 43000, support: [42000, 41000], resistance: [46000, 47000] },
          'ETH/USDT': { rsi: 48, sma20: 3150, sma50: 3050, support: [3000, 2900], resistance: [3300, 3400] },
          'SOL/USDT': { rsi: 62, sma20: 135, sma50: 125, support: [120, 110], resistance: [150, 160] },
          'BNB/USDT': { rsi: 52, sma20: 550, sma50: 540, support: [530, 520], resistance: [570, 580] },
          'XRP/USDT': { rsi: 45, sma20: 0.52, sma50: 0.50, support: [0.48, 0.46], resistance: [0.56, 0.58] },
          'ADA/USDT': { rsi: 58, sma20: 0.44, sma50: 0.42, support: [0.40, 0.38], resistance: [0.48, 0.50] },
          'DOGE/USDT': { rsi: 65, sma20: 0.095, sma50: 0.090, support: [0.085, 0.080], resistance: [0.105, 0.110] },
          'AVAX/USDT': { rsi: 51, sma20: 33, sma50: 32, support: [31, 30], resistance: [36, 37] },
        };

        setCurrentPrice(mockPrices[selectedSymbol] || 45000);
        setIndicators(mockIndicators[selectedSymbol] || {
          rsi: 55,
          sma20: 44000,
          sma50: 43000,
          support: [42000, 41000],
          resistance: [46000, 47000],
        });
      } catch (error) {
        console.error('Error fetching crypto data:', error);
      }
    };

    fetchCryptoData();
  }, [selectedSymbol]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <h1 className="flex items-center gap-3 font-bold text-3xl text-gray-900 dark:text-white">
            <BarChart3 className="h-8 w-8 text-blue-500" />
            Cryptocurrency Analysis Dashboard
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Real-time charts, technical analysis, and AI-powered insights
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <CryptoList
              onSelectSymbol={setSelectedSymbol}
              selectedSymbol={selectedSymbol}
            />
          </div>

          <div className="space-y-6 lg:col-span-3">
            <div className="rounded-lg bg-white p-4 shadow-lg dark:bg-gray-800">
              <div className="mb-4 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <h2 className="font-semibold text-xl">{selectedSymbol}</h2>
                <div className="flex gap-2">
                  <div className="flex rounded-lg bg-gray-100 p-1 dark:bg-gray-700">
                    <button
                      type="button"
                      onClick={() => setActiveTab('chart')}
                      className={`rounded px-3 py-1 ${
                        activeTab === 'chart'
                          ? 'bg-white shadow dark:bg-gray-600'
                          : ''
                      }`}
                    >
                      Chart
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('technical')}
                      className={`rounded px-3 py-1 ${
                        activeTab === 'technical'
                          ? 'bg-white shadow dark:bg-gray-600'
                          : ''
                      }`}
                    >
                      Technical
                    </button>
                  </div>
                  <div className="flex gap-1">
                    {timeframes.map((tf) => (
                      <button
                        key={tf.value}
                        type="button"
                        onClick={() => setTimeframe(tf.value)}
                        className={`rounded px-2 py-1 text-sm ${
                          timeframe === tf.value
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600'
                        }`}
                      >
                        {tf.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {activeTab === 'chart' ? (
                <TradingViewChart
                  symbol={selectedSymbol}
                  interval={timeframe}
                  theme="dark"
                  height={500}
                />
              ) : (
                <TradingViewTechnicalAnalysis
                  symbol={selectedSymbol}
                  interval={getInterval(timeframe)}
                  theme="dark"
                />
              )}
            </div>

            <AgentPanel
              symbol={selectedSymbol}
              currentPrice={currentPrice}
              indicators={indicators}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
