const express = require("express");
const axios = require("axios");
const pool = require("../config/db"); // MySQL Connection

const router = express.Router();
const API_URL = "https://s3.amazonaws.com/roxiler.com/product_transaction.json";

// Seed the database
router.get("/initialize", async (req, res) => {
    try {
        const response = await axios.get(API_URL);
        const transactions = response.data;

        // Clear existing data
        await pool.query("DELETE FROM transactions");

        // Insert new data
        for (const txn of transactions) {
            await pool.query(
                "INSERT INTO transactions (title, description, price, category, sold, date_of_sale) VALUES (?, ?, ?, ?, ?, ?)",
                [txn.title, txn.description, txn.price, txn.category, txn.sold, txn.dateOfSale]
            );
        }

        res.json({ message: "Database initialized successfully with API data" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to initialize database" });
    }
});

module.exports = router;
