'use client';
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface MACDChartProps {
  data: any[];
  macd: {
    macd: (number | null)[];
    signal: (number | null)[];
    histogram: (number | null)[];
  };
}

export default function MACDChart({ data, macd }: MACDChartProps) {
  const chartData = data.map((item, index) => ({
    ...item,
    macd: macd.macd[index],
    signal: macd.signal[index],
    histogram: macd.histogram[index],
  }));

  return (
    <div className="rounded-lg bg-white p-4 shadow-lg dark:bg-gray-800">
      <h3 className="mb-4 font-semibold text-lg">MACD</h3>
      <ResponsiveContainer width="100%" height={250}>
        <ComposedChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="date" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" />
          <Tooltip
            contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
            labelStyle={{ color: '#9CA3AF' }}
          />
          <Legend />
          <ReferenceLine y={0} stroke="#6B7280" />
          <Bar dataKey="histogram" fill="#10B981" name="Histogram" />
          <Line
            type="monotone"
            dataKey="macd"
            stroke="#3B82F6"
            strokeWidth={2}
            dot={false}
            name="MACD"
          />
          <Line
            type="monotone"
            dataKey="signal"
            stroke="#F59E0B"
            strokeWidth={2}
            dot={false}
            name="Signal"
          />
        </ComposedChart>
      </ResponsiveContainer>
      <div className="mt-2 text-gray-600 text-sm dark:text-gray-400">
        {macd.histogram.at(-1)! > 0 ? (
          <span className="text-green-500">Bullish Momentum</span>
        ) : (
          <span className="text-red-500">Bearish Momentum</span>
        )}
      </div>
    </div>
  );
}
