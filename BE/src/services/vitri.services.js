import prisma from "../config/prisma.js";
import { AppError } from "../utils/AppError.js";

const vitriSelect = {
    id: true,
    tenViTri: true,
    tinhThanh: true,
    quocGia: true,
    hinhAnh: true,
    createdAt: true,
    updatedAt: true,
};

export const getAllViTriService = async () => {
    return prisma.viTri.findMany({
        select: vitriSelect,
        orderBy: {
            id: "asc",
        },
    });
};

export const createViTriService = async (payload) => {
    const { tenViTri, tinhThanh, quocGia, hinhAnh } = payload;

    if (!tenViTri || !tinhThanh || !quocGia) {
        throw new AppError(400, "Vui long nhap day duong thong tin");
    }

    const existingViTri = await prisma.viTri.findFirst({
        where: {
            tenViTri,
        },
    });

    if (existingViTri) {
        throw new AppError(409, "vi tri da ton tai");
    }

    return prisma.viTri.create({
        data: {
            tenViTri,
            tinhThanh,
            quocGia,
            hinhAnh: hinhAnh || "",
        },
        select: vitriSelect,
    });
};

export const getViTriByIdService = async (id) => {
    if (!Number.isInteger(id) || id <= 0) {
        throw new AppError(400, "Vui long nhap id");
    }

    const vitri = await prisma.viTri.findUnique({
        where: {
            id,
        },
        select: vitriSelect,
    });

    if (!vitri) {
        throw new AppError(404, "Vitri not found");
    }

    return vitri;
};

export const updateViTriService = async (id, payload) => {
    if (!Number.isInteger(id) || id <= 0) {
        throw new AppError(400, "Vui long nhap id");
    }

    const currentViTri = await prisma.viTri.findUnique({
        where: {
            id,
        },
    });

    if (!currentViTri) {
        throw new AppError(404, "Vitri not found");
    }

    const { tenViTri, tinhThanh, quocGia, hinhAnh } = payload;

    if (
        tenViTri === undefined &&
        tinhThanh === undefined &&
        quocGia === undefined &&
        hinhAnh === undefined
    ) {
        throw new AppError(400, "Vui long nhap day duong thong tin");
    }

    if (tenViTri !== undefined) {
        const existingViTri = await prisma.viTri.findFirst({
            where: {
                tenViTri,
            },
        });

        if (existingViTri && existingViTri.id !== id) {
            throw new AppError(409, "vi tri da ton tai");
        }
    }

    const updateData = {};

    if (tenViTri !== undefined) updateData.tenViTri = tenViTri;
    if (tinhThanh !== undefined) updateData.tinhThanh = tinhThanh;
    if (quocGia !== undefined) updateData.quocGia = quocGia;
    if (hinhAnh !== undefined) updateData.hinhAnh = hinhAnh || "";

    return prisma.viTri.update({
        where: {
            id,
        },
        data: updateData,
        select: vitriSelect,
    });
};

export const deleteViTriService = async (id) => {
    if (!Number.isInteger(id) || id <= 0) {
        throw new AppError(400, "Vui long nhap id");
    }

    const existingViTri = await prisma.viTri.findUnique({
        where: {
            id,
        },
    });

    if (!existingViTri) {
        throw new AppError(404, "Vitri not found");
    }

    return prisma.viTri.delete({
        where: {
            id,
        },
        select: vitriSelect,
    });
};

export const getViTriByPageService = async (pageIndex, pageSize, keyword) => {
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
            tenViTri: {
                contains: searchKeyword,
            },
        }
        : {};

    const totalItem = await prisma.viTri.count({
        where: whereCondition,
    });

    const vitris = await prisma.viTri.findMany({
        where: whereCondition,
        skip,
        take: limit,
        select: vitriSelect,
        orderBy: {
            createdAt: "desc",
        },
    });

    return {
        pageIndex: currentPage,
        pageSize: limit,
        totalItem,
        totalPage: Math.ceil(totalItem / limit),
        items: vitris,
    };
};

export const uploadViTriImageService = async (id, file) => {
    if (!file) {
        throw new AppError(400, "Vui long upload hinh anh");
    }

    if (!Number.isInteger(id) || id <= 0) {
        throw new AppError(400, "Vui long nhap id");
    }

    const existingViTri = await prisma.viTri.findUnique({
        where: {
            id,
        },
    });

    if (!existingViTri) {
        throw new AppError(404, "Vitri not found");
    }

    return prisma.viTri.update({
        where: {
            id,
        },
        data: {
            hinhAnh: file.filename,
        },
        select: vitriSelect,
    });
};
