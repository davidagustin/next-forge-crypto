import { NextResponse } from 'next/server';

interface MarketData {
  symbol: string;
  last: number;
  change: number;
  percentage: number;
  high: number;
  low: number;
  volume: number;
  marketCap?: number;
}

export async function GET() {
  try {
    // Mock market data for demonstration
    const mockMarkets: MarketData[] = [
      {
        symbol: 'BTC/USDT',
        last: 67543.21 + (Math.random() - 0.5) * 1000,
        change: 1543.21,
        percentage: 2.34,
        high: 68500.0,
        low: 66800.0,
        volume: 12345.67,
        marketCap: 1.32e12
      },
      {
        symbol: 'ETH/USDT',
        last: 3456.78 + (Math.random() - 0.5) * 100,
        change: -42.22,
        percentage: -1.23,
        high: 3500.0,
        low: 3400.0,
        volume: 54321.09,
        marketCap: 4.15e11
      },
      {
        symbol: 'BNB/USDT',
        last: 612.34 + (Math.random() - 0.5) * 20,
        change: 21.12,
        percentage: 3.45,
        high: 625.0,
        low: 590.0,
        volume: 23456.78,
        marketCap: 9.4e10
      },
      {
        symbol: 'SOL/USDT',
        last: 145.67 + (Math.random() - 0.5) * 10,
        change: 7.89,
        percentage: 5.67,
        high: 150.0,
        low: 140.0,
        volume: 234567.89,
        marketCap: 6.5e10
      },
      {
        symbol: 'XRP/USDT',
        last: 0.6234 + (Math.random() - 0.5) * 0.05,
        change: -0.0055,
        percentage: -0.89,
        high: 0.635,
        low: 0.615,
        volume: 891234.56,
        marketCap: 3.4e10
      },
      {
        symbol: 'ADA/USDT',
        last: 0.4567 + (Math.random() - 0.5) * 0.03,
        change: 0.0056,
        percentage: 1.23,
        high: 0.465,
        low: 0.445,
        volume: 567890.12,
        marketCap: 1.6e10
      },
      {
        symbol: 'AVAX/USDT',
        last: 38.90 + (Math.random() - 0.5) * 2,
        change: 1.77,
        percentage: 4.56,
        high: 40.5,
        low: 37.2,
        volume: 345678.90,
        marketCap: 1.5e10
      },
      {
        symbol: 'DOT/USDT',
        last: 7.89 + (Math.random() - 0.5) * 0.5,
        change: -0.18,
        percentage: -2.34,
        high: 8.1,
        low: 7.7,
        volume: 123456.78,
        marketCap: 1.1e10
      },
      {
        symbol: 'MATIC/USDT',
        last: 1.234 + (Math.random() - 0.5) * 0.1,
        change: 0.087,
        percentage: 7.12,
        high: 1.28,
        low: 1.15,
        volume: 456789.01,
        marketCap: 1.2e10
      },
      {
        symbol: 'LINK/USDT',
        last: 19.45 + (Math.random() - 0.5) * 1,
        change: -0.67,
        percentage: -3.33,
        high: 20.1,
        low: 19.2,
        volume: 234567.89,
        marketCap: 1.1e10
      },
      {
        symbol: 'UNI/USDT',
        last: 12.34 + (Math.random() - 0.5) * 0.8,
        change: 0.45,
        percentage: 3.78,
        high: 12.8,
        low: 11.9,
        volume: 345678.90,
        marketCap: 7.4e9
      },
      {
        symbol: 'ATOM/USDT',
        last: 15.67 + (Math.random() - 0.5) * 1,
        change: 0.89,
        percentage: 6.02,
        high: 16.2,
        low: 14.8,
        volume: 234567.89,
        marketCap: 6.1e9
      },
      {
        symbol: 'LTC/USDT',
        last: 98.76 + (Math.random() - 0.5) * 5,
        change: -2.34,
        percentage: -2.31,
        high: 102.5,
        low: 96.4,
        volume: 123456.78,
        marketCap: 7.3e9
      },
      {
        symbol: 'BCH/USDT',
        last: 234.56 + (Math.random() - 0.5) * 10,
        change: 8.90,
        percentage: 3.94,
        high: 245.0,
        low: 225.0,
        volume: 87654.32,
        marketCap: 4.6e9
      },
      {
        symbol: 'ALGO/USDT',
        last: 0.3456 + (Math.random() - 0.5) * 0.02,
        change: 0.0234,
        percentage: 7.27,
        high: 0.365,
        low: 0.325,
        volume: 567890.12,
        marketCap: 2.7e9
      }
    ];

    // Add some randomness to prices to simulate real-time updates
    const updatedMarkets = mockMarkets.map(market => ({
      ...market,
      last: market.last * (1 + (Math.random() - 0.5) * 0.01), // ±0.5% variation
      change: market.change * (1 + (Math.random() - 0.5) * 0.1),
      percentage: market.percentage * (1 + (Math.random() - 0.5) * 0.1)
    }));

    return NextResponse.json({
      markets: updatedMarkets,
      timestamp: Date.now(),
      count: updatedMarkets.length
    });

  } catch (error) {
    console.error('Markets API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch market data',
        markets: []
      },
      { status: 500 }
    );
  }
}