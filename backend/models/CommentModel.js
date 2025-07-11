import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  user: { type: String, default: "Anonymous" },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const commentModel = mongoose.models.comment || mongoose.model("comment", commentSchema);

export default commentModel;