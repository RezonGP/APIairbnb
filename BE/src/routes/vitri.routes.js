import express from "express";
import { authorizeRoles, protect } from "../middlewares/auth.middleware.js";
import { createViTri, deleteViTri, fillAll, getById, getViTriByPage, UdateViTri, UploadHinhAnh } from "../controllers/vitri.controller.js";
import { uploadHinhAnhViTri } from "../middlewares/uploadVitri.middleware.js";


const vitriRouter = express.Router();


vitriRouter.get("/", fillAll);
vitriRouter.post("/", protect, authorizeRoles("ADMIN"), createViTri);
vitriRouter.get("/phan-trang-tim-kiem", getViTriByPage);
vitriRouter.get("/:id", getById);
vitriRouter.put("/:id", protect, authorizeRoles("ADMIN"), UdateViTri);
vitriRouter.delete("/:id", protect, authorizeRoles("ADMIN"), deleteViTri);
vitriRouter.post("/upload-hinh-anh", protect, authorizeRoles("ADMIN"), uploadHinhAnhViTri.single("formFile"), UploadHinhAnh);


export default vitriRouter;

