import {
    createViTriService,
    deleteViTriService,
    getAllViTriService,
    getViTriByIdService,
    getViTriByPageService,
    updateViTriService,
    uploadViTriImageService,
} from "../services/vitri.services.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const fillAll = asyncHandler(async (req, res) => {
    const vitri = await getAllViTriService();
    return res.status(200).json({
        message: "Get all vitri successfully",
        data: vitri,
    });
});

export const createViTri = asyncHandler(async (req, res) => {
    const vitri = await createViTriService(req.body);
    return res.status(201).json({
        message: "Create vitri successfully",
        data: vitri,
    });
});

export const getById = asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    const vitri = await getViTriByIdService(id);
    return res.status(200).json({
        message: "Get vitri successfully",
        data: vitri,
    });
});

export const UdateViTri = asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    const viTri = await updateViTriService(id, req.body);
    return res.status(200).json({
        message: "Update vitri successfully",
        data: viTri,
    });
});

export const deleteViTri = asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    const deletedViTri = await deleteViTriService(id);
    return res.status(200).json({
        message: "Delete vitri successfully",
        data: deletedViTri,
    });
});

export const getViTriByPage = asyncHandler(async (req, res) => {
    const { pageIndex, pageSize, keyword } = req.query;
    const data = await getViTriByPageService(pageIndex, pageSize, keyword);
    return res.status(200).json({
        message: "Lay danh sach vi tri phan trang thanh cong",
        data,
    });
});

export const UploadHinhAnh = asyncHandler(async (req, res) => {
    const id = Number(req.body.id || req.query.id || req.query.maViTri);
    const viTri = await uploadViTriImageService(id, req.file);
    return res.status(200).json({
        message: "Upload vitri successfully",
        data: viTri,
    });
});
