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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const AdminAnalytics: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  useEffect(() => {
    // Dummy data for now
    const dummyData = {
      projectTaskStatistics: {
        completed_tasks: 12,
        incomplete_tasks: 8,
        overdue_tasks: 3,
        total_tasks: 23,
      },
      pieData: [
        { id: 0, value: 10, label: "Global All", color: "#7E46EE" },
        { id: 1, value: 4, label: "NA", color: "#A070FE" },
        { id: 2, value: 3, label: "EMEA", color: "#B996FF" },
        { id: 3, value: 2, label: "APAC", color: "#D0BAFC" },
        { id: 4, value: 1, label: "Web", color: "#E5D8FF" },
      ],
      barData: {
        labels: ["New", "Assigned", "In Progress", "Review", "Recently"],
        datasets: [
          {
            label: "Task Count",
            data: [10, 5, 6, 1, 10],
            backgroundColor: "#C9A7D6",
            borderColor: "#C9A7D6",
            borderWidth: 1,
          },
        ],
      },
    };

    setAnalyticsData(dummyData);
  }, []);

  if (!analyticsData) {
    return <p className="text-center mt-10">Loading analytics...</p>;
  }

  const { projectTaskStatistics, pieData, barData } = analyticsData;
  const total = pieData.reduce((sum: number, item: any) => sum + item.value, 0);

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: true, max: 12 },
    },
    plugins: {
      legend: { display: false },
    },
    barThickness: 10,
    categoryPercentage: 0.5,
    barPercentage: 0.5,
  };

  return (
    <div className="p-10">
      <p className="text-[34px] text-center mb-10 text-[#1F54B0FF] font-semibold">Analytics</p>
      {/* box card */}
      <div className="grid grid-cols-4 gap-x-[30px]">
        <div className="grid grid-cols-1 border border-[#7C889633] rounded-[10px] h-[120px] shadow-md">
          <div className="px-4">
            <p className="text-[30px] font-medium text-[#2EB57D] mt-4 leading-tight">
              {projectTaskStatistics.completed_tasks}
            </p>
            <p className="font-semibold text-[14px] text-black mt-[22px]">
              Completed Tasks
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 border border-[#7C889633] rounded-[10px] h-[120px] shadow-md">
          <div className="px-4">
            <p className="text-[30px] font-medium text-[#FF6F3C] mt-4 leading-tight">
              {projectTaskStatistics.incomplete_tasks}
            </p>
            <p className="font-semibold text-[14px] text-black mt-[22px]">
              Total Purchase ID's
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 border border-[#7C889633] rounded-[10px] h-[120px] shadow-md">
          <div className="px-4">
            <p className="text-[30px] font-medium text-[#7C8896] mt-4 leading-tight">
              {projectTaskStatistics.overdue_tasks}
            </p>
            <p className="font-semibold text-[14px] text-black mt-[22px]">
              Total Mappings
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 border border-[#7C889633] rounded-[10px] h-[120px] shadow-md">
          <div className="px-4">
            <p className="text-[30px] font-medium text-[#428BC1] mt-4 leading-tight">
              {projectTaskStatistics.total_tasks}
            </p>
            <p className="font-semibold text-[14px] text-black mt-[22px]">
              Total Users
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
              Regional Request Breakdown
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

              {/* Center number */}
              {/* <div className="absolute top-1/2 left-[110px] transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
                <span className="text-30p font-semibold text-black">
                  {total}
                </span>
              </div> */}

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
              Work Process Status
            </p>
            <div className="mt-5">
              <Bar data={barData} options={barOptions} className="!h-[200px]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};