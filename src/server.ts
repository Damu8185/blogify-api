import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/users";
import postRoutes from "./routes/posts";
import authRoutes from "./routes/auth";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.DB_CONNECTION!;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected via Mongoose");
    app.use("/api", userRoutes);
    app.use("/api", postRoutes);
    app.use("/api", authRoutes);
    app.use(errorHandler);
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
