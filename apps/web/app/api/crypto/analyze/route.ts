import { NextResponse } from 'next/server';

// Professional trading analysis without external APIs
function generateProfessionalAnalysis(chartData: any, indicators: any, question: string): string {
  const { symbol, currentPrice } = chartData;
  const { rsi, sma20, sma50, support, resistance } = indicators || {};
  
  // Determine trend direction
  const trend = currentPrice > sma50 ? 'bullish' : currentPrice < sma50 ? 'bearish' : 'sideways';
  const shortTermTrend = currentPrice > sma20 ? 'bullish' : 'bearish';
  
  // RSI analysis
  let rsiSignal = 'neutral';
  let rsiDescription = '';
  if (rsi > 70) {
    rsiSignal = 'overbought';
    rsiDescription = 'indicating potential selling pressure';
  } else if (rsi < 30) {
    rsiSignal = 'oversold';
    rsiDescription = 'suggesting a possible bounce';
  } else if (rsi > 50) {
    rsiDescription = 'showing bullish momentum';
  } else {
    rsiDescription = 'indicating weak momentum';
  }
  
  // Support/Resistance analysis
  const nearSupport = support && support.length > 0 && currentPrice < support[0] * 1.02;
  const nearResistance = resistance && resistance.length > 0 && currentPrice > resistance[0] * 0.98;
  
  // Generate contextual response based on question type
  if (question.toLowerCase().includes('buy') || question.toLowerCase().includes('entry')) {
    return generateEntryAnalysis(symbol, currentPrice, trend, rsiSignal, rsiDescription, nearSupport, nearResistance, indicators);
  } else if (question.toLowerCase().includes('sell') || question.toLowerCase().includes('exit')) {
    return generateExitAnalysis(symbol, currentPrice, trend, rsiSignal, rsiDescription, nearSupport, nearResistance, indicators);
  } else if (question.toLowerCase().includes('rsi')) {
    return generateRSIAnalysis(symbol, rsi, rsiSignal, rsiDescription);
  } else if (question.toLowerCase().includes('support') || question.toLowerCase().includes('resistance')) {
    return generateSRAnalysis(symbol, currentPrice, support, resistance, nearSupport, nearResistance);
  } else if (question.toLowerCase().includes('trend')) {
    return generateTrendAnalysis(symbol, currentPrice, trend, shortTermTrend, sma20, sma50);
  } else {
    return generateGeneralAnalysis(symbol, currentPrice, trend, rsiSignal, rsiDescription, nearSupport, nearResistance, indicators);
  }
}

function generateEntryAnalysis(symbol: string, price: number, trend: string, rsiSignal: string, rsiDesc: string, nearSupport: boolean, nearResistance: boolean, indicators: any): string {
  let analysis = `📊 **${symbol} Entry Analysis**\n\n`;
  
  if (trend === 'bullish' && rsiSignal !== 'overbought') {
    analysis += `✅ **FAVORABLE ENTRY CONDITIONS:**\n`;
    analysis += `• Bullish trend intact with price above key moving averages\n`;
    analysis += `• RSI at ${indicators.rsi?.toFixed(1)} ${rsiDesc}\n`;
    
    if (nearSupport) {
      analysis += `• Price near support level - good risk/reward setup\n`;
      analysis += `• Consider buying on any dip to $${indicators.support[0]?.toFixed(2)}\n`;
    }
    
    analysis += `\n🎯 **STRATEGY:** Consider dollar-cost averaging or wait for pullback to SMA20 ($${indicators.sma20?.toFixed(2)})\n`;
    analysis += `⚠️ **RISK:** Stop loss below $${(price * 0.95).toFixed(2)} (-5%)`;
    
  } else if (rsiSignal === 'oversold') {
    analysis += `🔄 **POTENTIAL BOUNCE SETUP:**\n`;
    analysis += `• RSI oversold at ${indicators.rsi?.toFixed(1)} - bounce likely\n`;
    analysis += `• Wait for RSI to cross above 35 for confirmation\n`;
    analysis += `• Watch for volume increase on any reversal\n\n`;
    analysis += `⚠️ **CAUTION:** ${trend} trend still in effect - consider smaller position size`;
    
  } else {
    analysis += `⚠️ **WAIT FOR BETTER SETUP:**\n`;
    if (rsiSignal === 'overbought') {
      analysis += `• RSI overbought at ${indicators.rsi?.toFixed(1)} - pullback likely\n`;
    }
    if (nearResistance) {
      analysis += `• Price near resistance - breakout needed for continuation\n`;
    }
    analysis += `• Consider waiting for ${trend === 'bearish' ? 'trend reversal' : 'pullback to support'}\n`;
    analysis += `• Entry levels: $${(price * 0.97).toFixed(2)} - $${(price * 0.95).toFixed(2)}`;
  }
  
  return analysis;
}

function generateExitAnalysis(symbol: string, price: number, trend: string, rsiSignal: string, rsiDesc: string, nearSupport: boolean, nearResistance: boolean, indicators: any): string {
  let analysis = `🎯 **${symbol} Exit Strategy Analysis**\n\n`;
  
  if (rsiSignal === 'overbought' || nearResistance) {
    analysis += `🚨 **CONSIDER TAKING PROFITS:**\n`;
    if (rsiSignal === 'overbought') {
      analysis += `• RSI overbought at ${indicators.rsi?.toFixed(1)} - selling pressure likely\n`;
    }
    if (nearResistance) {
      analysis += `• Price approaching resistance at $${indicators.resistance[0]?.toFixed(2)}\n`;
    }
    analysis += `• Consider selling 25-50% of position\n`;
    analysis += `• Trail stop at $${(price * 0.98).toFixed(2)} (2% below current)\n\n`;
    analysis += `📈 **IF BREAKOUT:** Watch for volume surge above $${indicators.resistance[0]?.toFixed(2)}`;
    
  } else if (trend === 'bearish' && rsiSignal !== 'oversold') {
    analysis += `📉 **BEARISH EXIT SIGNALS:**\n`;
    analysis += `• Trend remains bearish with price below key MAs\n`;
    analysis += `• RSI at ${indicators.rsi?.toFixed(1)} ${rsiDesc}\n`;
    analysis += `• Consider reducing position size\n`;
    analysis += `• Stop loss: $${(price * 0.97).toFixed(2)} (-3%)\n\n`;
    analysis += `🔄 **REVERSAL WATCH:** Wait for RSI > 50 and price > SMA20`;
    
  } else {
    analysis += `💎 **HOLD POSITION:**\n`;
    analysis += `• ${trend.toUpperCase()} trend remains intact\n`;
    analysis += `• RSI at healthy ${indicators.rsi?.toFixed(1)} level\n`;
    if (nearSupport) {
      analysis += `• Strong support at $${indicators.support[0]?.toFixed(2)}\n`;
    }
    analysis += `• Trail stop: $${(price * 0.95).toFixed(2)} (-5%)\n\n`;
    analysis += `🎯 **TARGETS:** $${(price * 1.05).toFixed(2)} (+5%) | $${(price * 1.10).toFixed(2)} (+10%)`;
  }
  
  return analysis;
}

function generateRSIAnalysis(symbol: string, rsi: number, rsiSignal: string, rsiDesc: string): string {
  let analysis = `📊 **${symbol} RSI Analysis**\n\n`;
  analysis += `**Current RSI:** ${rsi?.toFixed(1)}\n`;
  analysis += `**Status:** ${rsiSignal.toUpperCase()}\n\n`;
  
  if (rsi > 70) {
    analysis += `🔴 **OVERBOUGHT TERRITORY (>70)**\n`;
    analysis += `• Strong selling pressure expected\n`;
    analysis += `• Consider taking profits or reducing positions\n`;
    analysis += `• Wait for RSI to fall below 70 before new entries\n`;
    analysis += `• Watch for bearish divergence with price\n\n`;
    analysis += `**Historical Note:** RSI can stay overbought longer in strong trends`;
    
  } else if (rsi < 30) {
    analysis += `🟢 **OVERSOLD TERRITORY (<30)**\n`;
    analysis += `• Potential bounce or reversal likely\n`;
    analysis += `• Good area for contrarian plays\n`;
    analysis += `• Wait for RSI to cross above 35 for confirmation\n`;
    analysis += `• Look for bullish divergence with price\n\n`;
    analysis += `**Risk Warning:** Oversold can become more oversold in bear markets`;
    
  } else if (rsi > 50) {
    analysis += `🔵 **BULLISH MOMENTUM (50-70)**\n`;
    analysis += `• Buyers in control, upward pressure\n`;
    analysis += `• Trend likely to continue\n`;
    analysis += `• Good for trend-following strategies\n`;
    analysis += `• Watch for break above 70 (overbought warning)`;
    
  } else {
    analysis += `🟡 **WEAK MOMENTUM (30-50)**\n`;
    analysis += `• Sellers have slight edge\n`;
    analysis += `• Consolidation or mild bearish pressure\n`;
    analysis += `• Wait for clear break above/below 50\n`;
    analysis += `• Good area for range trading strategies`;
  }
  
  return analysis;
}

function generateSRAnalysis(symbol: string, price: number, support: number[], resistance: number[], nearSupport: boolean, nearResistance: boolean): string {
  let analysis = `🎯 **${symbol} Support & Resistance Analysis**\n\n`;
  
  analysis += `**Current Price:** $${price.toFixed(2)}\n\n`;
  
  if (resistance && resistance.length > 0) {
    analysis += `🔴 **RESISTANCE LEVELS:**\n`;
    resistance.forEach((level, index) => {
      const distance = ((level - price) / price) * 100;
      analysis += `• R${index + 1}: $${level.toFixed(2)} (${distance > 0 ? '+' : ''}${distance.toFixed(1)}%)\n`;
    });
    analysis += `\n`;
  }
  
  if (support && support.length > 0) {
    analysis += `🟢 **SUPPORT LEVELS:**\n`;
    support.forEach((level, index) => {
      const distance = ((level - price) / price) * 100;
      analysis += `• S${index + 1}: $${level.toFixed(2)} (${distance.toFixed(1)}%)\n`;
    });
    analysis += `\n`;
  }
  
  if (nearResistance) {
    analysis += `⚠️ **NEAR RESISTANCE:**\n`;
    analysis += `• Price approaching key resistance\n`;
    analysis += `• Watch for breakout with volume\n`;
    analysis += `• Failure to break may lead to pullback\n`;
    analysis += `• Consider profit-taking strategy\n\n`;
  }
  
  if (nearSupport) {
    analysis += `💪 **NEAR SUPPORT:**\n`;
    analysis += `• Strong support level nearby\n`;
    analysis += `• Good risk/reward for entries\n`;
    analysis += `• Watch for bounce confirmation\n`;
    analysis += `• Tight stop loss below support\n\n`;
  }
  
  analysis += `📈 **TRADING STRATEGY:**\n`;
  analysis += `• Buy near support, sell near resistance\n`;
  analysis += `• Breakouts require volume confirmation\n`;
  analysis += `• Failed breakouts often reverse quickly`;
  
  return analysis;
}

function generateTrendAnalysis(symbol: string, price: number, trend: string, shortTermTrend: string, sma20: number, sma50: number): string {
  let analysis = `📈 **${symbol} Trend Analysis**\n\n`;
  
  analysis += `**Overall Trend:** ${trend.toUpperCase()}\n`;
  analysis += `**Short-term:** ${shortTermTrend.toUpperCase()}\n\n`;
  
  analysis += `**Moving Averages:**\n`;
  analysis += `• SMA20: $${sma20?.toFixed(2)}\n`;
  analysis += `• SMA50: $${sma50?.toFixed(2)}\n`;
  analysis += `• Price vs SMA20: ${price > sma20 ? '↗️ Above' : '↘️ Below'}\n`;
  analysis += `• Price vs SMA50: ${price > sma50 ? '↗️ Above' : '↘️ Below'}\n\n`;
  
  if (trend === 'bullish') {
    analysis += `🟢 **BULLISH TREND CONFIRMED:**\n`;
    analysis += `• Price above both key moving averages\n`;
    analysis += `• Higher highs and higher lows pattern\n`;
    analysis += `• Buy dips strategy recommended\n`;
    analysis += `• Use SMA20 as dynamic support\n\n`;
    analysis += `**Trend Invalidation:** Close below SMA50`;
    
  } else if (trend === 'bearish') {
    analysis += `🔴 **BEARISH TREND CONFIRMED:**\n`;
    analysis += `• Price below key moving averages\n`;
    analysis += `• Lower highs and lower lows pattern\n`;
    analysis += `• Sell rallies strategy recommended\n`;
    analysis += `• Use SMA20 as dynamic resistance\n\n`;
    analysis += `**Trend Reversal:** Sustained break above SMA50`;
    
  } else {
    analysis += `🟡 **SIDEWAYS/CONSOLIDATION:**\n`;
    analysis += `• Price chopping around moving averages\n`;
    analysis += `• Range-bound trading environment\n`;
    analysis += `• Wait for clear directional break\n`;
    analysis += `• Use support/resistance levels\n\n`;
    analysis += `**Breakout Watch:** Above/below recent highs/lows`;
  }
  
  return analysis;
}

function generateGeneralAnalysis(symbol: string, price: number, trend: string, rsiSignal: string, rsiDesc: string, nearSupport: boolean, nearResistance: boolean, indicators: any): string {
  let analysis = `📊 **${symbol} Market Analysis**\n\n`;
  
  analysis += `**Current Price:** $${price.toFixed(2)}\n`;
  analysis += `**Trend:** ${trend.toUpperCase()}\n`;
  analysis += `**RSI Status:** ${rsiSignal.toUpperCase()} (${indicators.rsi?.toFixed(1)})\n\n`;
  
  // Market sentiment
  let sentiment = 'NEUTRAL';
  if (trend === 'bullish' && rsiSignal !== 'overbought') sentiment = 'BULLISH';
  else if (trend === 'bearish' && rsiSignal !== 'oversold') sentiment = 'BEARISH';
  
  analysis += `🎯 **MARKET SENTIMENT:** ${sentiment}\n\n`;
  
  analysis += `**Technical Overview:**\n`;
  analysis += `• Price ${trend === 'bullish' ? 'above' : 'below'} key moving averages\n`;
  analysis += `• RSI ${rsiDesc}\n`;
  if (nearSupport) analysis += `• Near strong support level\n`;
  if (nearResistance) analysis += `• Approaching resistance zone\n`;
  
  analysis += `\n**Trading Recommendations:**\n`;
  if (sentiment === 'BULLISH') {
    analysis += `• Look for buying opportunities on dips\n`;
    analysis += `• Trail stops below recent swing lows\n`;
    analysis += `• Target: $${(price * 1.05).toFixed(2)} - $${(price * 1.10).toFixed(2)}`;
  } else if (sentiment === 'BEARISH') {
    analysis += `• Consider reducing long positions\n`;
    analysis += `• Wait for trend reversal signals\n`;
    analysis += `• Support levels: $${indicators.support?.[0]?.toFixed(2)}`;
  } else {
    analysis += `• Neutral stance recommended\n`;
    analysis += `• Wait for clear directional signals\n`;
    analysis += `• Range trading between S&R levels`;
  }
  
  return analysis;
}

export async function POST(request: Request) {
  try {
    const { chartData, indicators, question } = await request.json();
    
    // Generate professional analysis
    const analysis = generateProfessionalAnalysis(chartData, indicators, question || '');
    
    return NextResponse.json({ analysis });
  } catch (error) {
    console.error('Error analyzing chart:', error);
    return NextResponse.json({ 
      analysis: '⚠️ Unable to process analysis request. Please check your input data and try again.' 
    }, { status: 500 });
  }
}