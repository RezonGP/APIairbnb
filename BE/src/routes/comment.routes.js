import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { createComment, deleteComment, getComment, getCommentByRoom, updateComment } from "../controllers/comment.controller.js";
const commentRouter = express.Router();

commentRouter.get("/", getComment);
commentRouter.post("/", protect, createComment);
commentRouter.get("/lay-binh-luan-theo-phong/:maPhong", getCommentByRoom);
commentRouter.put("/:id", protect, updateComment);
commentRouter.delete("/:id", protect, deleteComment);
export default commentRouter;
