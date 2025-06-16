// routes/auth.ts
import express, { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user";
import { generateUserId } from "../helpers";
import ApiError from "../errors/index";

const authRouter = express.Router();

interface AuthRequestBody {
  first_name?: string;
  last_name?: string;
  email_id: string;
  password: string;
}

// Create user (Signup)
authRouter.post(
  "/sign-up",
  async (
    req: Request<{}, {}, AuthRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { first_name, last_name, email_id, password } = req.body;

      // Validate input
      if (!first_name || !last_name || !email_id || !password) {
        throw new ApiError(
          400,
          "All fields (first_name, last_name, email_id, password) are required."
        );
      }

      const existingUser = await User.findOne({ email_id });
      if (existingUser) {
        throw new ApiError(
          409,
          "Email already registered. Please log in or use a different email."
        );
      }

      if (!/^(?=.*[a-z])(?=.*[A-Z]).{10,}$/.test(password)) {
        throw new ApiError(
          400,
          "Password must be at least 10 characters long and contain at least one uppercase and one lowercase letter."
        );
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        user_id: generateUserId(),
        first_name,
        last_name,
        email_id,
        password: hashedPassword,
      });

      await newUser.save();
      res.status(201).json({
        success: true,
        message: "Account created successfully. You can now sign in.",
      });
    } catch (error: any) {
      if (error.name === "ValidationError") {
        //  return next(new ApiError(400, 'Validation failed', error.message));
      }
      next(error);
    }
  }
);

// Sign-in (Login)
authRouter.post(
  "/sign-in",
  async (
    req: Request<{}, {}, AuthRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email_id, password } = req.body;

      if (!email_id || !password) {
        throw new ApiError(400, "Both email_id and password are required.");
      }

      const user = await User.findOne({ email_id });
      if (!user) {
        throw new ApiError(401, "Invalid email or password.");
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new ApiError(401, "Invalid email or password.");
      }

      const token = jwt.sign(
        { user_id: user._id, email: user.email_id },
        process.env.JWT_SECRET!,
        { expiresIn: "1h" }
      );

      res.status(200).json({
        success: true,
        message: "Login successful.",
        token,
        user_id: user.user_id,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default authRouter;
