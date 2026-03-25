import dotenv from "dotenv";
dotenv.config(); // 🔥 MUST BE FIRST

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authroutes.js";
import startupRoutes from "./routes/startuproutes.js";
import investmentRoutes from "./routes/investroutes.js";
import adminRoutes from "./routes/adminroutes.js";
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/startups", startupRoutes);
app.use("/api/invest", investmentRoutes);
app.use("/api/admin",adminRoutes);
app.get("/", (req, res) => {
  res.send("Investment Platform API Running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});