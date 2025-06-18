// routes/users.ts
import express from "express";
import { verifyToken } from "../middleware/auth";
import { getAllUsers, getUserDetails } from "../controllers/users";

const userRouter = express.Router();

// Get all users (protected)
userRouter.get("/users", verifyToken, getAllUsers);

userRouter.get("/user/:user_id", verifyToken, getUserDetails);

export default userRouter;
