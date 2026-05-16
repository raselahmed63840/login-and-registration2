import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const TrafficPie = () => {
  const data = {
    labels: ["Direct", "Social", "Referral"],
    datasets: [{ data: [45, 25, 30], backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56"] }],
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-bold mb-2">Sales by Traffic Source</h3>
      <Pie data={data} redraw />
    </div>
  );
};

export default TrafficPie;
