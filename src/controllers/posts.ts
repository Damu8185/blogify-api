import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import Post from "../models/post";
import { modifiedPostsResponse, modifiedSinglePostResponse } from "../helpers";
import ApiError from "../errors";

export const createPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { post_title, description } = req.body;
    const user_id = (req.user as any)._id;

    // Validate input
    if (!description || !post_title) {
      throw new ApiError(400, "Both post title and description are required");
    }

    const newPost = new Post({
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
};

export const geAllposts = async (_req: Request, res: Response) => {
  try {
    const posts = await Post.find()
      .populate("user_id", "_id first_name last_name")
      .sort({ created_at: -1 });

    const modifiedPosts = modifiedPostsResponse(posts);
    res.json(modifiedPosts);
  } catch (err) {
    console.error("Post list error:", err);
    throw new ApiError(500, "Unable to fetch posts at the moment");
  }
};

export const getPostById = async (req: Request, res: Response) => {
  try {
    const { post_id } = req.params;
    const posts = await Post.findOne({ _id: post_id })
      .populate("user_id", "_id first_name last_name")
      .sort({ created_at: -1 });

    const modifiedPosts = modifiedSinglePostResponse(posts);
    res.json(modifiedPosts);
  } catch (err) {
    console.error("Post list error:", err);
    throw new ApiError(500, "Unable to fetch posts at the moment");
  }
};

export const getPostsByUserId = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.params;

    const posts = await Post.find({ user_id: user_id })
      .populate("user_id", "_id first_name last_name")
      .sort({ created_at: -1 });
    const modifiedPosts = modifiedPostsResponse(posts);

    res.json(modifiedPosts);
  } catch (err) {
    throw new ApiError(500, "Unable to fetch posts at the moment");
  }
};

export const updatePost = async (req: Request, res: Response) => {
  try {
    const { post_id } = req.params;
    const { post_title, description } = req.body;

    if (!post_id || !description || !post_title) {
      throw new ApiError(
        400,
        "All fields (post_id, post_title, description) are required"
      );
    }

    if (!mongoose.Types.ObjectId.isValid(post_id)) {
      throw new ApiError(400, "Invalid Post ID format");
    }

    const updatedPost = await Post.findOneAndUpdate(
      { _id: req.params.post_id },
      {
        $set: {
          post_title: req.body.post_title,
          description: req.body.description,
          updated_at: new Date(),
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
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    const { post_id } = req.params;

    if (!post_id) {
      return res.status(400).json({ message: "post_id is required" });
    }
    if (!mongoose.Types.ObjectId.isValid(post_id)) {
      throw new ApiError(400, "Invalid Post ID format");
    }
    const deletedPost = await Post.deleteOne({ _id: post_id });

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
};
