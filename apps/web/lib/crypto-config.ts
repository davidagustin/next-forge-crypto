// Cryptocurrency configuration
export const cryptoConfig = {
  // Exchange configuration
  exchange: {
    default: process.env.NEXT_PUBLIC_DEFAULT_EXCHANGE || 'binance',
    apiKey: process.env.EXCHANGE_API_KEY,
    secret: process.env.EXCHANGE_SECRET,
    enableRateLimit: true,
  },

  // Supported cryptocurrencies
  supportedPairs: [
    'BTC/USDT',
    'ETH/USDT',
    'SOL/USDT',
    'BNB/USDT',
    'XRP/USDT',
    'ADA/USDT',
    'DOGE/USDT',
    'AVAX/USDT',
    'DOT/USDT',
    'MATIC/USDT',
  ],

  // Timeframes for charts
  timeframes: [
    { label: '1m', value: '1', apiValue: '1m' },
    { label: '5m', value: '5', apiValue: '5m' },
    { label: '15m', value: '15', apiValue: '15m' },
    { label: '30m', value: '30', apiValue: '30m' },
    { label: '1H', value: '60', apiValue: '1h' },
    { label: '4H', value: '240', apiValue: '4h' },
    { label: '1D', value: 'D', apiValue: '1d' },
    { label: '1W', value: 'W', apiValue: '1w' },
  ],

  // Technical indicators
  indicators: {
    sma: {
      periods: [20, 50, 100, 200],
      enabled: true,
    },
    ema: {
      periods: [12, 26],
      enabled: true,
    },
    rsi: {
      period: 14,
      overbought: 70,
      oversold: 30,
      enabled: true,
    },
    macd: {
      fast: 12,
      slow: 26,
      signal: 9,
      enabled: true,
    },
  },

  // TradingView widget configuration
  tradingView: {
    theme: process.env.NEXT_PUBLIC_TRADINGVIEW_THEME || 'dark',
    locale: process.env.NEXT_PUBLIC_TRADINGVIEW_LOCALE || 'en',
    defaultInterval: '60',
    enablePublishing: false,
    allowSymbolChange: true,
    hideSideToolbar: false,
    studies: [
      'MASimple@tv-basicstudies',
      'MAExp@tv-basicstudies',
      'BB@tv-basicstudies',
      'RSI@tv-basicstudies',
      'MACD@tv-basicstudies',
      'Volume@tv-basicstudies',
    ],
  },

  // API configuration
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || '',
    timeout: parseInt(process.env.API_TIMEOUT || '30000'),
    retryAttempts: parseInt(process.env.API_RETRY_ATTEMPTS || '3'),
    cacheTime: parseInt(process.env.API_CACHE_TIME || '60000'), // 1 minute
  },

  // AI Agent configuration
  aiAgent: {
    enabled: process.env.OPENAI_API_KEY ? true : false,
    model: process.env.AI_MODEL || 'gpt-4-turbo-preview',
    maxTokens: parseInt(process.env.AI_MAX_TOKENS || '500'),
    temperature: parseFloat(process.env.AI_TEMPERATURE || '0.7'),
  },

  // WebSocket configuration for real-time data
  websocket: {
    enabled: process.env.NEXT_PUBLIC_WS_ENABLED === 'true',
    url: process.env.NEXT_PUBLIC_WS_URL || 'wss://stream.binance.com:9443/ws',
  },

  // Feature flags
  features: {
    mockData: process.env.NEXT_PUBLIC_USE_MOCK_DATA !== 'false',
    advancedCharts: process.env.NEXT_PUBLIC_ADVANCED_CHARTS !== 'false',
    newsIntegration: process.env.NEXT_PUBLIC_NEWS_ENABLED === 'true',
    alertsEnabled: process.env.NEXT_PUBLIC_ALERTS_ENABLED === 'true',
  },
};

// Helper function to get timeframe configuration
export function getTimeframeConfig(value: string) {
  return cryptoConfig.timeframes.find((tf) => tf.value === value);
}

// Helper function to validate cryptocurrency pair
export function isValidPair(pair: string): boolean {
  return cryptoConfig.supportedPairs.includes(pair);
}

// Helper function to get default pair
export function getDefaultPair(): string {
  return cryptoConfig.supportedPairs[0] || 'BTC/USDT';
}