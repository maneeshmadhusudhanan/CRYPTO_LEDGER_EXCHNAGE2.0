import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts/lib/index.js";

const PriceChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-64 bg-gray-800 rounded-lg shadow p-4 flex items-center justify-center">
        <p className="text-gray-400">No price data available</p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 p-2 rounded-lg shadow-lg border border-gray-700">
          <p className="text-gray-400">{`Date: ${label}`}</p>
          <p className="text-white font-bold">{`Price: $${payload[0].value.toFixed(
            2
          )}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-64 bg-gray-800 rounded-lg shadow p-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="time" stroke="#9CA3AF" tick={{ fill: "#9CA3AF" }} />
          <YAxis stroke="#9CA3AF" tick={{ fill: "#9CA3AF" }} />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#3B82F6"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: "#3B82F6" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PriceChart;
