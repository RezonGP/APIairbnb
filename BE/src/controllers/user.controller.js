import {
    createUserService,
    deleteUserService,
    getUserByIdService,
    getUsersByPageService,
    getUsersService,
    searchUsersByNameService,
    updateUserService,
    uploadUserAvatarService,
} from "../services/user.services.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getUsers = asyncHandler(async (req, res) => {
    const users = await getUsersService();
    return res.status(200).json({
        message: "Get users successfully",
        data: users,
    });
});

export const getUserById = asyncHandler(async (req, res) => {
    const userId = Number(req.params.id);
    const user = await getUserByIdService(userId);
    return res.status(200).json({
        message: "Get user successfully",
        data: user,
    });
});

export const createUser = asyncHandler(async (req, res) => {
    const newUser = await createUserService(req.body);
    return res.status(201).json({
        message: "Create user successfully",
        data: newUser,
    });
});

export const updateUser = asyncHandler(async (req, res) => {
    const userId = Number(req.params.id);
    const updatedUser = await updateUserService(userId, req.body);
    return res.status(200).json({
        message: "Update user successfully",
        data: updatedUser,
    });
});

export const deleteUser = asyncHandler(async (req, res) => {
    const userId = Number(req.params.id || req.query.id);
    const deletedUser = await deleteUserService(userId);
    return res.status(200).json({
        message: "Delete user successfully",
        data: deletedUser,
    });
});

export const searchByName = asyncHandler(async (req, res) => {
    const users = await searchUsersByNameService(req.params.TenNguoiDung);
    return res.status(200).json({
        message: "Search user successfully",
        data: users,
    });
});

export const getUsersByPage = asyncHandler(async (req, res) => {
    const { pageIndex, pageSize, keyword } = req.query;
    const data = await getUsersByPageService(pageIndex, pageSize, keyword);
    return res.status(200).json({
        message: "Lay danh sach user phan trang thanh cong",
        data,
    });
});

export const uploadUserAvatar = asyncHandler(async (req, res) => {
    const user = await uploadUserAvatarService(req.file, req.user);
    return res.status(200).json({
        message: "Upload avatar successfully",
        data: user,
    });
});
