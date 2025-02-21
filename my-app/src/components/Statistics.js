// src/components/Statistics.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Statistics = ({ month }) => {
    const [statistics, setStatistics] = useState({ totalSales: 0, totalSold: 0, totalNotSold: 0 });

    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/statistics`, {
                    params: { month },
                });
                setStatistics(response.data);
            } catch (error) {
                console.error('Error fetching statistics', error);
            }
        };

        fetchStatistics();
    }, [month]);

    return (
        <div>
            <h3>Statistics for {month}</h3>
            <p>Total Sales: ${statistics.totalSales}</p>
            <p>Total Sold Items: {statistics.totalSold}</p>
            <p>Total Not Sold Items: {statistics.totalNotSold}</p>
        </div>
    );
};

export default Statistics;
