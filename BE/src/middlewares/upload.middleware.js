import multer from "multer";
import path from "path";

const sanitizeFileName = (originalName) => {
    return originalName.replace(/[^a-zA-Z0-9._-]/g, "")
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/images/avatar");
    },
    filename: (req, file, cb) => {
        const safeName = sanitizeFileName(file.originalname)
        const uniqueName = `${Date.now()}-${safeName}`;
        cb(null, uniqueName);
    }
})

const fileFilter = (req, file, cb) => {
    const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
    const ext = path.extname(file.originalname).toLocaleLowerCase();

    if (allowedExtensions.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error("chỉ hỗ trợ upload ảnh"), false);
    }
}

export const uploadAvatar = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
})
