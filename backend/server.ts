import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "../database/db";
import leadRoutes from "./routes.ts";

dotenv.config();

const app = express();

// Render provides PORT automatically
const PORT = process.env.PORT || 3000;

// Frontend URL
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

app.use(
  cors({
    origin: CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

// Health Check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "CRM Backend Running 🚀",
  });
});

// DEBUG ROUTE
app.get("/debug-chatgpt", (req, res) => {
  res.json({
    success: true,
    version: "new-code",
    routesLoaded: true,
  });
});

// Lead Routes
app.use("/api/leads", leadRoutes);

// Start Server
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Server failed to start:", err);
    process.exit(1);
  }
};

startServer();