const express = require("express");
const cors = require("cors");
const transactions = require("./routes/transactions");
const initialize = require("./routes/initialize");
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api",initialize);

app.use("/api", transactions);

app.listen(5000, () => console.log("Server running on port 5000"));
