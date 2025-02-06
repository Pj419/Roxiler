// src/components/PieChart.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A569BD", "#E74C3C"];

const CustomPieChart = ({ month }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPieChartData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get("http://localhost:5000/api/piechart", {
          params: { month },
        });

        // Transform API response into Recharts format
        const formattedData = Object.keys(response.data).map((key, index) => ({
          name: key,
          value: response.data[key],
          color: COLORS[index % COLORS.length], // Assign colors dynamically
        }));

        setData(formattedData);
      } catch (error) {
        setError("Failed to fetch pie chart data.");
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPieChartData();
  }, [month]);

  if (loading) return <p>Loading Pie Chart...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ width: "100%", height: 300 }}>
      <h3>Items by Category</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomPieChart;
