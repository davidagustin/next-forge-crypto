import { NextRequest, NextResponse } from 'next/server';
import { exchangeService } from '@/lib/crypto/exchange-service';
import { cryptoConfig, isValidPair } from '@/lib/crypto-config';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const symbol = searchParams.get('symbol') || 'BTC/USDT';

    // Validate symbol
    if (!isValidPair(symbol)) {
      return NextResponse.json(
        { 
          error: 'Invalid trading pair',
          validPairs: cryptoConfig.supportedPairs 
        },
        { status: 400 }
      );
    }

    // Use real data if configured, fallback to mock data
    if (!cryptoConfig.features.mockData) {
      try {
        const ticker = await exchangeService.fetchTicker(symbol);
        return NextResponse.json(ticker);
      } catch (error) {
        console.error('Failed to fetch real data, falling back to mock:', error);
      }
    }

    // Fallback: Generate realistic mock data
    const basePrices: Record<string, number> = {
      'BTC/USDT': 67000,
      'ETH/USDT': 3400,
      'BNB/USDT': 600,
      'SOL/USDT': 145,
      'XRP/USDT': 0.6,
      'ADA/USDT': 0.45,
      'AVAX/USDT': 38,
      'DOT/USDT': 7.8,
      'MATIC/USDT': 0.9,
      'DOGE/USDT': 0.09,
    };

    const basePrice = basePrices[symbol] || 100;
    
    // Generate realistic price variation
    const priceVariation = (Math.random() - 0.5) * 0.1; // ±5%
    const currentPrice = basePrice * (1 + priceVariation);
    
    // Generate realistic 24h change
    const change24h = (Math.random() - 0.5) * 20; // ±10%
    
    return NextResponse.json({
      symbol,
      last: currentPrice,
      bid: currentPrice * 0.999,
      ask: currentPrice * 1.001,
      high: currentPrice * (1 + Math.abs(change24h) / 100),
      low: currentPrice * (1 - Math.abs(change24h) / 100),
      volume: Math.random() * 100000,
      change: (currentPrice * change24h) / 100,
      percentage: change24h,
      timestamp: Date.now(),
      exchange: cryptoConfig.exchange.default,
    });
  } catch (error) {
    console.error('Ticker API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch ticker data',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}