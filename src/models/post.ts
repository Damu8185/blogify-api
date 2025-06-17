// models/Post.ts
import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  post_id: { type: Number, required: true },
  post_title: { type: String, required: true },
  description: { type: String, required: true },
  user_id: { type: String, required: true, ref: "User" },
  created_at: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

postSchema.set("toJSON", {
  transform: (_doc, ret) => {
    delete ret._id;
    delete ret.__v;
  },
});

export default mongoose.model("Post", postSchema);
