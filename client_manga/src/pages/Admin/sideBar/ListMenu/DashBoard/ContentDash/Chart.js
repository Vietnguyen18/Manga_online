import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip,
} from "chart.js";
import "../dashboard.scss";
import { ListUsersNew, ViewsManga } from "../../../../../../services/api";

ChartJS.register(
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip
);

const Chart = () => {
  const [isUser, setIsUser] = useState([]);
  const [isViews, setIsViews] = useState([]);

  useEffect(() => {
    fetchUsersNew();
    fetchViewManga();
  }, []);

  // API for new users
  const fetchUsersNew = async () => {
    const req = await ListUsersNew();
    setIsUser(req.data);
  };

  // API for views
  const fetchViewManga = async () => {
    const req = await ViewsManga();
    setIsViews(req.data);
  };

  const processUserData = () => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const data2023 = Array(12).fill(0);
    const data2024 = Array(12).fill(0);

    // Populate data
    isUser.forEach((item) => {
      const monthIndex = months.indexOf(item.month);
      if (item.year === 2023) {
        data2023[monthIndex] = item.user_count;
      } else if (item.year === 2024) {
        data2024[monthIndex] = item.user_count;
      }
    });

    return { data2023, data2024, months };
  };
  const { data2023, data2024, months } = processUserData();

  // Data for the Line Chart
  const lineChartData = {
    labels: months,
    datasets: [
      {
        label: "2024",
        data: data2024,
        borderColor: "#556ee6",
        backgroundColor: "rgba(85, 110, 230, 0.2)",
        fill: true,
        tension: 0.4,
        hitRadius: 10,
      },
      {
        label: "2023",
        data: data2023,
        borderColor: "#f8f9fa",
        backgroundColor: "rgba(248, 249, 250, 0.2)",
        fill: true,
        tension: 0.4,
        hitRadius: 10,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#fff",
        },
      },
    },
    interaction: {
      mode: "nearest",
      intersect: false,
    },
    scales: {
      x: {
        ticks: { color: "#fff" },
        grid: { display: false },
      },
      y: {
        ticks: { color: "#fff" },
        grid: { color: "rgba(255,255,255,0.1)" },
      },
    },
  };

  // data bar views

  const processViewData = () => {
    const viewsWeek = [];
    const viewsYear = [];

    // Populate the views data
    isViews.forEach((item) => {
      viewsWeek.push(item.views_week);
      viewsYear.push(item.views_year);
    });

    return { viewsWeek, viewsYear };
  };

  const { viewsWeek, viewsYear } = processViewData();

  // Data for the Bar Chart
  const barChartData = {
    labels: months.slice(0, 10),
    datasets: [
      {
        label: "Views per Week",
        data: viewsWeek,
        backgroundColor: "#f46a6a",
        hitRadius: 10,
      },
      {
        label: "Views per Year",
        data: viewsYear,
        backgroundColor: "#556ee6",
        hitRadius: 10,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
    interaction: {
      mode: "nearest",
      intersect: false,
    },
    scales: {
      x: {
        ticks: { color: "#333" },
        grid: { display: false },
      },
      y: {
        ticks: { color: "#333" },
        grid: { color: "rgba(0,0,0,0.1)" },
      },
    },
  };

  return (
    <div className="dashboard-charts">
      {/* Line Chart */}
      <div className="card-line-chart">
        <div className="header">
          <h6>Overview</h6>
          <h2>Number of new users</h2>
        </div>
        <div className="chart-container">
          <Line data={lineChartData} options={lineChartOptions} />
        </div>
      </div>

      {/* Bar Chart */}
      <div className="card-bar-chart">
        <div className="header">
          <h6>Parameter</h6>
          <h2>Total Views</h2>
        </div>
        <div className="chart-container">
          <Bar data={barChartData} options={barChartOptions} />
        </div>
      </div>
    </div>
  );
};

export default Chart;
