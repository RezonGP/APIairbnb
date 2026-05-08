import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";
import { AppError } from "../utils/AppError.js";

const authUserSelect = {
    id: true,
    name: true,
    email: true,
    phone: true,
    avatar: true,
    birthday: true,
    gender: true,
    role: true,
};

const profileUserSelect = {
    ...authUserSelect,
    createdAt: true,
    updatedAt: true,
};

export const signUpService = async (payload) => {
    const { name, email, password, phone, birthday, gender } = payload;

    if (!name || !email || !password || !phone) {
        throw new AppError(400, "hãy nhập thông thông tin đăng ký");
    }

    const existingUser = await prisma.nguoiDung.findUnique({
        where: {
            email,
        },
    });

    if (existingUser) {
        throw new AppError(409, "Email đã tồn tại");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.nguoiDung.create({
        data: {
            name,
            email,
            password: hashedPassword,
            phone,
            birthday,
            gender,
            role: "USER",
        },
        select: authUserSelect,
    });

    return newUser;
};

export const signInService = async (payload) => {
    const { email, password } = payload;

    if (!email || !password) {
        throw new AppError(400, "Hãy nhập thông tin đăng nhập");
    }

    const user = await prisma.nguoiDung.findUnique({
        where: {
            email,
        },
    });

    if (!user) {
        throw new AppError(404, "User không tồn tại");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw new AppError(401, "Password không đúng");
    }

    const token = jwt.sign(
        {
            id: user.id,
            email: user.email,
            role: user.role,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d",
        }
    );

    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            avatar: user.avatar,
            birthday: user.birthday,
            gender: user.gender,
            role: user.role,
        },
    };
};

export const getProfileService = async (currentUser) => {
    if (!currentUser || !currentUser.id) {
        throw new AppError(401, "Bạn cần đăng nhập để xem profile");
    }

    const user = await prisma.nguoiDung.findUnique({
        where: {
            id: currentUser.id,
        },
        select: profileUserSelect,
    });

    if (!user) {
        throw new AppError(404, "User khong tồn tại");
    }

    return user;
};
