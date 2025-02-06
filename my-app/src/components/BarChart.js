import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

const data = [
  { range: "0-100", count: 10 },
  { range: "101-200", count: 25 },
  { range: "201-300", count: 18 },
  { range: "301-400", count: 12 },
  { range: "401-500", count: 8 },
  { range: "501-600", count: 5 },
  { range: "601-700", count: 3 },
  { range: "701-800", count: 2 },
  { range: "801-900", count: 1 },
  { range: "901+", count: 4 },
];

const CustomBarChart = () => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="range" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default CustomBarChart;
