// routes/users.ts
import express, { Request, Response } from "express";
import User from "../models/user";
import { verifyToken } from "../middleware/auth";

const userRouter = express.Router();

// Get all users (protected)
userRouter.get("/users", verifyToken, async (_req: Request, res: Response) => {
  try {
    const users = await User.find().sort({ created_at: -1 });
    res.json(users);
  } catch (err) {
    console.error("User list error:", err);
    res.status(500).json({ message: "Error retrieving users" });
  }
});

userRouter.get("/user", verifyToken, async (req: Request, res: Response) => {
  try {
    const user_id = (req.user as any).user_id;

    const user = await User.findOne({ _id: user_id });
    res.json(user);
  } catch (err) {
    console.error("User list error:", err);
    res.status(500).json({ message: "Error retrieving user" });
  }
});

export default userRouter;
