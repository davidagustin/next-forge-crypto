import * as TI from 'technicalindicators';
import type { OHLCVData } from './ccxt-service';

export interface TechnicalIndicators {
  sma20: number[];
  sma50: number[];
  ema12: number[];
  ema26: number[];
  rsi: number[];
  macd: {
    MACD: number[];
    signal: number[];
    histogram: number[];
  };
  bollinger: {
    upper: number[];
    middle: number[];
    lower: number[];
  };
  support: number[];
  resistance: number[];
}

export class TechnicalAnalysis {
  static calculateIndicators(data: OHLCVData[]): TechnicalIndicators {
    const closes = data.map((d) => d.close);
    const highs = data.map((d) => d.high);
    const lows = data.map((d) => d.low);
    const _volumes = data.map((d) => d.volume);

    const sma20 = TI.SMA.calculate({ period: 20, values: closes });
    const sma50 = TI.SMA.calculate({ period: 50, values: closes });
    const ema12 = TI.EMA.calculate({ period: 12, values: closes });
    const ema26 = TI.EMA.calculate({ period: 26, values: closes });

    const rsi = TI.RSI.calculate({
      values: closes,
      period: 14,
    });

    const macdResult = TI.MACD.calculate({
      values: closes,
      fastPeriod: 12,
      slowPeriod: 26,
      signalPeriod: 9,
      SimpleMAOscillator: false,
      SimpleMASignal: false,
    });

    const bollingerBands = TI.BollingerBands.calculate({
      period: 20,
      values: closes,
      stdDev: 2,
    });

    const { support, resistance } = TechnicalAnalysis.findSupportResistance(
      highs,
      lows,
      closes
    );

    return {
      sma20: TechnicalAnalysis.padArray(sma20, data.length),
      sma50: TechnicalAnalysis.padArray(sma50, data.length),
      ema12: TechnicalAnalysis.padArray(ema12, data.length),
      ema26: TechnicalAnalysis.padArray(ema26, data.length),
      rsi: TechnicalAnalysis.padArray(rsi, data.length),
      macd: {
        MACD: TechnicalAnalysis.padArray(
          macdResult.map((m) => m?.MACD || 0),
          data.length
        ),
        signal: TechnicalAnalysis.padArray(
          macdResult.map((m) => m?.signal || 0),
          data.length
        ),
        histogram: TechnicalAnalysis.padArray(
          macdResult.map((m) => m?.histogram || 0),
          data.length
        ),
      },
      bollinger: {
        upper: TechnicalAnalysis.padArray(
          bollingerBands.map((b) => b?.upper || 0),
          data.length
        ),
        middle: TechnicalAnalysis.padArray(
          bollingerBands.map((b) => b?.middle || 0),
          data.length
        ),
        lower: TechnicalAnalysis.padArray(
          bollingerBands.map((b) => b?.lower || 0),
          data.length
        ),
      },
      support,
      resistance,
    };
  }

  private static padArray(arr: number[], targetLength: number): number[] {
    const padding = new Array(targetLength - arr.length).fill(null);
    return [...padding, ...arr];
  }

  private static findSupportResistance(
    highs: number[],
    lows: number[],
    closes: number[]
  ): { support: number[]; resistance: number[] } {
    const pivotPoints: number[] = [];
    const window = 5;

    for (let i = window; i < highs.length - window; i++) {
      const localHighs = highs.slice(i - window, i + window + 1);
      const localLows = lows.slice(i - window, i + window + 1);

      const maxHigh = Math.max(...localHighs);
      const minLow = Math.min(...localLows);

      if (highs[i] === maxHigh) {
        pivotPoints.push(highs[i]);
      }
      if (lows[i] === minLow) {
        pivotPoints.push(lows[i]);
      }
    }

    pivotPoints.sort((a, b) => a - b);

    const currentPrice = closes.at(-1) || closes[closes.length - 1];
    const support = pivotPoints.filter((p) => p < currentPrice).slice(-3);
    const resistance = pivotPoints.filter((p) => p > currentPrice).slice(0, 3);

    return { support, resistance };
  }

  static calculateTrend(data: OHLCVData[]): 'bullish' | 'bearish' | 'neutral' {
    if (data.length < 20) {
      return 'neutral';
    }

    const recentCloses = data.slice(-20).map((d) => d.close);
    const sma = recentCloses.reduce((a, b) => a + b, 0) / recentCloses.length;
    const currentPrice = recentCloses.at(-1) || recentCloses[recentCloses.length - 1];

    const priceChange =
      ((currentPrice - recentCloses[0]) / recentCloses[0]) * 100;

    if (currentPrice > sma && priceChange > 2) {
      return 'bullish';
    }
    if (currentPrice < sma && priceChange < -2) {
      return 'bearish';
    }
    return 'neutral';
  }

  static generateSignals(
    indicators: TechnicalIndicators,
    currentPrice: number
  ): string[] {
    const signals: string[] = [];
    const lastRSI = indicators.rsi.at(-1);
    const lastMACD = indicators.macd.histogram.at(-1);
    const lastSMA20 = indicators.sma20.at(-1);
    const lastSMA50 = indicators.sma50.at(-1);

    if (lastRSI && lastRSI > 70) {
      signals.push('RSI indicates overbought conditions (>70)');
    } else if (lastRSI && lastRSI < 30) {
      signals.push('RSI indicates oversold conditions (<30)');
    }

    if (lastMACD && lastMACD > 0) {
      signals.push('MACD shows bullish momentum');
    } else if (lastMACD && lastMACD < 0) {
      signals.push('MACD shows bearish momentum');
    }

    if (lastSMA20 && lastSMA50) {
      if (lastSMA20 > lastSMA50) {
        signals.push('Golden cross pattern (bullish)');
      } else if (lastSMA20 < lastSMA50) {
        signals.push('Death cross pattern (bearish)');
      }
    }

    if (indicators.resistance.length > 0) {
      const nearestResistance = indicators.resistance[0];
      if (
        Math.abs(currentPrice - nearestResistance) / nearestResistance <
        0.02
      ) {
        signals.push(
          `Price approaching resistance at ${nearestResistance.toFixed(2)}`
        );
      }
    }

    if (indicators.support.length > 0) {
      const nearestSupport = indicators.support.at(-1) || indicators.support[indicators.support.length - 1];
      if (nearestSupport && Math.abs(currentPrice - nearestSupport) / nearestSupport < 0.02) {
        signals.push(
          `Price approaching support at ${nearestSupport.toFixed(2)}`
        );
      }
    }

    return signals;
  }
}
