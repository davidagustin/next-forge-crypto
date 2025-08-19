'use client';

import {
  Bell,
  BellOff,
  BellRing,
  Plus,
  Trash2,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

interface Alert {
  id: string;
  coin: string;
  symbol: string;
  condition: 'above' | 'below';
  price: number;
  active: boolean;
  triggered: boolean;
  createdAt: string;
  triggeredAt?: string;
  currentPrice?: number;
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    coin: 'Bitcoin',
    symbol: 'BTC',
    condition: 'above' as 'above' | 'below',
    price: 0,
  });

  // Load alerts from localStorage
  useEffect(() => {
    const savedAlerts = localStorage.getItem('priceAlerts');
    if (savedAlerts) {
      setAlerts(JSON.parse(savedAlerts));
    }
  }, []);

  // Save alerts to localStorage
  useEffect(() => {
    localStorage.setItem('priceAlerts', JSON.stringify(alerts));
  }, [alerts]);

  // Check alerts periodically
  useEffect(() => {
    const checkAlerts = () => {
      // Mock current prices
      const currentPrices: Record<string, number> = {
        BTC: 68750,
        ETH: 3500,
        BNB: 600,
        SOL: 200,
        XRP: 0.75,
        ADA: 0.7,
        DOT: 10.5,
        AVAX: 55,
        LINK: 20,
        MATIC: 1.2,
      };

      const updatedAlerts = alerts.map((alert) => {
        if (!alert.active || alert.triggered) {
          return alert;
        }

        const currentPrice = currentPrices[alert.symbol] || 0;
        const isTriggered =
          alert.condition === 'above'
            ? currentPrice >= alert.price
            : currentPrice <= alert.price;

        if (isTriggered && !alert.triggered) {
          toast.custom(
            (t) => (
              <div
                className={`${t.visible ? 'animate-enter' : 'animate-leave'} rounded-lg border border-gray-700 bg-gray-900 p-4 shadow-lg`}
              >
                <div className="flex items-start gap-3">
                  <BellRing className="mt-1 h-5 w-5 text-yellow-500" />
                  <div>
                    <p className="font-medium text-white">
                      Price Alert Triggered!
                    </p>
                    <p className="mt-1 text-gray-300 text-sm">
                      {alert.coin} is now {alert.condition} ${alert.price}
                    </p>
                    <p className="mt-1 text-gray-400 text-xs">
                      Current price: ${currentPrice}
                    </p>
                  </div>
                </div>
              </div>
            ),
            { duration: 5000 }
          );

          return {
            ...alert,
            triggered: true,
            triggeredAt: new Date().toISOString(),
            currentPrice,
          };
        }

        return { ...alert, currentPrice };
      });

      setAlerts(updatedAlerts);
    };

    const interval = setInterval(checkAlerts, 10000); // Check every 10 seconds
    checkAlerts(); // Initial check

    return () => clearInterval(interval);
  }, [alerts]);

  const handleAddAlert = () => {
    if (formData.price <= 0) {
      toast.error('Please enter a valid price');
      return;
    }

    const newAlert: Alert = {
      id: Date.now().toString(),
      ...formData,
      active: true,
      triggered: false,
      createdAt: new Date().toISOString(),
    };

    setAlerts([...alerts, newAlert]);
    toast.success('Alert created successfully');
    setShowAddModal(false);
    setFormData({ ...formData, price: 0 });
  };

  const toggleAlert = (id: string) => {
    setAlerts(
      alerts.map((alert) =>
        alert.id === id ? { ...alert, active: !alert.active } : alert
      )
    );
  };

  const deleteAlert = (id: string) => {
    setAlerts(alerts.filter((alert) => alert.id !== id));
    toast.success('Alert deleted');
  };

  const POPULAR_COINS = [
    { symbol: 'BTC', name: 'Bitcoin' },
    { symbol: 'ETH', name: 'Ethereum' },
    { symbol: 'BNB', name: 'BNB' },
    { symbol: 'SOL', name: 'Solana' },
    { symbol: 'XRP', name: 'Ripple' },
    { symbol: 'ADA', name: 'Cardano' },
    { symbol: 'AVAX', name: 'Avalanche' },
    { symbol: 'DOT', name: 'Polkadot' },
    { symbol: 'MATIC', name: 'Polygon' },
    { symbol: 'LINK', name: 'Chainlink' },
  ];

  return (
    <div className="min-h-screen bg-black p-4 text-white">
      <Toaster position="top-right" />

      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <h1 className="flex items-center gap-2 font-bold text-3xl">
              <Bell className="h-8 w-8 text-yellow-500" />
              Price Alerts
            </h1>
            <p className="mt-1 text-gray-400">
              Get notified when prices reach your targets
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 rounded-lg bg-yellow-600 px-4 py-2 transition-colors hover:bg-yellow-700"
          >
            <Plus className="h-5 w-5" />
            Create Alert
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-gray-800 bg-gray-900 p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-gray-400 text-sm">Active Alerts</span>
              <BellRing className="h-4 w-4 text-green-500" />
            </div>
            <div className="font-bold text-2xl">
              {alerts.filter((a) => a.active && !a.triggered).length}
            </div>
          </div>

          <div className="rounded-lg border border-gray-800 bg-gray-900 p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-gray-400 text-sm">Triggered Today</span>
              <Bell className="h-4 w-4 text-yellow-500" />
            </div>
            <div className="font-bold text-2xl">
              {
                alerts.filter((a) => {
                  if (!a.triggeredAt) {
                    return false;
                  }
                  const today = new Date().toDateString();
                  return new Date(a.triggeredAt).toDateString() === today;
                }).length
              }
            </div>
          </div>

          <div className="rounded-lg border border-gray-800 bg-gray-900 p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-gray-400 text-sm">Total Alerts</span>
              <Bell className="h-4 w-4 text-blue-500" />
            </div>
            <div className="font-bold text-2xl">{alerts.length}</div>
          </div>
        </div>

        {/* Alerts List */}
        <div className="rounded-lg border border-gray-800 bg-gray-900">
          <div className="border-gray-800 border-b p-4">
            <h2 className="font-semibold text-xl">Your Alerts</h2>
          </div>

          {alerts.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <Bell className="mx-auto mb-4 h-12 w-12 opacity-50" />
              <p>
                No alerts yet. Create your first price alert to get started.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-800">
              {alerts
                .sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                )
                .map((alert) => (
                  <div
                    key={alert.id}
                    className="p-4 transition-colors hover:bg-gray-800/50"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => toggleAlert(alert.id)}
                          className={`rounded-lg p-2 transition-colors ${
                            alert.active && !alert.triggered
                              ? 'bg-green-900/50 text-green-400 hover:bg-green-900'
                              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                          }`}
                        >
                          {alert.active && !alert.triggered ? (
                            <Bell className="h-5 w-5" />
                          ) : (
                            <BellOff className="h-5 w-5" />
                          )}
                        </button>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{alert.coin}</span>
                            <span className="text-gray-400 text-sm">
                              ({alert.symbol})
                            </span>
                            {alert.triggered && (
                              <span className="rounded bg-yellow-900/50 px-2 py-0.5 text-xs text-yellow-400">
                                Triggered
                              </span>
                            )}
                          </div>
                          <div className="mt-1 flex items-center gap-2">
                            {alert.condition === 'above' ? (
                              <TrendingUp className="h-4 w-4 text-green-500" />
                            ) : (
                              <TrendingDown className="h-4 w-4 text-red-500" />
                            )}
                            <span className="text-gray-400 text-sm">
                              Alert when price goes {alert.condition} $
                              {alert.price}
                            </span>
                          </div>
                          {alert.currentPrice && (
                            <div className="mt-1 text-gray-500 text-xs">
                              Current price: ${alert.currentPrice}
                            </div>
                          )}
                          {alert.triggeredAt && (
                            <div className="mt-1 text-gray-500 text-xs">
                              Triggered:{' '}
                              {new Date(alert.triggeredAt).toLocaleString()}
                            </div>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => deleteAlert(alert.id)}
                        className="rounded-lg p-2 text-red-500 transition-colors hover:bg-gray-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Alert Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-gray-900 p-6">
            <h3 className="mb-4 font-semibold text-xl">Create Price Alert</h3>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block font-medium text-sm">
                  Cryptocurrency
                </label>
                <select
                  value={formData.symbol}
                  onChange={(e) => {
                    const coin = POPULAR_COINS.find(
                      (c) => c.symbol === e.target.value
                    );
                    if (coin) {
                      setFormData({
                        ...formData,
                        symbol: coin.symbol,
                        coin: coin.name,
                      });
                    }
                  }}
                  className="w-full rounded-lg bg-gray-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  {POPULAR_COINS.map((coin) => (
                    <option key={coin.symbol} value={coin.symbol}>
                      {coin.name} ({coin.symbol})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block font-medium text-sm">
                  Condition
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, condition: 'above' })
                    }
                    className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 ${
                      formData.condition === 'above'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    <TrendingUp className="h-4 w-4" />
                    Above
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, condition: 'below' })
                    }
                    className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 ${
                      formData.condition === 'below'
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    <TrendingDown className="h-4 w-4" />
                    Below
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-2 block font-medium text-sm">
                  Target Price ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price: Number.parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full rounded-lg bg-gray-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 rounded-lg bg-gray-800 py-2 transition-colors hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleAddAlert}
                className="flex-1 rounded-lg bg-yellow-600 py-2 transition-colors hover:bg-yellow-700"
              >
                Create Alert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
