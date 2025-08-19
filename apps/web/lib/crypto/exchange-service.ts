// Simple exchange service for crypto data
// This replaces CCXT for browser compatibility

export interface TickerData {
  symbol: string;
  last: number;
  bid: number;
  ask: number;
  high: number;
  low: number;
  volume: number;
  change: number;
  percentage: number;
  timestamp: number;
  exchange: string;
}

export interface OHLCVData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export class ExchangeService {
  private basePrices: Record<string, number> = {
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

  async fetchTicker(symbol: string): Promise<TickerData> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 100));

    const basePrice = this.basePrices[symbol] || 100;
    
    // Generate realistic price variation
    const priceVariation = (Math.random() - 0.5) * 0.1; // ±5%
    const currentPrice = basePrice * (1 + priceVariation);
    
    // Generate realistic 24h change
    const change24h = (Math.random() - 0.5) * 20; // ±10%
    
    return {
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
      exchange: 'binance',
    };
  }

  async fetchTickers(symbols?: string[]): Promise<Record<string, TickerData>> {
    const targetSymbols = symbols || Object.keys(this.basePrices);
    const result: Record<string, TickerData> = {};
    
    for (const symbol of targetSymbols) {
      result[symbol] = await this.fetchTicker(symbol);
    }
    
    return result;
  }

  async fetchOHLCV(
    symbol: string,
    timeframe: string = '1h',
    limit: number = 100
  ): Promise<OHLCVData[]> {
    const basePrice = this.basePrices[symbol] || 100;
    const data: OHLCVData[] = [];
    
    for (let i = 0; i < limit; i++) {
      const timestamp = Date.now() - (limit - i) * 3600000; // 1 hour intervals
      const variation = (Math.random() - 0.5) * 0.05; // ±2.5%
      const price = basePrice * (1 + variation);
      
      data.push({
        timestamp,
        open: price * (1 + (Math.random() - 0.5) * 0.01),
        high: price * (1 + Math.random() * 0.02),
        low: price * (1 - Math.random() * 0.02),
        close: price,
        volume: Math.random() * 1000,
      });
    }
    
    return data;
  }

  async fetchOrderBook(symbol: string, limit: number = 20): Promise<any> {
    const basePrice = this.basePrices[symbol] || 100;
    const bids = [];
    const asks = [];
    
    for (let i = 0; i < limit; i++) {
      bids.push([basePrice * (1 - (i + 1) * 0.001), Math.random() * 10]);
      asks.push([basePrice * (1 + (i + 1) * 0.001), Math.random() * 10]);
    }
    
    return { bids, asks };
  }

  async fetchMarkets(): Promise<any> {
    return Object.keys(this.basePrices).reduce((acc, symbol) => {
      acc[symbol] = {
        id: symbol,
        symbol,
        base: symbol.split('/')[0],
        quote: symbol.split('/')[1],
        active: true,
      };
      return acc;
    }, {} as any);
  }
}

// Singleton instance
export const exchangeService = new ExchangeService();