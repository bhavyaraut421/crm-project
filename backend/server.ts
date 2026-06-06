import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "../database/db";
import leadRoutes from "./routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

// HEALTH CHECK
app.get("/", (req, res) => {
  res.json({ message: "CRM API Running 🚀" });
});

// routes
app.use("/api/leads", leadRoutes);

// START SERVER ONLY AFTER DB CONNECT
const startServer = async () => {
  try {
    await connectDB(); // IMPORTANT FIX

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });

  } catch (err) {
    console.error("Server failed to start:", err);
  }
};

startServer();