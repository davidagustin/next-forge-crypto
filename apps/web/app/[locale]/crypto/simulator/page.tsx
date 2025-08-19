'use client';

import { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, TrendingDown, ShoppingCart, Wallet, Trophy, Target, AlertCircle } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import dynamic from 'next/dynamic';

const TradingViewChart = dynamic(
  () => import('@/components/crypto/TradingViewChart'),
  { ssr: false }
);

interface Trade {
  id: string;
  symbol: string;
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  timestamp: Date;
  profit?: number;
}

interface Holding {
  symbol: string;
  amount: number;
  avgPrice: number;
  currentPrice: number;
  value: number;
  profit: number;
  profitPercent: number;
}

export default function TradingSimulatorPage() {
  const INITIAL_BALANCE = 10000;
  
  const [balance, setBalance] = useState(INITIAL_BALANCE);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [holdings, setHoldings] = useState<Map<string, Holding>>(new Map());
  const [selectedSymbol, setSelectedSymbol] = useState('BTCUSDT');
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [orderSide, setOrderSide] = useState<'buy' | 'sell'>('buy');
  const [orderAmount, setOrderAmount] = useState('');
  const [orderPrice, setOrderPrice] = useState('');
  const [currentPrices, setCurrentPrices] = useState<Record<string, number>>({});
  const [portfolioValue, setPortfolioValue] = useState(INITIAL_BALANCE);
  const [winRate, setWinRate] = useState(0);
  const [totalTrades, setTotalTrades] = useState(0);
  const [profitableTrades, setProfitableTrades] = useState(0);
  const [bestTrade, setBestTrade] = useState<Trade | null>(null);
  const [worstTrade, setWorstTrade] = useState<Trade | null>(null);

  // Mock current prices
  useEffect(() => {
    const mockPrices: Record<string, number> = {
      'BTCUSDT': 68750 + (Math.random() - 0.5) * 1000,
      'ETHUSDT': 3500 + (Math.random() - 0.5) * 100,
      'BNBUSDT': 600 + (Math.random() - 0.5) * 20,
      'SOLUSDT': 200 + (Math.random() - 0.5) * 10,
      'ADAUSDT': 0.70 + (Math.random() - 0.5) * 0.05,
      'XRPUSDT': 0.75 + (Math.random() - 0.5) * 0.05,
      'DOTUSDT': 10.5 + (Math.random() - 0.5) * 0.5,
      'AVAXUSDT': 55 + (Math.random() - 0.5) * 3,
    };
    
    setCurrentPrices(mockPrices);
    
    // Update prices every 5 seconds
    const interval = setInterval(() => {
      const updated = Object.entries(mockPrices).reduce((acc, [key, basePrice]) => {
        acc[key] = basePrice * (1 + (Math.random() - 0.5) * 0.02); // ±1% variation
        return acc;
      }, {} as Record<string, number>);
      setCurrentPrices(updated);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // Calculate portfolio value
  useEffect(() => {
    let totalValue = balance;
    const updatedHoldings = new Map<string, Holding>();
    
    holdings.forEach((holding, symbol) => {
      const currentPrice = currentPrices[symbol] || holding.avgPrice;
      const value = holding.amount * currentPrice;
      const profit = value - (holding.amount * holding.avgPrice);
      const profitPercent = (profit / (holding.amount * holding.avgPrice)) * 100;
      
      updatedHoldings.set(symbol, {
        ...holding,
        currentPrice,
        value,
        profit,
        profitPercent
      });
      
      totalValue += value;
    });
    
    setHoldings(updatedHoldings);
    setPortfolioValue(totalValue);
  }, [currentPrices, balance]);

  // Calculate statistics
  useEffect(() => {
    const sellTrades = trades.filter(t => t.type === 'sell');
    const profitable = sellTrades.filter(t => t.profit && t.profit > 0);
    
    setTotalTrades(sellTrades.length);
    setProfitableTrades(profitable.length);
    setWinRate(sellTrades.length > 0 ? (profitable.length / sellTrades.length) * 100 : 0);
    
    if (sellTrades.length > 0) {
      const sorted = [...sellTrades].sort((a, b) => (b.profit || 0) - (a.profit || 0));
      setBestTrade(sorted[0]);
      setWorstTrade(sorted[sorted.length - 1]);
    }
  }, [trades]);

  const executeTrade = () => {
    const amount = parseFloat(orderAmount);
    const price = orderType === 'limit' ? parseFloat(orderPrice) : (currentPrices[selectedSymbol] || 0);
    
    if (!amount || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    if (orderType === 'limit' && (!price || price <= 0)) {
      toast.error('Please enter a valid price for limit order');
      return;
    }
    
    const totalCost = amount * price;
    
    if (orderSide === 'buy') {
      if (totalCost > balance) {
        toast.error('Insufficient balance');
        return;
      }
      
      // Execute buy
      setBalance(prev => prev - totalCost);
      
      const currentHolding = holdings.get(selectedSymbol);
      if (currentHolding) {
        const newAmount = currentHolding.amount + amount;
        const newAvgPrice = ((currentHolding.amount * currentHolding.avgPrice) + totalCost) / newAmount;
        
        holdings.set(selectedSymbol, {
          ...currentHolding,
          amount: newAmount,
          avgPrice: newAvgPrice
        });
      } else {
        holdings.set(selectedSymbol, {
          symbol: selectedSymbol,
          amount,
          avgPrice: price,
          currentPrice: price,
          value: totalCost,
          profit: 0,
          profitPercent: 0
        });
      }
      
      const trade: Trade = {
        id: Date.now().toString(),
        symbol: selectedSymbol,
        type: 'buy',
        amount,
        price,
        timestamp: new Date()
      };
      
      setTrades([...trades, trade]);
      toast.success(`Bought ${amount} ${selectedSymbol} at $${price.toFixed(2)}`);
    } else {
      // Execute sell
      const holding = holdings.get(selectedSymbol);
      if (!holding || holding.amount < amount) {
        toast.error('Insufficient holdings');
        return;
      }
      
      const revenue = amount * price;
      const cost = amount * holding.avgPrice;
      const profit = revenue - cost;
      
      setBalance(prev => prev + revenue);
      
      if (holding.amount === amount) {
        holdings.delete(selectedSymbol);
      } else {
        holdings.set(selectedSymbol, {
          ...holding,
          amount: holding.amount - amount
        });
      }
      
      const trade: Trade = {
        id: Date.now().toString(),
        symbol: selectedSymbol,
        type: 'sell',
        amount,
        price,
        timestamp: new Date(),
        profit
      };
      
      setTrades([...trades, trade]);
      toast.success(`Sold ${amount} ${selectedSymbol} at $${price.toFixed(2)} | P&L: $${profit.toFixed(2)}`);
    }
    
    setOrderAmount('');
    setOrderPrice('');
  };

  const resetSimulator = () => {
    setBalance(INITIAL_BALANCE);
    setTrades([]);
    setHoldings(new Map());
    setPortfolioValue(INITIAL_BALANCE);
    toast.success('Simulator reset to initial state');
  };

  const totalProfitLoss = portfolioValue - INITIAL_BALANCE;
  const totalProfitLossPercent = ((portfolioValue - INITIAL_BALANCE) / INITIAL_BALANCE) * 100;

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <Toaster position="top-right" />
      
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Trophy className="w-8 h-8 text-yellow-500" />
              Paper Trading Simulator
            </h1>
            <p className="text-gray-400 mt-1">Practice trading without real money</p>
          </div>
          
          <button
            onClick={resetSimulator}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            Reset Simulator
          </button>
        </div>

        {/* Portfolio Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Cash Balance</span>
              <Wallet className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-xl font-bold">${balance.toFixed(2)}</div>
          </div>

          <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Portfolio Value</span>
              <DollarSign className="w-4 h-4 text-green-500" />
            </div>
            <div className="text-xl font-bold">${portfolioValue.toFixed(2)}</div>
          </div>

          <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Total P&L</span>
              {totalProfitLoss >= 0 ? (
                <TrendingUp className="w-4 h-4 text-green-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500" />
              )}
            </div>
            <div className={`text-xl font-bold ${totalProfitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {totalProfitLoss >= 0 ? '+' : ''}${totalProfitLoss.toFixed(2)}
            </div>
            <div className={`text-sm ${totalProfitLossPercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {totalProfitLossPercent >= 0 ? '+' : ''}{totalProfitLossPercent.toFixed(2)}%
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Win Rate</span>
              <Target className="w-4 h-4 text-purple-500" />
            </div>
            <div className="text-xl font-bold">{winRate.toFixed(1)}%</div>
            <div className="text-sm text-gray-400">
              {profitableTrades}/{totalTrades} trades
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Best Trade</span>
              <Trophy className="w-4 h-4 text-yellow-500" />
            </div>
            <div className="text-xl font-bold text-green-500">
              {bestTrade ? `+$${bestTrade.profit?.toFixed(2)}` : '-'}
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Worst Trade</span>
              <AlertCircle className="w-4 h-4 text-red-500" />
            </div>
            <div className="text-xl font-bold text-red-500">
              {worstTrade && worstTrade.profit ? `${worstTrade.profit < 0 ? '' : '+'}$${worstTrade.profit.toFixed(2)}` : '-'}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Chart and Order Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Chart */}
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
              <h2 className="text-xl font-semibold mb-4">{selectedSymbol}</h2>
              <TradingViewChart
                symbol={selectedSymbol}
                interval="60"
                theme="dark"
                height={400}
              />
            </div>

            {/* Order Form */}
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
              <h3 className="text-lg font-semibold mb-4">Place Order</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Symbol</label>
                    <select
                      value={selectedSymbol}
                      onChange={(e) => setSelectedSymbol(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-800 rounded-lg"
                    >
                      {Object.keys(currentPrices).map(symbol => (
                        <option key={symbol} value={symbol}>{symbol}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Order Type</label>
                    <select
                      value={orderType}
                      onChange={(e) => setOrderType(e.target.value as 'market' | 'limit')}
                      className="w-full px-3 py-2 bg-gray-800 rounded-lg"
                    >
                      <option value="market">Market</option>
                      <option value="limit">Limit</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Side</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setOrderSide('buy')}
                      className={`py-2 rounded-lg ${
                        orderSide === 'buy'
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-800 text-gray-400'
                      }`}
                    >
                      Buy
                    </button>
                    <button
                      onClick={() => setOrderSide('sell')}
                      className={`py-2 rounded-lg ${
                        orderSide === 'sell'
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-800 text-gray-400'
                      }`}
                    >
                      Sell
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Amount</label>
                  <input
                    type="number"
                    value={orderAmount}
                    onChange={(e) => setOrderAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-3 py-2 bg-gray-800 rounded-lg"
                  />
                </div>

                {orderType === 'limit' && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Price</label>
                    <input
                      type="number"
                      value={orderPrice}
                      onChange={(e) => setOrderPrice(e.target.value)}
                      placeholder="0.00"
                      className="w-full px-3 py-2 bg-gray-800 rounded-lg"
                    />
                  </div>
                )}

                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Current Price</span>
                    <span className="font-medium">
                      ${currentPrices[selectedSymbol]?.toFixed(2) || '---'}
                    </span>
                  </div>
                  {orderAmount && (
                    <div className="flex justify-between text-sm mt-2">
                      <span className="text-gray-400">Total</span>
                      <span className="font-medium">
                        ${(parseFloat(orderAmount) * (orderType === 'limit' && orderPrice ? parseFloat(orderPrice) : currentPrices[selectedSymbol] || 0)).toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>

                <button
                  onClick={executeTrade}
                  className={`w-full py-3 rounded-lg font-medium ${
                    orderSide === 'buy'
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {orderSide === 'buy' ? 'Buy' : 'Sell'} {selectedSymbol}
                </button>
              </div>
            </div>
          </div>

          {/* Holdings and History */}
          <div className="space-y-6">
            {/* Current Holdings */}
            <div className="bg-gray-900 rounded-lg border border-gray-800">
              <div className="p-4 border-b border-gray-800">
                <h3 className="text-lg font-semibold">Holdings</h3>
              </div>
              <div className="p-4">
                {holdings.size === 0 ? (
                  <p className="text-gray-400 text-center py-4">No holdings yet</p>
                ) : (
                  <div className="space-y-3">
                    {Array.from(holdings.values()).map(holding => (
                      <div key={holding.symbol} className="bg-gray-800 rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="font-medium">{holding.symbol}</div>
                            <div className="text-sm text-gray-400">
                              {holding.amount.toFixed(4)} @ ${holding.avgPrice.toFixed(2)}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">${holding.value.toFixed(2)}</div>
                            <div className={`text-sm ${holding.profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                              {holding.profit >= 0 ? '+' : ''}{holding.profit.toFixed(2)} ({holding.profitPercent.toFixed(2)}%)
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Recent Trades */}
            <div className="bg-gray-900 rounded-lg border border-gray-800">
              <div className="p-4 border-b border-gray-800">
                <h3 className="text-lg font-semibold">Recent Trades</h3>
              </div>
              <div className="p-4 max-h-96 overflow-y-auto">
                {trades.length === 0 ? (
                  <p className="text-gray-400 text-center py-4">No trades yet</p>
                ) : (
                  <div className="space-y-2">
                    {[...trades].reverse().slice(0, 10).map(trade => (
                      <div key={trade.id} className="bg-gray-800 rounded p-2 text-sm">
                        <div className="flex justify-between">
                          <span className={trade.type === 'buy' ? 'text-green-500' : 'text-red-500'}>
                            {trade.type.toUpperCase()}
                          </span>
                          <span>{trade.symbol}</span>
                        </div>
                        <div className="flex justify-between text-gray-400">
                          <span>{trade.amount.toFixed(4)} @ ${trade.price.toFixed(2)}</span>
                          {trade.profit !== undefined && (
                            <span className={trade.profit >= 0 ? 'text-green-500' : 'text-red-500'}>
                              {trade.profit >= 0 ? '+' : ''}${trade.profit.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}