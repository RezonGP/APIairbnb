import { createCommentService, deleteCommentService, getCommentByRoomService, getCommentService, updateCommentService } from "../services/comment.services.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getComment = asyncHandler(async (req, res) => {
    const comments = await getCommentService();
    return res.status(200).json({
        message: "Get comment successfully",
        data: comments,
    });
});

export const createComment = asyncHandler(async (req, res) => {
    const createComment = await createCommentService(req.body, req.user);
    return res.status(201).json({
        message: "Create comment successfully",
        data: createComment,
    });
});

export const getCommentByRoom = async (req, res) => {
    const roomId = Number(req.params.maPhong);
    const commentsByRoom = await getCommentByRoomService(roomId);
    return res.status(200).json({
        message: "Get comment by room successfully",
        data: commentsByRoom,
    });
};

export const updateComment = asyncHandler(async (req, res) => {
    const commentId = Number(req.params.id);
    const updateComment = await updateCommentService(commentId, req.body, req.user);
    return res.status(200).json({
        message: "Update comment successfully",
        data: updateComment,
    });
});

export const deleteComment = asyncHandler(async (req, res) => {
    const commentId = Number(req.params.id);
    const deletedComment = await deleteCommentService(commentId, req.user);
    return res.status(200).json({
        message: "Delete comment successfully",
        data: deletedComment,
    });
});
