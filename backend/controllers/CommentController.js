import commentModel from "../models/CommentModel.js";

// Add new comment (uses req.user.name from authUser middleware)
const addComment = async (req, res) => {
  try {
    const { productId, text } = req.body;

    if (!productId || !text) {
      return res.json({ success: false, message: "Missing productId or comment text" });
    }

    const newComment = new commentModel({
      productId,
      user: req.user.name, // ✅ Automatically added
      text
    });

    const comment = await newComment.save();
    res.json({ success: true, message: "Comment added", comment });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Get comments for a product
const getComments = async (req, res) => {
  try {
    const { productId } = req.params;
    const comments = await commentModel.find({ productId }).sort({ timestamp: -1 });
    res.json({ success: true, comments });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { addComment, getComments };