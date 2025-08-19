export function calculateSMA(data: number[], period: number): number[] {
  const sma: number[] = [];
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      sma.push(0);
    } else {
      const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
      sma.push(sum / period);
    }
  }
  return sma;
}

export function calculateEMA(data: number[], period: number): number[] {
  const ema: number[] = [];
  const multiplier = 2 / (period + 1);

  if (data.length === 0) {
    return ema;
  }

  const sma = data.slice(0, period).reduce((a, b) => a + b, 0) / period;
  ema.push(sma);

  for (let i = period; i < data.length; i++) {
    const lastEma = ema.at(-1) || ema[ema.length - 1];
    const value = (data[i] - lastEma) * multiplier + lastEma;
    ema.push(value);
  }

  while (ema.length < data.length) {
    ema.unshift(0);
  }

  return ema;
}

export function findSupportResistance(
  data: { high: number; low: number; close: number }[]
): {
  support: number;
  resistance: number;
} {
  if (!data || data.length === 0) {
    return { support: 0, resistance: 0 };
  }

  const highs = data.map((d) => d.high);
  const lows = data.map((d) => d.low);
  const closes = data.map((d) => d.close);

  const _currentPrice = closes.at(-1);
  const recentLows = lows.slice(-20);
  const recentHighs = highs.slice(-20);

  const support = Math.min(...recentLows);
  const resistance = Math.max(...recentHighs);

  return { support, resistance };
}
