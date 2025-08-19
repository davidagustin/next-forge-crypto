'use client';

import { useState } from 'react';

interface TechnicalDashboardProps {
  symbol: string;
}

export default function TechnicalDashboard({ symbol }: TechnicalDashboardProps) {
  const [loading, setLoading] = useState(false);

  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Technical Dashboard - {symbol}</h2>
      {loading ? (
        <div className="text-gray-400">Loading technical indicators...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">RSI</h3>
            <p className="text-gray-400">Relative Strength Index</p>
            <p className="text-2xl font-bold text-green-400">65.2</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">MACD</h3>
            <p className="text-gray-400">Moving Average Convergence Divergence</p>
            <p className="text-2xl font-bold text-blue-400">0.023</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">Bollinger Bands</h3>
            <p className="text-gray-400">Upper: $45,230</p>
            <p className="text-gray-400">Lower: $42,180</p>
            <p className="text-2xl font-bold text-yellow-400">$43,850</p>
          </div>
        </div>
      )}
    </div>
  );
}
