require("dotenv").config();
const express = require("express");
const cors = require("cors");

require("./db");

const limiter = require("./rateLimiter");

const app = express();

app.use(cors());
app.use(express.json());
app.use(limiter);

// ROUTES
app.use("/api/chat", require("./routes/chat"));
app.use("/api/conversations", require("./routes/conversations"));
app.use("/api/sessions", require("./routes/sessions"));

app.listen(5000, () => {
  console.log("Backend running on port 5000");
});