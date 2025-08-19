import { NextResponse } from 'next/server';
import { cryptoConfig } from '@/lib/crypto-config';
import OpenAI from 'openai';

export async function POST(request: Request) {
  try {
    const { symbol, data, question } = await request.json();

    if (!symbol) {
      return NextResponse.json(
        { error: 'Symbol is required' },
        { status: 400 }
      );
    }

    // Use OpenAI if available and enabled
    if (cryptoConfig.aiAgent.enabled && process.env.OPENAI_API_KEY) {
      try {
        const openai = new OpenAI({
          apiKey: process.env.OPENAI_API_KEY,
        });

        const prompt = buildAnalysisPrompt(symbol, data, question);
        
        const completion = await openai.chat.completions.create({
          model: cryptoConfig.aiAgent.model,
          messages: [
            {
              role: 'system',
              content: 'You are a professional cryptocurrency analyst. Provide clear, actionable insights based on technical analysis. Be concise and avoid speculation. Focus on data-driven observations.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          max_tokens: cryptoConfig.aiAgent.maxTokens,
          temperature: cryptoConfig.aiAgent.temperature,
        });

        return NextResponse.json({
          analysis: completion.choices[0].message.content,
          source: 'ai',
          timestamp: Date.now(),
        });
      } catch (aiError) {
        console.error('OpenAI API error:', aiError);
        // Fall back to rule-based analysis
      }
    }

    // Rule-based analysis fallback
    const analysis = generateRuleBasedAnalysis(symbol, data, question);
    
    return NextResponse.json({
      analysis,
      source: 'rule-based',
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate analysis',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

function buildAnalysisPrompt(symbol: string, data: any, question?: string): string {
  const currentPrice = data?.ticker?.last || data?.last || 0;
  const change24h = data?.ticker?.percentage || data?.percentage || 0;
  const volume = data?.ticker?.quoteVolume || data?.volume || 0;
  const high24h = data?.ticker?.high || data?.high || 0;
  const low24h = data?.ticker?.low || data?.low || 0;

  let prompt = `Analyze ${symbol} with the following data:

Current Price: $${currentPrice.toFixed(6)}
24h Change: ${change24h.toFixed(2)}%
24h High: $${high24h.toFixed(6)}
24h Low: $${low24h.toFixed(6)}
24h Volume: ${volume.toLocaleString()}

`;

  if (data?.indicators) {
    prompt += `Technical Indicators:
`;
    if (data.indicators.sma20?.length > 0) {
      const sma20 = data.indicators.sma20[data.indicators.sma20.length - 1]?.value;
      prompt += `- SMA 20: $${sma20?.toFixed(6) || 'N/A'}\n`;
    }
    if (data.indicators.sma50?.length > 0) {
      const sma50 = data.indicators.sma50[data.indicators.sma50.length - 1]?.value;
      prompt += `- SMA 50: $${sma50?.toFixed(6) || 'N/A'}\n`;
    }
    if (data.indicators.rsi) {
      prompt += `- RSI: ${data.indicators.rsi.toFixed(2)}\n`;
    }
    if (data.indicators.support) {
      prompt += `- Support: $${data.indicators.support.toFixed(6)}\n`;
    }
    if (data.indicators.resistance) {
      prompt += `- Resistance: $${data.indicators.resistance.toFixed(6)}\n`;
    }
  }

  if (question) {
    prompt += `\nSpecific Question: ${question}\n`;
  }

  prompt += '\nProvide a concise technical analysis focusing on:\n1. Current trend and momentum\n2. Key support/resistance levels\n3. Trading signals and recommendations\n4. Risk assessment\n\nKeep the response under 200 words and avoid financial advice disclaimers.';

  return prompt;
}

function generateRuleBasedAnalysis(symbol: string, data: any, question?: string): string {
  const currentPrice = data?.ticker?.last || data?.last || 0;
  const change24h = data?.ticker?.percentage || data?.percentage || 0;
  const volume = data?.ticker?.quoteVolume || data?.volume || 0;
  const rsi = data?.indicators?.rsi || 50;
  const support = data?.indicators?.support || 0;
  const resistance = data?.indicators?.resistance || 0;

  let analysis = `📊 ${symbol} Technical Analysis\n\n`;

  // Trend analysis
  if (change24h > 3) {
    analysis += '🟢 Strong bullish momentum with significant gains\n';
  } else if (change24h > 0) {
    analysis += '🟡 Moderate bullish trend\n';
  } else if (change24h > -3) {
    analysis += '🟡 Slight bearish pressure\n';
  } else {
    analysis += '🔴 Strong bearish momentum\n';
  }

  // RSI analysis
  if (rsi > 70) {
    analysis += '⚠️ RSI indicates overbought conditions (potential reversal)\n';
  } else if (rsi < 30) {
    analysis += '🟢 RSI shows oversold conditions (potential bounce)\n';
  } else {
    analysis += '➡️ RSI in neutral territory\n';
  }

  // Support/Resistance
  if (support && resistance) {
    const distanceToSupport = ((currentPrice - support) / currentPrice * 100);
    const distanceToResistance = ((resistance - currentPrice) / currentPrice * 100);
    
    analysis += `\n📈 Key Levels:\n`;
    analysis += `• Support: $${support.toFixed(6)} (${distanceToSupport.toFixed(1)}% below)\n`;
    analysis += `• Resistance: $${resistance.toFixed(6)} (${distanceToResistance.toFixed(1)}% above)\n`;
  }

  // Volume analysis
  analysis += `\n💹 Volume: ${volume > 1000000 ? 'High' : volume > 100000 ? 'Moderate' : 'Low'} trading activity\n`;

  // Question-specific response
  if (question) {
    analysis += `\n💭 Regarding "${question}":\n`;
    if (question.toLowerCase().includes('buy')) {
      analysis += change24h > 0 ? 'Consider buying on pullbacks to support levels' : 'Wait for trend confirmation before entering';
    } else if (question.toLowerCase().includes('sell')) {
      analysis += change24h < 0 ? 'Consider taking profits near resistance' : 'Hold for further upside potential';
    } else {
      analysis += 'Monitor key levels and volume for confirmation signals';
    }
  }

  return analysis;
}