import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Select, MenuItem, TextField, Button, Typography
} from "@mui/material";

const TransactionTable = () => {
    const [transactions, setTransactions] = useState([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [month, setMonth] = useState("March");

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:5000/api/transactions?month=${month}&page=${page}&perPage=10&search=${search}`
                );
                setTransactions(response.data);
            } catch (error) {
                console.error("Error fetching transactions", error);
            }
        };
        fetchTransactions();
    }, [search, page, month]);

    return (
        <Paper sx={{ padding: 3 }}>
            <Typography variant="h5" gutterBottom>
                Transactions Table
            </Typography>
            
            <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                <Select value={month} onChange={(e) => setMonth(e.target.value)}>
                    {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((m) => (
                        <MenuItem key={m} value={m}>{m}</MenuItem>
                    ))}
                </Select>
                <TextField
                    label="Search"
                    variant="outlined"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by title, description, or price"
                />
            </div>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Sold</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Date of Sale</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {transactions.map((transaction) => (
                            <TableRow key={transaction.id}>
                                <TableCell>{transaction.title}</TableCell>
                                <TableCell>{transaction.description}</TableCell>
                                <TableCell>${transaction.price}</TableCell>
                                <TableCell>{transaction.sold ? "Yes" : "No"}</TableCell>
                                <TableCell>{transaction.category}</TableCell>
                                <TableCell>{new Date(transaction.dateOfSale).toLocaleDateString()}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
                <Button variant="contained" onClick={() => setPage(page - 1)} disabled={page === 1}>
                    Previous
                </Button>
                <Typography variant="body1" style={{ margin: "0 10px" }}>Page {page}</Typography>
                <Button variant="contained" onClick={() => setPage(page + 1)}>
                    Next
                </Button>
            </div>
        </Paper>
    );
};

export default TransactionTable;
