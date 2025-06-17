// models/User.ts
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email_id: {
    type: String,
    required: true,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address."],
  },
  password: { type: String, required: true },
  created_at: {
    type: Date,
    default: Date.now,
    immutable: true, // prevents further modification
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

userSchema.set("toJSON", {
  transform: (_doc, ret) => {
    delete ret._id;
    delete ret.__v;
    delete ret.password; // optionally hide password too
  },
});

export default mongoose.model("User", userSchema);
