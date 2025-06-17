// routes/posts.ts
import express, { Request, Response } from "express";
import Post from "../models/post";
import { verifyToken } from "../middleware/auth";
import { generate4DigitId } from "../helpers";
import { modifiedPostsResponse } from "./utils";
import ApiError from "../errors";

const postRouter = express.Router();

// Create post
postRouter.post(
  "/create-post",
  verifyToken,
  async (req: Request, res: Response, next) => {
    try {
      const { post_title, description } = req.body;
      const user_id = (req.user as any).user_id;

      // Validate input
      if (!description || !post_title) {
        throw new ApiError(400, "Both post title and description are required");
      }

      const newPost = new Post({
        post_id: generate4DigitId(),
        user_id,
        post_title,
        description,
      });

      await newPost.save();
      res
        .status(201)
        .json({ success: true, message: "Post created successfully" });
    } catch (error) {
      next(error);
    }
  }
);

postRouter.get("/posts", verifyToken, async (_req: Request, res: Response) => {
  try {
    const posts = await Post.find()
      .populate("user_id", "user_id first_name last_name -_id")
      .sort({ created_at: -1 });

    const modifiedPosts = modifiedPostsResponse(posts);
    res.json(modifiedPosts);
  } catch (err) {
    console.error("Post list error:", err);
    throw new ApiError(500, "Unable to fetch posts at the moment");
  }
});

postRouter.get(
  "/user-posts",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const user_id = (req.user as any).user_id;

      const posts = await Post.find({ user_id })
        .populate("user_id", "user_id first_name last_name -_id")
        .sort({ created_at: -1 });
      const modifiedPosts = modifiedPostsResponse(posts);

      res.json(modifiedPosts);
    } catch (err) {
      throw new ApiError(500, "Unable to fetch posts at the moment");
    }
  }
);

postRouter.patch(
  "/update-post/:post_id",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const { post_id } = req.params;
      const { post_title, description } = req.body;

      if (!post_id || !description || !post_title) {
        throw new ApiError(
          400,
          "All fields (post_id, post_title, description, password) are required"
        );
      }

      const updatedPost = await Post.findOneAndUpdate(
        { post_id: req.params.post_id },
        {
          $set: {
            post_title: req.body.post_title,
            description: req.body.description,
            updated_date: new Date(),
          },
        }
      );

      if (!updatedPost) {
        throw new ApiError(404, "Post not found");
      }

      res
        .status(200)
        .json({ success: true, message: "Post updated successfully" });
    } catch (err: unknown) {
      const error = err as { statusCode?: number; message?: string };
      return res.status(error.statusCode || 500).json({
        success: false,
        message:
          error.message || "Unable to update post. Please try again later.",
      });
    }
  }
);

postRouter.delete(
  "/post/:post_id",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const { post_id } = req.params;

      if (!post_id) {
        return res.status(400).json({ message: "post_id is required" });
      }

      const deletedPost = await Post.deleteOne({ post_id });

      if (deletedPost.deletedCount === 0) {
        throw new ApiError(404, "Post not found");
      }
      res
        .status(200)
        .json({ success: true, message: "Post deleted successfully" });
    } catch (err: unknown) {
      const error = err as { statusCode?: number; message?: string };

      return res.status(error.statusCode || 500).json({
        success: false,
        message:
          error.message || "Unable to delete post. Please try again later.",
      });
    }
  }
);

export default postRouter;
