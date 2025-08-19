import ccxt from 'ccxt';

export interface OHLCVData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface MarketData {
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  high24h: number;
  low24h: number;
  marketCap?: number;
}

interface Exchange {
  fetchOHLCV: (symbol: string, timeframe: string, since?: number, limit?: number) => Promise<[number, number, number, number, number, number][]>;
  fetchTicker: (symbol: string) => Promise<any>;
  fetchTickers: () => Promise<Record<string, any>>;
  fetchOrderBook: (symbol: string, limit?: number) => Promise<any>;
}

class CryptoService {
  private exchange: Exchange;

  constructor() {
    this.exchange = new (ccxt as any).binance({
      enableRateLimit: true,
      options: {
        defaultType: 'spot',
      },
    });
  }

  async fetchOHLCV(
    symbol: string,
    timeframe = '1h',
    limit = 100
  ): Promise<OHLCVData[]> {
    const ohlcv = await this.exchange.fetchOHLCV(
      symbol,
      timeframe,
      undefined,
      limit
    );
    return ohlcv.map(([timestamp, open, high, low, close, volume]) => ({
      timestamp,
      open,
      high,
      low,
      close,
      volume,
    }));
  }

  async fetchTicker(symbol: string): Promise<MarketData> {
    const ticker = await this.exchange.fetchTicker(symbol);
    return {
      symbol: ticker.symbol,
      price: ticker.last || 0,
      change24h: ticker.percentage || 0,
      volume24h: ticker.quoteVolume || 0,
      high24h: ticker.high || 0,
      low24h: ticker.low || 0,
    };
  }

  async fetchTopMarkets(limit = 20): Promise<MarketData[]> {
    const tickers = await this.exchange.fetchTickers();
    const topPairs = Object.values(tickers)
      .filter((ticker: any) => ticker.symbol.endsWith('/USDT'))
      .sort((a: any, b: any) => (b.quoteVolume || 0) - (a.quoteVolume || 0))
      .slice(0, limit);

    return topPairs.map((ticker: any) => ({
      symbol: ticker.symbol,
      price: ticker.last || 0,
      change24h: ticker.percentage || 0,
      volume24h: ticker.quoteVolume || 0,
      high24h: ticker.high || 0,
      low24h: ticker.low || 0,
    }));
  }

  async fetchOrderBook(symbol: string, limit = 20) {
    const orderBook = await this.exchange.fetchOrderBook(symbol, limit);
    return orderBook;
  }
}

export const cryptoService = new CryptoService();
