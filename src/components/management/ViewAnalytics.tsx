import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { subscriptionService } from "../../services/Subscriptions";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface ViewAnalyticsProp {
  open: boolean,
  close: () => void,
  id: string
}

interface AnalyticsDataItem {
  count: number;
  countryCode: string;
  percentage: number;
}

export const ViewAnalytics: React.FC<ViewAnalyticsProp> = ({ open, close, id }) => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsDataItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !id) return;

    const getAnalyticsData = async () => {
      setLoading(true);
      try {
        const res = await subscriptionService.getAnalyticsId(id);
        if (res.success) {
          setAnalyticsData(res?.data?.data?.countryBreakdown || []);
        }
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      } finally {
        setLoading(false);
      }
    }

    getAnalyticsData();
  }, [open, id]);

  // Transform data for the chart
  const chartData = analyticsData.map((item) => ({
    name: item.countryCode,
    value: item.count,
    percentage: item.percentage
  }));

  // Define colors for the chart segments
  const COLORS = [
    '#0088FE', // Blue
    '#00C49F', // Green
    '#FFBB28', // Yellow
    '#FF8042', // Orange
    '#8884D8', // Purple
    '#82CA9D', // Light Green
    '#FFC658', // Light Orange
    '#FF7C7C', // Light Red
  ];

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold">{`Country: ${data.payload.name}`}</p>
          <p className="text-blue-600">{`Count: ${data.payload.value}`}</p>
          <p className="text-green-600">{`Percentage: ${data.payload.percentage}%`}</p>
        </div>
      );
    }
    return null;
  };

  // Custom label component for the pie chart
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize="12"
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-[700px] max-w-[95%] p-6 relative animate-fadeIn">
            {/* Close button */}
            <button
              onClick={close}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Content */}
            <h2 className="text-xl font-semibold text-[#1F54B0] mb-2">
              Country Analytics Breakdown
            </h2>

            {loading ? (
              <div className="h-[400px] flex items-center justify-center">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 border-2 border-[#1F54B0] border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-gray-600">Loading analytics...</span>
                </div>
              </div>
            ) : analyticsData.length > 0 ? (
              <div className="space-y-2">
                {/* Donut Chart */}
                <div className="h-[300px] overflow-y-auto">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={120}
                        innerRadius={60}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend
                        verticalAlign="bottom"
                        height={36}
                        formatter={(value, entry) => (
                          <span style={{ color: entry.color }}>
                            {value} ({chartData.find(item => item.name === value)?.percentage}%)
                          </span>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Data Summary Table */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-800 mb-3">Summary</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {analyticsData.map((item, index) => (
                      <div
                        key={item.countryCode}
                        className="bg-white rounded-lg p-3 border-l-4 shadow-sm"
                        style={{ borderLeftColor: COLORS[index % COLORS.length] }}
                      >
                        <div className="text-sm text-gray-600">Country</div>
                        <div className="text-lg font-bold text-gray-800">{item.countryCode}</div>
                        <div className="flex justify-between text-sm mt-1">
                          <span className="text-gray-600">Count: {item.count}</span>
                          <span className="text-gray-600">{item.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Total Count */}
                  <div className="mt-4 pt-3 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-medium">Total Redirects:</span>
                      <span className="text-xl font-bold text-[#1F54B0]">
                        {analyticsData.reduce((sum, item) => sum + item.count, 0)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-[400px] flex flex-col items-center justify-center text-gray-500">
                <div className="text-6xl mb-4">📊</div>
                <p className="text-lg">No analytics data available</p>
                <p className="text-sm mt-2">Data will appear here once there are redirects</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};