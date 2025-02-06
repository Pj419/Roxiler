// src/App.js
import React, { useState } from "react";
import TransactionTable from "./components/TransactionTable";
import Statistics from "./components/Statistics";
import BarChart from "./components/BarChart";
import PieChart from "./components/PieChart";

const App = () => {
  const [month, setMonth] = useState("March");

  const handleMonthChange = (event) => {
    setMonth(event.target.value);
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Product Transactions</h1>

      {/* Month Selection Dropdown */}
      <div style={{ marginBottom: "20px" }}>
        <label style={{ fontWeight: "bold", marginRight: "10px" }}>Select Month:</label>
        <select onChange={handleMonthChange} value={month} style={{ padding: "8px", fontSize: "16px" }}>
          {[
            "January", "February", "March", "April", "May", "June", 
            "July", "August", "September", "October", "November", "December"
          ].map((monthName) => (
            <option key={monthName} value={monthName}>
              {monthName}
            </option>
          ))}
        </select>
      </div>

      {/* Components */}
      <TransactionTable month={month} />
      <Statistics month={month} />
      <BarChart month={month} />
      <PieChart month={month} />
    </div>
  );
};

export default App;
