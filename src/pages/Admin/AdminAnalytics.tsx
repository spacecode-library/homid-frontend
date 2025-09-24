import { PieChart } from "@mui/x-charts/PieChart";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useEffect, useState } from "react";
import { AdminHeader } from "./AdminHeader";
import { subscriptionService } from "../../services/Subscriptions";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface StatisticsData {
  totalIdSold: number;
  totalIdMapped: number;
  totalIdNotMapped: number;
  totalApprovedId: number;
  totalPendingId: number;
  totalRejectedId: number;
  totalInactiveId: number;
}

export const AdminAnalytics: React.FC = () => {
  const [statisticsData, setStatisticsData] = useState<StatisticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getStaticsData = async () => {
      try {
        const res = await subscriptionService.getIdStaticsData();
        if (res.success) {
          setStatisticsData(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching statistics data:", error);
      } finally {
        setLoading(false);
      }
    }
    getStaticsData();
  }, [])

  if (loading) {
    return (
      <>
        <AdminHeader />
        <div className="px-10">
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="ml-3 text-center">Loading analytics...</p>
          </div>
        </div>
      </>
    );
  }

  if (!statisticsData) {
    return (
      <>
        <AdminHeader />
        <div className="px-10">
          <p className="text-center mt-10">Failed to load analytics data</p>
        </div>
      </>
    );
  }

  // Dynamic pie chart data based on API response
  const pieData = [
    { id: 0, value: statisticsData.totalApprovedId, label: "Approved", color: "#2EB57D" },
    { id: 1, value: statisticsData.totalPendingId, label: "Pending", color: "#FF6F3C" },
    { id: 2, value: statisticsData.totalRejectedId, label: "Rejected", color: "#7C8896" },
    { id: 3, value: statisticsData.totalInactiveId, label: "Inactive", color: "#428BC1" },
  ];

  const total = pieData.reduce((sum: number, item: any) => sum + item.value, 0);

  // Dynamic bar chart data based on API response
  const barData = {
    labels: ["Sold", "Mapped", "Not Mapped", "Approved", "Pending", "Rejected", "Inactive"],
    datasets: [
      {
        label: "ID Count",
        data: [
          statisticsData.totalIdSold,
          statisticsData.totalIdMapped,
          statisticsData.totalIdSold - statisticsData.totalIdMapped,
          statisticsData.totalApprovedId,
          statisticsData.totalPendingId,
          statisticsData.totalRejectedId,
          statisticsData.totalInactiveId
        ],
        backgroundColor: "#C9A7D6",
        borderColor: "#C9A7D6",
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: true, max: Math.max(...barData.datasets[0].data) + 5 },
    },
    plugins: {
      legend: { display: false },
    },
    barThickness: 15,
    categoryPercentage: 0.6,
    barPercentage: 0.7,
  };

  return (
    <>
      <AdminHeader />
      <div className="px-10">
        <p className="text-[34px] text-center mb-10 text-[#1F54B0FF] font-semibold">Analytics</p>
        {/* box card */}
        <div className="grid grid-cols-4 gap-x-[30px] gap-y-3">
          <div className="grid grid-cols-1 border border-[#7C889633] rounded-[10px] h-[120px] shadow-md">
            <div className="px-4">
              <p className="text-[30px] font-medium text-[#2EB57D] mt-4 leading-tight">
                {statisticsData.totalIdSold}
              </p>
              <p className="font-semibold text-[14px] text-black mt-[22px]">
                Total Id Sold
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 border border-[#7C889633] rounded-[10px] h-[120px] shadow-md">
            <div className="px-4">
              <p className="text-[30px] font-medium text-[#FF6F3C] mt-4 leading-tight">
                {statisticsData.totalIdMapped}
              </p>
              <p className="font-semibold text-[14px] text-black mt-[22px]">
                Total Id Mapped
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 border border-[#7C889633] rounded-[10px] h-[120px] shadow-md">
            <div className="px-4">
              <p className="text-[30px] font-medium text-[#7C8896] mt-4 leading-tight">
                {statisticsData.totalIdSold - statisticsData.totalIdMapped}
              </p>
              <p className="font-semibold text-[14px] text-black mt-[22px]">
                Total Id Not Mapped
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 border border-[#7C889633] rounded-[10px] h-[120px] shadow-md">
            <div className="px-4">
              <p className="text-[30px] font-medium text-[#428BC1] mt-4 leading-tight">
                {statisticsData.totalApprovedId}
              </p>
              <p className="font-semibold text-[14px] text-black mt-[22px]">
                Total Approved Id
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 border border-[#7C889633] rounded-[10px] h-[120px] shadow-md">
            <div className="px-4">
              <p className="text-[30px] font-medium text-[#FFA500] mt-4 leading-tight">
                {statisticsData.totalPendingId}
              </p>
              <p className="font-semibold text-[14px] text-black mt-[22px]">
                Total Pending Id
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 border border-[#7C889633] rounded-[10px] h-[120px] shadow-md">
            <div className="px-4">
              <p className="text-[30px] font-medium text-[#DC143C] mt-4 leading-tight">
                {statisticsData.totalRejectedId}
              </p>
              <p className="font-semibold text-[14px] text-black mt-[22px]">
                Total Rejected Id
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 border border-[#7C889633] rounded-[10px] h-[120px] shadow-md">
            <div className="px-4">
              <p className="text-[30px] font-medium text-[#696969] mt-4 leading-tight">
                {statisticsData.totalInactiveId}
              </p>
              <p className="font-semibold text-[14px] text-black mt-[22px]">
                Total Inactive Id
              </p>
            </div>
          </div>
        </div>

        {/* graph card */}
        <div className="grid grid-cols-2 gap-x-[30px] py-[30px]">
          {/* Pie Chart */}
          <div className="grid grid-cols-1 border border-[#7C889633] rounded-[10px] h-[300px] shadow-md">
            <div className="p-6">
              <p className="font-semibold text-14p text-black">
                ID Status Distribution
              </p>
              <div className="relative mt-7">
                <PieChart
                  series={[
                    {
                      data: pieData.map((item: any) => ({
                        id: item.id,
                        value: item.value,
                        label: item.label,
                        color: item.color,
                      })),
                      innerRadius: 50,
                      outerRadius: 80,
                      cornerRadius: 0,
                      highlightScope: { fade: "global", highlight: "item" },
                    },
                  ]}
                  width={194}
                  height={194}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    paddingLeft: "16px",
                    paddingRight: "10%",
                  }}
                  slotProps={{
                    legend: {
                      position: {
                        vertical: "middle",
                        horizontal: "end",
                      },
                    },
                  }}
                />

                <div className="absolute top-1/2 left-[73%] transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
                  <span className="text-[30px] font-semibold text-black">
                    {total}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="grid grid-cols-1 border border-[#7C889633] rounded-[10px] h-[300px] shadow-md">
            <div className="p-6">
              <p className="font-semibold text-14p text-black">
                ID Statistics Overview
              </p>
              <div className="mt-5">
                <Bar data={barData} options={barOptions} className="!h-[200px]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};