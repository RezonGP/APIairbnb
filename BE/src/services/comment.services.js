import prisma from "../config/prisma.js";
import { AppError } from "../utils/AppError.js";

export const getCommentService = async () => {
    const comments = await prisma.binhLuan.findMany(
        {
            select: {
                id: true,
                maPhong: true,
                maNguoiBinhLuan: true,
                ngayBinhLuan: true,
                noiDung: true,
                saoBinhLuan: true,
                createdAt: true,
                updatedAt: true,
                nguoiDung: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                    }
                },
                phong: {
                    select: {
                        id: true,
                        tenPhong: true,
                    }
                }
            },
            orderBy: {
                id: "desc",
            }
        }
    );
    return comments;
}
export const createCommentService = async (payload, currentUser) => {
    if (!currentUser || !currentUser.id) {
        throw new AppError(401, "Bạn cần đăng nhập để bình luận");
    }
    const { maPhong, noiDung, saoBinhLuan } = payload;
    const userId = currentUser.id;
    if (!maPhong || !noiDung || saoBinhLuan === undefined) {
        throw new AppError(400, "Vui lòng nhập đầy đủ thông tin");
    }
    const roomId = Number(maPhong);
    const rating = Number(saoBinhLuan);
    if (!Number.isInteger(roomId) || !Number.isInteger(rating)) {
        throw new AppError(400, "Vui lòng nhập số nguyên");
    }
    if (roomId <= 0) {
        throw new AppError(400, "Sai mã phòng không hợp lệ");
    }
    if (rating <= 0 || rating > 5) {
        throw new AppError(400, "Vui lòng nhập số từ 1 đến 5");
    }
    const existingRoom = await prisma.phong.findUnique({
        where: {
            id: roomId,
        }
    })
    if (!existingRoom) {
        throw new AppError(404, "Phòng không tồn tại");
    }
    const newComment = await prisma.binhLuan.create({
        data: {
            maPhong: roomId,
            maNguoiBinhLuan: userId,
            ngayBinhLuan: new Date(),
            noiDung,
            saoBinhLuan: rating,
        },
        select: {
            id: true,
            maPhong: true,
            maNguoiBinhLuan: true,
            ngayBinhLuan: true,
            noiDung: true,
            saoBinhLuan: true,
            createdAt: true,
        }
    })
    return newComment;
}
export const getCommentByRoomService = async (roomId) => {
    if (!Number.isInteger(roomId) || roomId <= 0) {
        throw new AppError(400, "Sai mã phòng không hợp lệ");
    }
    const existingRoom = await prisma.phong.findUnique({
        where: {
            id: roomId,
        }
    })
    if (!existingRoom) {
        throw new AppError(404, "Phòng không tồn tại");
    }
    const commentsByRoom = await prisma.binhLuan.findMany({
        where: {
            maPhong: roomId,
        },
        select: {
            id: true,
            maPhong: true,
            maNguoiBinhLuan: true,
            ngayBinhLuan: true,
            noiDung: true,
            saoBinhLuan: true,
            createdAt: true,
            nguoiDung: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                }
            },
        },
        orderBy: {
            id: "desc",
        }
    })
    return commentsByRoom;
}
export const updateCommentService = async (commentId, payload, currentUser) => {
    if (!Number.isInteger(commentId) || commentId <= 0) {
        throw new AppError(400, "Sai mã bình luận không hợp lệ");
    }
    if (!currentUser || !currentUser.id) {
        throw new AppError(401, "Bạn cần đăng nhập để bình luận");
    }

    const { noiDung, saoBinhLuan } = payload;
    if (!noiDung && saoBinhLuan === undefined) {
        throw new AppError(400, "Không có dữ liệu để cập nhật");
    }
    const updateData = {}

    if (noiDung) {
        updateData.noiDung = noiDung;
    }
    if (saoBinhLuan !== undefined) {
        const rating = Number(saoBinhLuan);

        if (!Number.isInteger(rating) || rating <= 0 || rating > 5) {
            throw new AppError(400, "Vui lòng nhập số từ 1 đến 5");
        }

        updateData.saoBinhLuan = rating;
    }

    const existingComment = await prisma.binhLuan.findUnique({
        where: {
            id: commentId,
        }
    })
    if (!existingComment) {
        throw new AppError(404, "Bình luận không tồn tại");
    }
    const isOwner = existingComment.maNguoiBinhLuan === currentUser.id;
    const isAdmin = currentUser.role === "ADMIN";

    if (!isOwner && !isAdmin) {
        throw new AppError(403, "Bạn không có quyền cập nhật bình luận này");
    }
    const updatedComment = await prisma.binhLuan.update({
        where: {
            id: commentId,
        },
        data: updateData,
        select: {
            id: true,
            maPhong: true,
            maNguoiBinhLuan: true,
            ngayBinhLuan: true,
            noiDung: true,
            saoBinhLuan: true,
            createdAt: true,
            updatedAt: true,
        }
    });
    return updatedComment;

}
export const deleteCommentService = async (commentId, currentUser) => {
    if (!Number.isInteger(commentId) || commentId <= 0) {
        throw new AppError(400, "Sai mã bình luận không hợp lệ");
    }
    if (!currentUser || !currentUser.id) {
        throw new AppError(401, "Bạn cần đăng nhập để bình luận");
    }


    const existingComment = await prisma.binhLuan.findUnique({
        where: {
            id: commentId,
        }
    })
    if (!existingComment) {
        throw new AppError(404, "Bình luận không tồn tại");
    }

    const isOwner = existingComment.maNguoiBinhLuan === currentUser.id;
    const isAdmin = currentUser.role === "ADMIN";

    if (!isOwner && !isAdmin) {
        throw new AppError(403, "Bạn không có quyền xóa bình luận này");
    }
    const deletedComment = await prisma.binhLuan.delete({
        where: {
            id: commentId,
        },
    })
    return deletedComment;
}