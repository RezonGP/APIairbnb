import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError.js";

export const protect = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return next(new AppError(401, "Token không tồn tại"));
        }
        // - split(" ") sẽ ra: ["Bearer", "token"] tính từ index 0
        const token = authHeader.split(" ")[1];
        if (!token) {
            return next(new AppError(401, "Token không hợp lệ"))
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return next(new AppError(401, "Token không hợp lệ hoặc đã hết hạn"));
    }
}

export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return next(new AppError(401, "Bạn cần đăng nhập để thực hiện hành động này"))
        }

        if (!allowedRoles.includes(req.user.role)) {
            return next(new AppError(403, "Bạn không có quyền thực hiện hành động này"))
        }

        next();
    };
};
