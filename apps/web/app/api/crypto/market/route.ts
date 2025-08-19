import { NextResponse } from 'next/server';
import { cryptoConfig, isValidPair } from '@/lib/crypto-config';
import { exchangeService } from '@/lib/crypto/exchange-service';

type OHLCVData = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

type SMAPoint = {
  time: number;
  value: number;
};

type TickerData = {
  symbol: string;
  last: number;
  percentage: number;
  quoteVolume: number;
};

// Fetch real ticker data for all supported pairs
async function fetchRealTickers(): Promise<Record<string, TickerData>> {
  try {
    const tickers = await exchangeService.fetchTickers();
    // Transform to match our TickerData type
    const transformed: Record<string, TickerData> = {};
    for (const [symbol, ticker] of Object.entries(tickers)) {
      transformed[symbol] = {
        symbol,
        last: ticker.last ?? 0,
        percentage: ticker.percentage ?? 0,
        quoteVolume: ticker.volume ?? 0, // Use volume as quoteVolume
      };
    }
    return transformed;
  } catch (error) {
    console.error('Failed to fetch real tickers:', error);
    return generateMockTickers();
  }
}

// Generate realistic mock ticker data as fallback
function generateMockTickers(): Record<string, TickerData> {
  const tickers: Record<string, TickerData> = {};
  
  cryptoConfig.supportedPairs.forEach((pair) => {
    // Get real-time-like prices from external price feeds in production
    const basePrice = getMarketPrice(pair);
    const priceVariation = (Math.random() - 0.5) * 0.1; // ±5%
    const currentPrice = basePrice * (1 + priceVariation);
    
    tickers[pair] = {
      symbol: pair,
      last: currentPrice,
      percentage: (Math.random() - 0.5) * 20, // ±10% realistic daily change
      quoteVolume: Math.random() * 1e9 + 1e8, // 100M to 1.1B volume
    };
  });

  return tickers;
}

// Get current market price (would connect to price feeds in production)
function getMarketPrice(symbol: string): number {
  const marketPrices: Record<string, number> = {
    'BTC/USDT': 67000,
    'ETH/USDT': 3400,
    'SOL/USDT': 145,
    'BNB/USDT': 600,
    'XRP/USDT': 0.6,
    'ADA/USDT': 0.45,
    'DOGE/USDT': 0.09,
    'AVAX/USDT': 38,
    'DOT/USDT': 7.8,
    'MATIC/USDT': 0.9,
  };
  
  return marketPrices[symbol] || 100;
}

// Generate mock OHLCV data
function generateOHLCV(
  basePrice: number,
  limit: number,
  timeframeMinutes: number
): OHLCVData[] {
  return Array.from({ length: limit }, (_, i) => {
    const variance = Math.random() * 0.02 - 0.01;
    const price = basePrice * (1 + variance * Math.sin(i / 10));
    return {
      time: Date.now() - (limit - 1 - i) * timeframeMinutes * 60000,
      open: price * (1 + (Math.random() - 0.5) * 0.002),
      high: price * (1 + Math.random() * 0.005),
      low: price * (1 - Math.random() * 0.005),
      close: price,
      volume: Math.random() * 1000000,
    };
  });
}

// Calculate Simple Moving Average
function calculateSMA(data: OHLCVData[], period: number): SMAPoint[] {
  if (data.length < period) return [];
  
  const sma: SMAPoint[] = [];
  for (let i = period - 1; i < data.length; i++) {
    const sum = data
      .slice(i - period + 1, i + 1)
      .reduce((acc, candle) => acc + candle.close, 0);
    sma.push({
      time: data[i].time,
      value: sum / period,
    });
  }
  return sma;
}

// Calculate Support and Resistance levels
function calculateSupportResistance(data: OHLCVData[]) {
  if (data.length === 0) {
    return { support: 0, resistance: 0 };
  }

  const recentData = data.slice(-20); // Last 20 candles
  const highs = recentData.map((d) => d.high);
  const lows = recentData.map((d) => d.low);

  return {
    resistance: Math.max(...highs),
    support: Math.min(...lows),
  };
}

// Calculate RSI
function calculateRSI(data: OHLCVData[], period: number = 14): number {
  if (data.length < period + 1) return 50;

  let gains = 0;
  let losses = 0;

  for (let i = data.length - period; i < data.length; i++) {
    const change = data[i].close - data[i - 1].close;
    if (change > 0) gains += change;
    else losses -= change;
  }

  const avgGain = gains / period;
  const avgLoss = losses / period;
  const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
  return 100 - 100 / (1 + rs);
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');
    const timeframe = searchParams.get('timeframe') || '1h';
    const limit = Math.min(
      parseInt(searchParams.get('limit') || '100'),
      500 // Max limit
    );

    // Try to fetch real data first, fallback to mock if unavailable
    let tickers: Record<string, TickerData>;
    
    if (cryptoConfig.features.mockData) {
      tickers = generateMockTickers();
    } else {
      tickers = await fetchRealTickers();
    }

    // If no symbol specified, return all tickers
    if (!symbol) {
      return NextResponse.json(tickers);
    }

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

    // Get timeframe in minutes
    const timeframeMinutes = {
      '1m': 1,
      '5m': 5,
      '15m': 15,
      '30m': 30,
      '1h': 60,
      '4h': 240,
      '1d': 1440,
      '1w': 10080,
    }[timeframe] || 60;

    // Generate OHLCV data (use real data if available)
    const ticker = tickers[symbol];
    let ohlcv: OHLCVData[];
    
    if (!cryptoConfig.features.mockData) {
      try {
        const realOHLCV = await exchangeService.fetchOHLCV(symbol, timeframe, limit);
        ohlcv = realOHLCV.map(candle => ({
          time: candle.timestamp,
          open: candle.open,
          high: candle.high,
          low: candle.low,
          close: candle.close,
          volume: candle.volume,
        }));
      } catch (error) {
        console.error('Failed to fetch real OHLCV, using mock data:', error);
        ohlcv = generateOHLCV(ticker.last, limit, timeframeMinutes);
      }
    } else {
      ohlcv = generateOHLCV(ticker.last, limit, timeframeMinutes);
    }

    // Calculate indicators
    const indicators = {
      sma20: calculateSMA(ohlcv, 20),
      sma50: calculateSMA(ohlcv, 50),
      sma100: calculateSMA(ohlcv, 100),
      sma200: calculateSMA(ohlcv, 200),
      ...calculateSupportResistance(ohlcv),
      rsi: calculateRSI(ohlcv, cryptoConfig.indicators.rsi.period),
    };

    // Generate mock order book
    const orderBook = {
      bids: Array.from({ length: 10 }, (_, i) => [
        ticker.last * (0.999 - i * 0.001),
        Math.random() * 100,
      ]),
      asks: Array.from({ length: 10 }, (_, i) => [
        ticker.last * (1.001 + i * 0.001),
        Math.random() * 100,
      ]),
    };

    return NextResponse.json({
      symbol,
      ticker,
      ohlcv,
      indicators,
      orderBook,
      metadata: {
        exchange: cryptoConfig.exchange.default,
        timeframe,
        limit,
        timestamp: Date.now(),
      },
    });
  } catch (error) {
    console.error('Market data error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch market data',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}