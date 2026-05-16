import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const SalesChart = () => {
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      { label: "Sales", data: [500, 700, 800, 650, 900, 980], borderColor: "blue", fill: false },
      { label: "Earnings", data: [400, 600, 700, 500, 800, 700], borderColor: "green", fill: false },
    ],
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-bold mb-2">Sales & Earnings</h3>
      <Line data={data} redraw />
    </div>
  );
};

export default SalesChart;
