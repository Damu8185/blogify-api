// routes/posts.ts
import express from "express";
import { verifyToken } from "../middleware/auth";
import {
  createPost,
  deletePost,
  geAllposts,
  getPostById,
  getPostsByUserId,
  updatePost,
} from "../controllers/posts";

const postRouter = express.Router();

// Create post
postRouter.post("/create-post", verifyToken, createPost);

postRouter.get("/posts", verifyToken, geAllposts);

postRouter.get("/post/:post_id", verifyToken, getPostById);

postRouter.get("/user-posts/:user_id", verifyToken, getPostsByUserId);

postRouter.patch("/update-post/:post_id", verifyToken, updatePost);

postRouter.delete("/post/:post_id", verifyToken, deletePost);

export default postRouter;
