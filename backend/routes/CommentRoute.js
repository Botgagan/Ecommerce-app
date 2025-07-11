import express from "express";
import { addComment, getComments } from "../controllers/CommentController.js";
import authUser from "../middleware/auth.js";

const commentRouter = express.Router();

commentRouter.post("/add",authUser, addComment);
commentRouter.get("/:productId", getComments);

export default commentRouter;