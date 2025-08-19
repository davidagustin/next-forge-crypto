'use client';

import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, TrendingDown, Activity, DollarSign, Clock, Volume2, Target, AlertTriangle } from 'lucide-react';
import AgentPanel from '../../components/crypto/AgentPanel';
import TradingViewChart from '../../components/crypto/TradingViewChart';

export default function CryptoPage() {
  const [selectedSymbol, setSelectedSymbol] = useState('BTC/USDT');
  const [marketData, setMarketData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const cryptos = [
    { symbol: 'BTC/USDT', name: 'Bitcoin', price: 67543.21, change: 2.34, volume: '2.3B' },
    { symbol: 'ETH/USDT', name: 'Ethereum', price: 3456.78, change: -1.23, volume: '1.8B' },
    { symbol: 'BNB/USDT', name: 'Binance Coin', price: 612.34, change: 3.45, volume: '456M' },
    { symbol: 'SOL/USDT', name: 'Solana', price: 145.67, change: 5.67, volume: '234M' },
    { symbol: 'XRP/USDT', name: 'Ripple', price: 0.6234, change: -0.89, volume: '1.2B' },
    { symbol: 'ADA/USDT', name: 'Cardano', price: 0.4567, change: 1.23, volume: '345M' },
    { symbol: 'AVAX/USDT', name: 'Avalanche', price: 38.90, change: 4.56, volume: '123M' },
    { symbol: 'DOT/USDT', name: 'Polkadot', price: 7.89, change: -2.34, volume: '89M' },
  ];

  useEffect(() => {
    fetchMarketData();
  }, [selectedSymbol]);

  const fetchMarketData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/crypto/ticker?symbol=${selectedSymbol}`);
      if (response.ok) {
        const data = await response.json();
        setMarketData(data);
      }
    } catch (error) {
      console.error('Error fetching market data:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectedCrypto = cryptos.find(c => c.symbol === selectedSymbol) || cryptos[0];

  const marketStats = [
    { label: 'Market Cap', value: '$1.2T', change: '+2.3%', positive: true },
    { label: 'Total Volume', value: '$45.6B', change: '+5.7%', positive: true },
    { label: 'BTC Dominance', value: '54.2%', change: '-0.4%', positive: false },
    { label: 'ETH Dominance', value: '18.7%', change: '+0.2%', positive: true },
  ];

  const newsItems = [
    { title: 'Bitcoin reaches new monthly high as institutional adoption grows', time: '2h ago' },
    { title: 'Ethereum network upgrade scheduled for next quarter', time: '4h ago' },
    { title: 'Major exchange announces new DeFi trading pairs', time: '6h ago' },
    { title: 'Regulatory clarity boosts crypto market sentiment', time: '8h ago' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <div className="container mx-auto p-6">
        <div className="flex items-center gap-3 mb-8">
          <BarChart3 className="w-10 h-10 text-blue-500" />
          <div>
            <h1 className="text-4xl font-bold">Cryptocurrency Dashboard</h1>
            <p className="text-gray-400 mt-1">Professional trading charts with TradingView and AI-powered insights</p>
          </div>
        </div>

        {/* Market Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {marketStats.map((stat, index) => (
            <div key={index} className="bg-gray-800/50 backdrop-blur rounded-xl p-4 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                  <p className="text-xl font-bold">{stat.value}</p>
                </div>
                <div className={`text-sm ${stat.positive ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.change}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Crypto List */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/50 backdrop-blur rounded-xl p-4 border border-gray-700 mb-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-500" />
                Markets
              </h2>
              <div className="space-y-2">
                {cryptos.map((crypto) => (
                  <div
                    key={crypto.symbol}
                    onClick={() => setSelectedSymbol(crypto.symbol)}
                    className={`p-3 rounded-lg cursor-pointer transition-all hover:scale-102 ${
                      selectedSymbol === crypto.symbol
                        ? 'bg-blue-600/20 border border-blue-500 shadow-lg'
                        : 'hover:bg-gray-700/50'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-semibold">{crypto.symbol.split('/')[0]}</div>
                        <div className="text-sm text-gray-400">{crypto.name}</div>
                        <div className="text-xs text-gray-500">Vol: {crypto.volume}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">${crypto.price.toLocaleString()}</div>
                        <div className={`flex items-center gap-1 text-sm ${
                          crypto.change >= 0 ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {crypto.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          {Math.abs(crypto.change).toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Market News */}
            <div className="bg-gray-800/50 backdrop-blur rounded-xl p-4 border border-gray-700">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                Market News
              </h3>
              <div className="space-y-3">
                {newsItems.map((news, index) => (
                  <div key={index} className="p-3 bg-gray-900/50 rounded-lg">
                    <p className="text-sm text-gray-300 mb-1">{news.title}</p>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      {news.time}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Price Header */}
            <div className="bg-gray-800/50 backdrop-blur rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-8 h-8 text-green-500" />
                  <div>
                    <h2 className="text-3xl font-bold">{selectedSymbol}</h2>
                    <p className="text-gray-400">{selectedCrypto.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold">${selectedCrypto.price.toLocaleString()}</div>
                  <div className={`flex items-center justify-end gap-2 text-xl ${
                    selectedCrypto.change >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {selectedCrypto.change >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                    {selectedCrypto.change >= 0 ? '+' : ''}{selectedCrypto.change.toFixed(2)}%
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-900/50 rounded-lg p-3">
                  <div className="text-gray-400 text-sm flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    24h High
                  </div>
                  <div className="text-xl font-semibold">${(selectedCrypto.price * 1.05).toFixed(2)}</div>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-3">
                  <div className="text-gray-400 text-sm flex items-center gap-1">
                    <TrendingDown className="w-3 h-3" />
                    24h Low
                  </div>
                  <div className="text-xl font-semibold">${(selectedCrypto.price * 0.95).toFixed(2)}</div>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-3">
                  <div className="text-gray-400 text-sm flex items-center gap-1">
                    <Volume2 className="w-3 h-3" />
                    24h Volume
                  </div>
                  <div className="text-xl font-semibold">{selectedCrypto.volume}</div>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-3">
                  <div className="text-gray-400 text-sm flex items-center gap-1">
                    <Target className="w-3 h-3" />
                    Market Cap
                  </div>
                  <div className="text-xl font-semibold">${(Math.random() * 1000).toFixed(2)}B</div>
                </div>
              </div>
            </div>

            {/* TradingView Widget */}
            <div className="bg-gray-800/50 backdrop-blur rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-500" />
                Price Chart
                <span className="text-sm text-gray-400 ml-auto">Powered by TradingView</span>
              </h3>
              <div className="bg-gray-900/50 rounded-lg overflow-hidden">
                <TradingViewChart
                  symbol={selectedSymbol}
                  interval="60"
                  theme="dark"
                  height={500}
                />
              </div>
            </div>

            {/* Technical Indicators */}
            <div className="bg-gray-800/50 backdrop-blur rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-500" />
                Technical Indicators
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-900/50 rounded-lg p-4 border border-yellow-500/20">
                  <div className="text-gray-400 text-sm">RSI (14)</div>
                  <div className="text-2xl font-semibold text-yellow-500">52.34</div>
                  <div className="text-xs text-gray-500">Neutral Zone</div>
                  <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{width: '52%'}}></div>
                  </div>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-4 border border-green-500/20">
                  <div className="text-gray-400 text-sm">MACD</div>
                  <div className="text-2xl font-semibold text-green-500">Bullish</div>
                  <div className="text-xs text-gray-500">Signal: Strong Buy</div>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-green-500 text-sm">+0.42</span>
                  </div>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-4 border border-blue-500/20">
                  <div className="text-gray-400 text-sm">SMA (20)</div>
                  <div className="text-2xl font-semibold">${(selectedCrypto.price * 0.98).toFixed(2)}</div>
                  <div className="text-xs text-gray-500">Above Average</div>
                  <div className="text-blue-500 text-sm mt-1">+${(selectedCrypto.price * 0.02).toFixed(2)}</div>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-4 border border-purple-500/20">
                  <div className="text-gray-400 text-sm">EMA (50)</div>
                  <div className="text-2xl font-semibold">${(selectedCrypto.price * 0.96).toFixed(2)}</div>
                  <div className="text-xs text-gray-500">Above Average</div>
                  <div className="text-purple-500 text-sm mt-1">+${(selectedCrypto.price * 0.04).toFixed(2)}</div>
                </div>
              </div>
              
              {/* Support & Resistance */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-red-900/20 rounded-lg p-4 border border-red-500/20">
                  <h4 className="text-red-400 font-semibold mb-2 flex items-center gap-2">
                    <TrendingDown className="w-4 h-4" />
                    Resistance Levels
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">R3:</span>
                      <span className="text-red-400">${(selectedCrypto.price * 1.08).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">R2:</span>
                      <span className="text-red-400">${(selectedCrypto.price * 1.05).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">R1:</span>
                      <span className="text-red-400">${(selectedCrypto.price * 1.02).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-green-900/20 rounded-lg p-4 border border-green-500/20">
                  <h4 className="text-green-400 font-semibold mb-2 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Support Levels
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">S1:</span>
                      <span className="text-green-400">${(selectedCrypto.price * 0.98).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">S2:</span>
                      <span className="text-green-400">${(selectedCrypto.price * 0.95).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">S3:</span>
                      <span className="text-green-400">${(selectedCrypto.price * 0.92).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Assistant */}
            <AgentPanel
              symbol={selectedSymbol}
              currentPrice={selectedCrypto.price}
              indicators={{
                rsi: 52.34,
                sma20: selectedCrypto.price * 0.98,
                sma50: selectedCrypto.price * 0.96,
                support: [selectedCrypto.price * 0.95, selectedCrypto.price * 0.92],
                resistance: [selectedCrypto.price * 1.03, selectedCrypto.price * 1.06],
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}