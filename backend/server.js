import dotenv from "dotenv";
dotenv.config(); // 🔥 MUST BE FIRST

import express from "express";
import cors from "cors";
import http from "http";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authroutes.js";
import startupRoutes from "./routes/startuproutes.js";
import investmentRoutes from "./routes/investroutes.js";
import adminRoutes from "./routes/adminroutes.js";
import { initSocket } from "./socket.js";

connectDB();

const app = express();
const server = http.createServer(app);

// Initialize socket.io
initSocket(server);

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

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
// trigger restart
