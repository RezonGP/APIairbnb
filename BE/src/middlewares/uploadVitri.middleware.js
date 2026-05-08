import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/images/vitri")
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`
        cb(null, uniqueName)
    }
})

const fileFilter = (req, file, cb) => {
    const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"]
    const ext = path.extname(file.originalname).toLowerCase()
    if (allowedExtensions.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error("chỉ hỗ trợ upload ảnh"), false);
    }
}
export const uploadHinhAnhViTri = multer({
    storage,
    fileFilter,
})
