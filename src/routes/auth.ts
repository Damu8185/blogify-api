// routes/auth.ts
import express from "express";
import { signIn, signUp } from "../controllers/auth";

const authRouter = express.Router();

// Create user (Signup)
authRouter.post("/sign-up", signUp);

// Sign-in (Login)
authRouter.post("/sign-in", signIn);

export default authRouter;
