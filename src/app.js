const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const fieldsRoutes = require("./routes/fields");
const riskRoutes = require("./routes/risk");
const diagnosisRoutes = require("./routes/diagnosis");
const officerRoutes = require("./routes/officer");
const advisoryRoutes = require("./routes/advisory");
const alertsRoutes = require("./routes/alerts");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/fields", fieldsRoutes);
app.use("/api/risk", riskRoutes);
app.use("/api/diagnosis", diagnosisRoutes);
app.use("/api/officer", officerRoutes);
app.use("/api/advisory", advisoryRoutes);
app.use("/api/alerts", alertsRoutes);

app.use((req, res) => res.status(404).json({ error: "Not found" }));

// basic error handler so a thrown error doesn't crash the demo mid-hackathon
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

module.exports = app;