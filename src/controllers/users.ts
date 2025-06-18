import { Request, Response } from "express";
import User from "../models/user";

export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await User.find().sort({ created_at: -1 });

    res.json(users);
  } catch (err) {
    console.error("User list error:", err);
    res.status(500).json({ message: "Error retrieving users" });
  }
};

export const getUserDetails = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.params;

    const user = await User.findOne({ _id: user_id });
    res.json(user);
  } catch (err) {
    console.error("User list error:", err);
    res.status(500).json({ message: "Error retrieving user" });
  }
};
