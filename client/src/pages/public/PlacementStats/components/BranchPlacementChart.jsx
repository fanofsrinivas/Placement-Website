import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const BranchPlacementChart = ({ data }) => {
  return (
    <div className="section">
      <h2>Branch Placement</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="placed" fill="#10b981" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BranchPlacementChart;