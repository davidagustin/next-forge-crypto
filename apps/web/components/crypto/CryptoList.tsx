'use client';

import { TrendingDown, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';

interface CryptoListProps {
  onSelectSymbol: (symbol: string) => void;
  selectedSymbol: string;
}

export default function CryptoList({
  onSelectSymbol,
  selectedSymbol,
}: CryptoListProps) {
  const [markets, setMarkets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchMarkets = async () => {
      try {
        const response = await fetch('/api/crypto/markets');
        const data = await response.json();
        if (data.markets) {
          setMarkets(data.markets);
        }
      } catch (_error) {
      } finally {
        setLoading(false);
      }
    };

    fetchMarkets();
    const interval = setInterval(fetchMarkets, 30000);
    return () => clearInterval(interval);
  }, []);

  const filteredMarkets = markets.filter((market) =>
    market.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-blue-500 border-b-2" />
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white shadow-lg dark:bg-gray-800">
      <div className="border-b p-4 dark:border-gray-700">
        <input
          type="text"
          placeholder="Search cryptocurrency..."
          className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="max-h-[600px] overflow-y-auto">
        {filteredMarkets.map((market) => (
          <div
            key={market.symbol}
            onClick={() => onSelectSymbol(market.symbol)}
            className={`cursor-pointer border-b p-4 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700 ${
              selectedSymbol === market.symbol
                ? 'bg-blue-50 dark:bg-gray-700'
                : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">
                  {market.symbol.split('/')[0]}
                </div>
                <div className="text-gray-500 text-sm">{market.symbol}</div>
              </div>
              <div className="text-right">
                <div className="font-semibold">${market.last?.toFixed(2)}</div>
                <div
                  className={`flex items-center text-sm ${
                    market.change >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {market.change >= 0 ? (
                    <TrendingUp className="mr-1 h-4 w-4" />
                  ) : (
                    <TrendingDown className="mr-1 h-4 w-4" />
                  )}
                  {Math.abs(market.change || 0).toFixed(2)}%
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
