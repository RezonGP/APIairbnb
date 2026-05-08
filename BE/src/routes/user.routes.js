import express from "express";
import { createUser, deleteUser, getUserById, getUsers, getUsersByPage, updateUser, uploadUserAvatar } from "../controllers/user.controller.js";
import { uploadAvatar } from "../middlewares/upload.middleware.js";
import { searchByName } from "../controllers/user.controller.js";
import { authorizeRoles, protect } from "../middlewares/auth.middleware.js";

const userRouter = express.Router();

userRouter.get("/", protect, authorizeRoles("ADMIN"), getUsers);
userRouter.post("/", protect, authorizeRoles("ADMIN"), createUser);
userRouter.delete("/", protect, authorizeRoles("ADMIN"), deleteUser);
userRouter.post("/upload-avatar", protect, uploadAvatar.single("formFile"), uploadUserAvatar);
userRouter.get("/search/:TenNguoiDung", protect, authorizeRoles("ADMIN"), searchByName);
userRouter.get("/phan-trang-tim-kiem", protect, authorizeRoles("ADMIN"), getUsersByPage);
userRouter.get("/:id", protect, authorizeRoles("ADMIN"), getUserById);
userRouter.put("/:id", protect, authorizeRoles("ADMIN"), updateUser);
userRouter.delete("/:id", protect, authorizeRoles("ADMIN"), deleteUser);
export default userRouter;
