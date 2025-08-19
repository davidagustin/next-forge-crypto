export interface OHLCV {
  timestamp: number;
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export function calculateSMA(data: OHLCV[], period: number): (number | null)[] {
  const result: (number | null)[] = [];

  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      result.push(null);
    } else {
      const sum = data
        .slice(i - period + 1, i + 1)
        .reduce((acc, candle) => acc + candle.close, 0);
      result.push(sum / period);
    }
  }

  return result;
}

export function calculateEMA(data: OHLCV[], period: number): (number | null)[] {
  const result: (number | null)[] = [];
  const multiplier = 2 / (period + 1);

  let ema: number | null = null;

  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      result.push(null);
    } else if (i === period - 1) {
      const sum = data
        .slice(0, period)
        .reduce((acc, candle) => acc + candle.close, 0);
      ema = sum / period;
      result.push(ema);
    } else {
      ema = (data[i].close - ema!) * multiplier + ema!;
      result.push(ema);
    }
  }

  return result;
}

export function calculateRSI(data: OHLCV[], period = 14): (number | null)[] {
  const result: (number | null)[] = [];
  const changes: number[] = [];

  for (let i = 1; i < data.length; i++) {
    changes.push(data[i].close - data[i - 1].close);
  }

  for (let i = 0; i < data.length; i++) {
    if (i < period) {
      result.push(null);
    } else {
      const relevantChanges = changes.slice(i - period, i);
      const gains =
        relevantChanges.filter((c) => c > 0).reduce((a, b) => a + b, 0) /
        period;
      const losses =
        Math.abs(
          relevantChanges.filter((c) => c < 0).reduce((a, b) => a + b, 0)
        ) / period;

      const rs = losses === 0 ? 100 : gains / losses;
      const rsi = 100 - 100 / (1 + rs);
      result.push(rsi);
    }
  }

  return result;
}

export function findSupportResistance(
  data: OHLCV[],
  lookback = 20
): { support: number; resistance: number } {
  const recentData = data.slice(-lookback);
  const lows = recentData.map((d) => d.low);
  const highs = recentData.map((d) => d.high);

  const support = Math.min(...lows);
  const resistance = Math.max(...highs);

  return { support, resistance };
}

export function calculateBollingerBands(
  data: OHLCV[],
  period = 20,
  stdDev = 2
) {
  const sma = calculateSMA(data, period);
  const bands = [];

  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      bands.push({ upper: null, middle: null, lower: null });
    } else {
      const slice = data.slice(i - period + 1, i + 1).map((d) => d.close);
      const mean = sma[i]!;
      const variance =
        slice.reduce((acc, val) => acc + (val - mean) ** 2, 0) / period;
      const std = Math.sqrt(variance);

      bands.push({
        upper: mean + std * stdDev,
        middle: mean,
        lower: mean - std * stdDev,
      });
    }
  }

  return bands;
}

export function calculateMACD(
  data: OHLCV[],
  fastPeriod = 12,
  slowPeriod = 26,
  signalPeriod = 9
) {
  const emaFast = calculateEMA(data, fastPeriod);
  const emaSlow = calculateEMA(data, slowPeriod);

  const macdLine = emaFast.map((fast, i) => {
    if (fast === null || emaSlow[i] === null) {
      return null;
    }
    return fast - emaSlow[i]!;
  });

  const signalLine: (number | null)[] = [];
  const histogram: (number | null)[] = [];

  let emaSignal: number | null = null;
  const multiplier = 2 / (signalPeriod + 1);

  for (let i = 0; i < macdLine.length; i++) {
    if (macdLine[i] === null) {
      signalLine.push(null);
      histogram.push(null);
    } else if (i < slowPeriod + signalPeriod - 2) {
      signalLine.push(null);
      histogram.push(null);
    } else if (i === slowPeriod + signalPeriod - 2) {
      const validValues = macdLine
        .slice(i - signalPeriod + 1, i + 1)
        .filter((v) => v !== null) as number[];
      emaSignal = validValues.reduce((a, b) => a + b, 0) / validValues.length;
      signalLine.push(emaSignal);
      histogram.push(macdLine[i]! - emaSignal);
    } else {
      emaSignal = (macdLine[i]! - emaSignal!) * multiplier + emaSignal!;
      signalLine.push(emaSignal);
      histogram.push(macdLine[i]! - emaSignal);
    }
  }

  return { macdLine, signalLine, histogram };
}
