import express from "express";
import { createRoom, deleteRoom, getRoomById, getRoomByLocation, getRooms, getRoomsByPage, updateRoom, uploadRoomImage } from "../controllers/phong.controller.js";
import { uploadAvatar } from "../middlewares/upload.middleware.js";
import { authorizeRoles, protect } from "../middlewares/auth.middleware.js";

const phongRouter = express.Router();

phongRouter.get("/", getRooms);
phongRouter.post("/", protect, authorizeRoles("ADMIN"), createRoom);
phongRouter.get("/lay-phong-theo-vi-tri/:maViTri", getRoomByLocation);
phongRouter.get("/phan-trang-tim-kiem", getRoomsByPage);
phongRouter.post(
    "/upload-hinh-phong",
    protect,
    authorizeRoles("ADMIN"),
    uploadAvatar.single("formFile"),
    uploadRoomImage
);
phongRouter.get("/:id", getRoomById);
phongRouter.put("/:id", protect, authorizeRoles("ADMIN"), updateRoom);
phongRouter.delete("/:id", protect, authorizeRoles("ADMIN"), deleteRoom);

export default phongRouter;
