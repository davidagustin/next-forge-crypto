'use client';

import { useState, useEffect } from 'react';
import { Coins, TrendingUp, Percent, Lock, Zap, DollarSign, BarChart3, Info } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

interface YieldPool {
  id: string;
  protocol: string;
  pair: string;
  tvl: number;
  apy: number;
  risk: 'low' | 'medium' | 'high';
  chain: string;
  rewards: string[];
  minDeposit: number;
  lockPeriod?: number;
}

interface StakingOption {
  coin: string;
  apy: number;
  minStake: number;
  lockPeriod: number;
  validator?: string;
  compounding: boolean;
}

export default function DeFiPage() {
  const [activeTab, setActiveTab] = useState<'yield' | 'staking' | 'lending'>('yield');
  const [yieldPools, setYieldPools] = useState<YieldPool[]>([]);
  const [stakingOptions, setStakingOptions] = useState<StakingOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState<'apy' | 'tvl'>('apy');
  const [filterRisk, setFilterRisk] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [filterChain, setFilterChain] = useState<string>('all');

  // Staking Calculator State
  const [calcAmount, setCalcAmount] = useState(1000);
  const [calcAPY, setCalcAPY] = useState(10);
  const [calcPeriod, setCalcPeriod] = useState(365);
  const [calcCompounding, setCalcCompounding] = useState(true);

  useEffect(() => {
    fetchDeFiData();
  }, []);

  const fetchDeFiData = async () => {
    setLoading(true);
    
    // Mock DeFi data
    const mockYieldPools: YieldPool[] = [
      {
        id: '1',
        protocol: 'Uniswap V3',
        pair: 'ETH/USDC',
        tvl: 450000000,
        apy: 24.5,
        risk: 'medium',
        chain: 'Ethereum',
        rewards: ['UNI', 'Trading Fees'],
        minDeposit: 100,
      },
      {
        id: '2',
        protocol: 'PancakeSwap',
        pair: 'BNB/USDT',
        tvl: 320000000,
        apy: 18.3,
        risk: 'low',
        chain: 'BSC',
        rewards: ['CAKE', 'Trading Fees'],
        minDeposit: 50,
      },
      {
        id: '3',
        protocol: 'Curve Finance',
        pair: '3CRV',
        tvl: 890000000,
        apy: 8.5,
        risk: 'low',
        chain: 'Ethereum',
        rewards: ['CRV', 'Trading Fees'],
        minDeposit: 500,
      },
      {
        id: '4',
        protocol: 'Aave',
        pair: 'USDC Lending',
        tvl: 1200000000,
        apy: 6.2,
        risk: 'low',
        chain: 'Ethereum',
        rewards: ['AAVE'],
        minDeposit: 10,
      },
      {
        id: '5',
        protocol: 'Compound',
        pair: 'DAI Supply',
        tvl: 650000000,
        apy: 5.8,
        risk: 'low',
        chain: 'Ethereum',
        rewards: ['COMP'],
        minDeposit: 1,
      },
      {
        id: '6',
        protocol: 'SushiSwap',
        pair: 'SUSHI/ETH',
        tvl: 180000000,
        apy: 35.2,
        risk: 'high',
        chain: 'Ethereum',
        rewards: ['SUSHI', 'Trading Fees'],
        minDeposit: 200,
      },
      {
        id: '7',
        protocol: 'Raydium',
        pair: 'SOL/USDC',
        tvl: 120000000,
        apy: 28.7,
        risk: 'medium',
        chain: 'Solana',
        rewards: ['RAY', 'Trading Fees'],
        minDeposit: 20,
      },
      {
        id: '8',
        protocol: 'Trader Joe',
        pair: 'AVAX/USDC',
        tvl: 95000000,
        apy: 22.1,
        risk: 'medium',
        chain: 'Avalanche',
        rewards: ['JOE', 'Trading Fees'],
        minDeposit: 100,
      },
    ];

    const mockStaking: StakingOption[] = [
      { coin: 'ETH', apy: 4.5, minStake: 32, lockPeriod: 0, validator: 'Lido', compounding: true },
      { coin: 'ADA', apy: 5.2, minStake: 10, lockPeriod: 0, compounding: true },
      { coin: 'DOT', apy: 12.5, minStake: 120, lockPeriod: 28, compounding: false },
      { coin: 'SOL', apy: 7.8, minStake: 1, lockPeriod: 3, compounding: true },
      { coin: 'ATOM', apy: 18.5, minStake: 1, lockPeriod: 21, compounding: true },
      { coin: 'MATIC', apy: 6.2, minStake: 1, lockPeriod: 0, compounding: true },
    ];

    setYieldPools(mockYieldPools);
    setStakingOptions(mockStaking);
    setLoading(false);
  };

  const calculateReturns = () => {
    const rate = calcAPY / 100;
    const periods = calcPeriod / 365;
    
    let finalAmount;
    if (calcCompounding) {
      // Compound interest formula: A = P(1 + r/n)^(nt)
      // Assuming daily compounding (n = 365)
      finalAmount = calcAmount * Math.pow(1 + rate / 365, 365 * periods);
    } else {
      // Simple interest: A = P(1 + rt)
      finalAmount = calcAmount * (1 + rate * periods);
    }
    
    const profit = finalAmount - calcAmount;
    const dailyEarnings = profit / calcPeriod;
    
    return { finalAmount, profit, dailyEarnings };
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'high': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const filteredPools = yieldPools
    .filter(pool => filterRisk === 'all' || pool.risk === filterRisk)
    .filter(pool => filterChain === 'all' || pool.chain === filterChain)
    .sort((a, b) => sortBy === 'apy' ? b.apy - a.apy : b.tvl - a.tvl);

  const uniqueChains = [...new Set(yieldPools.map(p => p.chain))];
  const { finalAmount, profit, dailyEarnings } = calculateReturns();

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <Toaster position="top-right" />
      
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Coins className="w-8 h-8 text-purple-500" />
              DeFi Dashboard
            </h1>
            <p className="text-gray-400 mt-1">Yield farming, staking, and lending opportunities</p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Total TVL</span>
              <DollarSign className="w-4 h-4 text-green-500" />
            </div>
            <div className="text-2xl font-bold">
              ${(yieldPools.reduce((sum, p) => sum + p.tvl, 0) / 1e9).toFixed(2)}B
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Avg APY</span>
              <Percent className="w-4 h-4 text-purple-500" />
            </div>
            <div className="text-2xl font-bold">
              {(yieldPools.reduce((sum, p) => sum + p.apy, 0) / yieldPools.length).toFixed(2)}%
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Active Pools</span>
              <Zap className="w-4 h-4 text-yellow-500" />
            </div>
            <div className="text-2xl font-bold">{yieldPools.length}</div>
          </div>

          <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Chains</span>
              <BarChart3 className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-2xl font-bold">{uniqueChains.length}</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-800">
          <button
            onClick={() => setActiveTab('yield')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'yield'
                ? 'text-white border-b-2 border-purple-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Yield Farming
          </button>
          <button
            onClick={() => setActiveTab('staking')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'staking'
                ? 'text-white border-b-2 border-purple-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Staking
          </button>
          <button
            onClick={() => setActiveTab('lending')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'lending'
                ? 'text-white border-b-2 border-purple-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Lending
          </button>
        </div>

        {/* Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeTab === 'yield' && (
              <div className="bg-gray-900 rounded-lg border border-gray-800">
                <div className="p-4 border-b border-gray-800">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h2 className="text-xl font-semibold">Yield Farming Opportunities</h2>
                    <div className="flex gap-2">
                      <select
                        value={filterRisk}
                        onChange={(e) => setFilterRisk(e.target.value as any)}
                        className="px-3 py-1 bg-gray-800 rounded text-sm"
                      >
                        <option value="all">All Risk</option>
                        <option value="low">Low Risk</option>
                        <option value="medium">Medium Risk</option>
                        <option value="high">High Risk</option>
                      </select>
                      <select
                        value={filterChain}
                        onChange={(e) => setFilterChain(e.target.value)}
                        className="px-3 py-1 bg-gray-800 rounded text-sm"
                      >
                        <option value="all">All Chains</option>
                        {uniqueChains.map(chain => (
                          <option key={chain} value={chain}>{chain}</option>
                        ))}
                      </select>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="px-3 py-1 bg-gray-800 rounded text-sm"
                      >
                        <option value="apy">Sort by APY</option>
                        <option value="tvl">Sort by TVL</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="divide-y divide-gray-800">
                  {filteredPools.map(pool => (
                    <div key={pool.id} className="p-4 hover:bg-gray-800/50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-medium text-lg">{pool.protocol}</h3>
                            <span className="px-2 py-0.5 bg-gray-800 rounded text-xs">
                              {pool.chain}
                            </span>
                            <span className={`text-sm ${getRiskColor(pool.risk)}`}>
                              {pool.risk.toUpperCase()}
                            </span>
                          </div>
                          <div className="text-gray-400 text-sm mb-2">{pool.pair}</div>
                          <div className="flex flex-wrap gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">TVL:</span>{' '}
                              <span className="font-medium">
                                ${(pool.tvl / 1e6).toFixed(2)}M
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">Min:</span>{' '}
                              <span className="font-medium">${pool.minDeposit}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Rewards:</span>{' '}
                              <span className="font-medium">{pool.rewards.join(', ')}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-500">
                            {pool.apy.toFixed(2)}%
                          </div>
                          <div className="text-sm text-gray-400">APY</div>
                          <button
                            onClick={() => toast.success(`View ${pool.protocol} pool`)}
                            className="mt-2 px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded text-sm"
                          >
                            Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'staking' && (
              <div className="bg-gray-900 rounded-lg border border-gray-800">
                <div className="p-4 border-b border-gray-800">
                  <h2 className="text-xl font-semibold">Staking Opportunities</h2>
                </div>
                <div className="divide-y divide-gray-800">
                  {stakingOptions.map((option, index) => (
                    <div key={index} className="p-4 hover:bg-gray-800/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-lg">{option.coin}</h3>
                          <div className="flex gap-4 mt-2 text-sm text-gray-400">
                            <span>Min: {option.minStake} {option.coin}</span>
                            <span>Lock: {option.lockPeriod} days</span>
                            {option.validator && <span>Via: {option.validator}</span>}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-500">
                            {option.apy.toFixed(2)}%
                          </div>
                          <div className="text-sm text-gray-400">APY</div>
                          {option.compounding && (
                            <span className="text-xs bg-green-900/50 text-green-400 px-2 py-0.5 rounded">
                              Auto-compound
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'lending' && (
              <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
                <h2 className="text-xl font-semibold mb-4">Lending Markets</h2>
                <div className="grid gap-4">
                  {[
                    { asset: 'USDC', supplyAPY: 3.2, borrowAPY: 5.8, utilization: 72 },
                    { asset: 'DAI', supplyAPY: 2.8, borrowAPY: 4.5, utilization: 65 },
                    { asset: 'USDT', supplyAPY: 3.5, borrowAPY: 6.2, utilization: 78 },
                    { asset: 'ETH', supplyAPY: 1.2, borrowAPY: 3.5, utilization: 45 },
                    { asset: 'WBTC', supplyAPY: 0.8, borrowAPY: 2.8, utilization: 38 },
                  ].map((market, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                      <div>
                        <h4 className="font-medium">{market.asset}</h4>
                        <div className="text-sm text-gray-400 mt-1">
                          Utilization: {market.utilization}%
                        </div>
                      </div>
                      <div className="flex gap-6">
                        <div className="text-center">
                          <div className="text-green-500 font-bold">{market.supplyAPY}%</div>
                          <div className="text-xs text-gray-400">Supply APY</div>
                        </div>
                        <div className="text-center">
                          <div className="text-red-500 font-bold">{market.borrowAPY}%</div>
                          <div className="text-xs text-gray-400">Borrow APY</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Staking Calculator */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-4">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-500" />
                Staking Calculator
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Investment Amount ($)</label>
                  <input
                    type="number"
                    value={calcAmount}
                    onChange={(e) => setCalcAmount(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">APY (%)</label>
                  <input
                    type="number"
                    value={calcAPY}
                    onChange={(e) => setCalcAPY(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Period (days)</label>
                  <input
                    type="number"
                    value={calcPeriod}
                    onChange={(e) => setCalcPeriod(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Compound Interest</label>
                  <button
                    onClick={() => setCalcCompounding(!calcCompounding)}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      calcCompounding ? 'bg-purple-600' : 'bg-gray-700'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      calcCompounding ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>

                <div className="border-t border-gray-800 pt-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Final Amount</span>
                    <span className="font-bold text-lg">
                      ${finalAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Profit</span>
                    <span className="font-bold text-green-500">
                      +${profit.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Daily Earnings</span>
                    <span className="font-medium">
                      ${dailyEarnings.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">ROI</span>
                    <span className="font-medium">
                      {((profit / calcAmount) * 100).toFixed(2)}%
                    </span>
                  </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-3 flex items-start gap-2">
                  <Info className="w-4 h-4 text-blue-500 mt-0.5" />
                  <p className="text-xs text-gray-400">
                    This calculator provides estimates only. Actual returns may vary based on market conditions and protocol changes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}