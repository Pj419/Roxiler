const express = require("express");
const pool = require("../config/db");

const router = express.Router();

const executeQuery = (query, values) => {
    return new Promise((resolve, reject) => {
      pool.query(query, values, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  };

// Get transactions with search & pagination
router.get("/transactions", async (req, res) => {
    try {
      const { page = 1, perPage = 10, search = "", month } = req.query;
      const offset = (page - 1) * perPage;
  
      const query = `
          SELECT * FROM transactions 
          WHERE MONTH(date_of_sale) = MONTH(STR_TO_DATE(?, '%M'))
          AND (title LIKE ? OR description LIKE ? OR price LIKE ?)
          LIMIT ?, ?`;
  
      // Execute the query using the promise-based function
      const result = await executeQuery(query, [month, `%${search}%`, `%${search}%`, `%${search}%`, offset, parseInt(perPage)]);
      
      console.log(result); // Debugging: Check MySQL response
      
      // Sending back the result to the client
      res.json(result); // No need to extract rows as result is already the desired data
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ error: "Error fetching transactions from database" });
    }
  });



// Fetch statistics (total sales, sold & unsold items)
router.get("/statistics", async (req, res) => {
    try {
      const { month } = req.query;
  
      const query = `
          SELECT *
          FROM transactions`;
  
      // Execute the query using the promise-based function
      const result = await executeQuery(query, [month]);
  
      // Assuming you want the first row of the result
      const stats = result;
  
      res.json(stats); // Send the statistics as the response
    } catch (error) {
      console.error("Error fetching statistics:", error);
      res.status(500).json({ error: "Error fetching statistics from database" });
    }
  });

// Fetch bar chart data (price ranges)
router.get("/barchart", async (req, res) => {
    try {
        const { month } = req.query;
        const priceRanges = [
            { range: "0-100", min: 0, max: 100 },
            { range: "101-200", min: 101, max: 200 },
            { range: "201-300", min: 201, max: 300 },
            { range: "301-400", min: 301, max: 400 },
            { range: "401-500", min: 401, max: 500 },
            { range: "501-600", min: 501, max: 600 },
            { range: "601-700", min: 601, max: 700 },
            { range: "701-800", min: 701, max: 800 },
            { range: "801-900", min: 801, max: 900 },
            { range: "901+", min: 901, max: 10000 }
        ];
        const result = {};
        for (const { range, min, max } of priceRanges) {
            const [count] = await pool.query(
                `SELECT COUNT(*) AS count FROM transactions 
                 WHERE price BETWEEN ? AND ? 
                 AND MONTH(date_of_sale) = MONTH(STR_TO_DATE(?, '%M'))`,
                [min, max, month]
            );
            result[range] = count[0].count;
        }
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error fetching bar chart data from database" });
    }
});

// Fetch pie chart data (categories)
router.get("/piechart", async (req, res) => {
    try {
        const { month } = req.query;
        const query = `
            SELECT category, COUNT(*) AS count 
            FROM transactions 
            WHERE MONTH(date_of_sale) = MONTH(STR_TO_DATE(?, '%M')) 
            GROUP BY category`;
        const [categories] = await pool.query(query, [month]);
        res.json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error fetching pie chart data from database" });
    }
});

// Fetch combined data (transactions, statistics, pie chart)
router.get("/combined", async (req, res) => {
    try {
        const { month } = req.query;
        const [transactions, statistics, piechart] = await Promise.all([
            pool.query(`SELECT * FROM transactions WHERE MONTH(date_of_sale) = MONTH(STR_TO_DATE(?, '%M'))`, [month]),
            pool.query(`
                SELECT SUM(price) AS totalSales, 
                       COUNT(CASE WHEN sold = TRUE THEN 1 END) AS totalSold,
                       COUNT(CASE WHEN sold = FALSE THEN 1 END) AS totalNotSold
                FROM transactions
                WHERE MONTH(date_of_sale) = MONTH(STR_TO_DATE(?, '%M'))`, [month]),
            pool.query(`
                SELECT category, COUNT(*) AS count 
                FROM transactions 
                WHERE MONTH(date_of_sale) = MONTH(STR_TO_DATE(?, '%M')) 
                GROUP BY category`, [month])
        ]);
        res.json({ 
            transactions: transactions[0], 
            statistics: statistics[0][0], 
            piechart: piechart[0] 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error fetching combined data from database" });
    }
});

module.exports = router;
