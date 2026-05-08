import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                message: "Token không tồn tại",
            });
        }
        // - split(" ") sẽ ra: ["Bearer", "token"] tính từ index 0
        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({
                message: "Token không hợp lệ",
            });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Token khong hop le hoac da het han",
        });
    }
}

export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(401).json({
                message: "Ban can dang nhap de thuc hien hanh dong nay",
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                message: "Ban khong co quyen thuc hien hanh dong nay",
            });
        }

        next();
    };
};
