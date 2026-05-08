import bcrypt from "bcrypt";
import prisma from "../config/prisma.js";
import { AppError } from "../utils/AppError.js";

const userSelect = {
    id: true,
    name: true,
    email: true,
    phone: true,
    avatar: true,
    birthday: true,
    gender: true,
    role: true,
    createdAt: true,
    updatedAt: true,
};

export const getUsersService = async () => {
    return prisma.nguoiDung.findMany({
        select: userSelect,
        orderBy: {
            id: "desc",
        },
    });
};

export const getUserByIdService = async (userId) => {
    if (!Number.isInteger(userId) || userId <= 0) {
        throw new AppError(400, "User id khong hop le");
    }

    const user = await prisma.nguoiDung.findUnique({
        where: {
            id: userId,
        },
        select: userSelect,
    });

    if (!user) {
        throw new AppError(404, "User not found");
    }

    return user;
};

export const createUserService = async (payload) => {
    const { name, email, password, phone, birthday, gender, role } = payload;

    if (!name || !email || !password || !phone) {
        throw new AppError(400, "hay nhap thong thong tin dang ky");
    }

    const existingUser = await prisma.nguoiDung.findUnique({
        where: {
            email,
        },
    });

    if (existingUser) {
        throw new AppError(409, "Email da ton tai");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const allowedRoles = ["USER"];
    const normalizedRole =
        role !== undefined ? String(role).trim().toUpperCase() : "USER";

    if (role !== undefined) {
        if (!allowedRoles.includes(normalizedRole)) {
            throw new AppError(400, "Role chi co the la USER");
        }
    }

    return prisma.nguoiDung.create({
        data: {
            name,
            email,
            password: hashedPassword,
            phone,
            birthday,
            gender,
            role: normalizedRole,
        },
        select: userSelect,
    });
};

export const updateUserService = async (userId, payload) => {
    if (!Number.isInteger(userId) || userId <= 0) {
        throw new AppError(400, "User id khong hop le");
    }

    const existingUser = await prisma.nguoiDung.findUnique({
        where: {
            id: userId,
        },
    });

    if (!existingUser) {
        throw new AppError(404, "User not found");
    }

    const { name, email, phone, birthday, gender, role } = payload;

    if (
        name === undefined &&
        email === undefined &&
        phone === undefined &&
        birthday === undefined &&
        gender === undefined &&
        role === undefined
    ) {
        throw new AppError(400, "Khong co du lieu de cap nhat");
    }

    if (email !== undefined) {
        const emailOwner = await prisma.nguoiDung.findUnique({
            where: {
                email,
            },
        });

        if (emailOwner && emailOwner.id !== userId) {
            throw new AppError(409, "Email da ton tai");
        }
    }

    const updateData = {};
    const allowedRoles = ["USER", "ADMIN"];

    if (role !== undefined) {
        const normalizedRole = String(role).trim().toUpperCase();

        if (!allowedRoles.includes(normalizedRole)) {
            throw new AppError(400, "Role khong hop le");
        }

        updateData.role = normalizedRole;
    }

    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (birthday !== undefined) updateData.birthday = birthday;
    if (gender !== undefined) updateData.gender = gender;

    return prisma.nguoiDung.update({
        where: {
            id: userId,
        },
        data: updateData,
        select: userSelect,
    });
};

export const deleteUserService = async (userId) => {
    if (!Number.isInteger(userId) || userId <= 0) {
        throw new AppError(400, "User id khong hop le");
    }

    const existingUser = await prisma.nguoiDung.findUnique({
        where: {
            id: userId,
        },
    });

    if (!existingUser) {
        throw new AppError(404, "User not found");
    }

    return prisma.nguoiDung.delete({
        where: {
            id: userId,
        },
        select: userSelect,
    });
};

export const searchUsersByNameService = async (keyword) => {
    const searchKeyword = keyword?.trim() || "";

    if (!searchKeyword) {
        throw new AppError(400, "Search keyword is required");
    }

    return prisma.nguoiDung.findMany({
        where: {
            name: {
                contains: searchKeyword,
            },
        },
        select: userSelect,
        orderBy: {
            id: "desc",
        },
    });
};

export const getUsersByPageService = async (pageIndex, pageSize, keyword) => {
    const currentPage = Number(pageIndex) || 1;
    const limit = Number(pageSize) || 10;
    const searchKeyword = keyword?.trim() || "";

    if (!Number.isInteger(currentPage) || currentPage <= 0) {
        throw new AppError(400, "pageIndex va pageSize phai lon hon 0");
    }

    if (!Number.isInteger(limit) || limit <= 0) {
        throw new AppError(400, "pageIndex va pageSize phai lon hon 0");
    }

    const skip = (currentPage - 1) * limit;

    const whereCondition = searchKeyword
        ? {
            name: {
                contains: searchKeyword,
            },
        }
        : {};

    const totalItem = await prisma.nguoiDung.count({
        where: whereCondition,
    });

    const users = await prisma.nguoiDung.findMany({
        where: whereCondition,
        skip,
        take: limit,
        select: userSelect,
        orderBy: {
            id: "desc",
        },
    });

    return {
        pageIndex: currentPage,
        pageSize: limit,
        totalItem,
        totalPage: Math.ceil(totalItem / limit),
        items: users,
    };
};

export const uploadUserAvatarService = async (file, currentUser) => {
    if (!file) {
        throw new AppError(400, "vui long chon anh avatar cua ban");
    }

    if (!currentUser || !currentUser.id) {
        throw new AppError(401, "Ban can dang nhap de upload avatar");
    }

    const existingUser = await prisma.nguoiDung.findUnique({
        where: {
            id: currentUser.id,
        },
    });

    if (!existingUser) {
        throw new AppError(404, "User not found");
    }

    const avatarUrl = `/images/avatar/${file.filename}`;

    return prisma.nguoiDung.update({
        where: {
            id: currentUser.id,
        },
        data: {
            avatar: avatarUrl,
        },
        select: userSelect,
    });
};
