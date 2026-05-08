import prisma from "../config/prisma.js";
import { AppError } from "../utils/AppError.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs/promises";

export const getRoomsService = async () => {
    const rooms = await prisma.phong.findMany({
        select: {
            id: true,
            tenPhong: true,
            khach: true,
            phongNgu: true,
            giuong: true,
            phongTam: true,
            moTa: true,
            giaTien: true,
            mayGiat: true,
            banLa: true,
            tivi: true,
            dieuHoa: true,
            wifi: true,
            bep: true,
            doXe: true,
            hoBoi: true,
            banUi: true,
            maViTri: true,
            hinhAnh: true,
            createdAt: true,
            updatedAt: true,
            viTri: {
                select: {
                    id: true,
                    tenViTri: true,
                    tinhThanh: true,
                    quocGia: true,
                    hinhAnh: true,
                }
            }
        },
        orderBy: {
            id: "desc",
        }
    });
    return rooms;
}
export const createRoomService = async (payload, currentUser) => {
    if (!currentUser || !currentUser.id) {
        throw new AppError(401, "Bạn cần đăng nhập để tạo đặt phòng");
    }
    const { tenPhong, khach, phongNgu, giuong, phongTam, moTa, giaTien, mayGiat, banLa, tivi, dieuHoa, wifi, bep, doXe, hoBoi, banUi, maViTri, hinhAnh } = payload;
    if (!tenPhong || !moTa || !maViTri || !khach || !phongNgu || !giuong || !phongTam || !giaTien
        || mayGiat === undefined
        || banLa === undefined
        || tivi === undefined
        || dieuHoa === undefined
        || wifi === undefined
        || bep === undefined
        || doXe === undefined
        || hoBoi === undefined
        || banUi === undefined) {
        throw new AppError(400, "Vui lòng nhập đầy đủ thông tin phòng");
    }

    const existingRoom = await prisma.phong.findFirst({
        where: {
            tenPhong: tenPhong.trim(),
        }
    })
    if (existingRoom) {
        throw new AppError(400, "Tên phòng đã tồn tại");
    }
    const locationId = Number(maViTri);
    if (!Number.isInteger(locationId) || locationId <= 0) {
        throw new AppError(400, "Mã vị trí không hợp lệ");
    }
    const existingViTri = await prisma.viTri.findUnique({
        where: { id: locationId }
    })
    if (!existingViTri) {
        throw new AppError(404, "Vị trí không tồn tại");
    }
    const isAdmin = currentUser.role === "ADMIN";
    if (!isAdmin) {
        throw new AppError(403, "Bạn không có quyền tạo phòng");
    }

    const room = await prisma.phong.create({
        data: {
            tenPhong,
            khach,
            phongNgu,
            giuong,
            phongTam,
            moTa,
            giaTien,
            mayGiat,
            banLa,
            tivi,
            dieuHoa,
            wifi,
            bep,
            doXe,
            hoBoi,
            banUi,
            maViTri,
            hinhAnh,
        },
        select: {
            id: true,
            tenPhong: true,
            khach: true,
            phongNgu: true,
            giuong: true,
            phongTam: true,
            moTa: true,
            giaTien: true,
            mayGiat: true,
            banLa: true,
            tivi: true,
            dieuHoa: true,
            wifi: true,
            bep: true,
            doXe: true,
            hoBoi: true,
            banUi: true,
            maViTri: true,
            hinhAnh: true,
            createdAt: true,
            updatedAt: true,
            viTri: {
                select: {
                    id: true,
                    tenViTri: true,
                    tinhThanh: true,
                    quocGia: true,
                    hinhAnh: true,
                }
            }
        },
    });
    return room;
}
export const updateRoomService = async (id, payload, currentUser) => {
    if (!currentUser || !currentUser.id) {
        throw new AppError(401, "Bạn cần đăng nhập để cập nhật phòng");
    }
    if (!Number.isInteger(id) || id <= 0) {
        throw new AppError(400, "Mã phòng không hợp lệ");
    }

    const isAdmin = currentUser.role === "ADMIN";
    if (!isAdmin) {
        throw new AppError(403, "Bạn không có quyền cập nhật phòng");
    }
    const existingRoom = await prisma.phong.findUnique({
        where: { id }
    })
    if (!existingRoom) {
        throw new AppError(404, "Phòng không tồn tại");
    }
    const { tenPhong, khach, phongNgu, giuong, phongTam, moTa, giaTien, mayGiat, banLa, tivi, dieuHoa, wifi, bep, doXe, hoBoi, banUi, maViTri, hinhAnh } = payload;

    if (
        tenPhong === undefined &&
        khach === undefined &&
        phongNgu === undefined &&
        giuong === undefined &&
        phongTam === undefined &&
        moTa === undefined &&
        giaTien === undefined &&
        mayGiat === undefined &&
        banLa === undefined &&
        tivi === undefined &&
        dieuHoa === undefined &&
        wifi === undefined &&
        bep === undefined &&
        doXe === undefined &&
        hoBoi === undefined &&
        banUi === undefined &&
        maViTri === undefined &&
        hinhAnh === undefined
    ) {
        throw new AppError(400, "Không có dữ liệu để cập nhật");
    }

    const updateData = {};

    if (tenPhong !== undefined) {
        if (!tenPhong.trim()) {
            throw new AppError(400, "Tên phòng không được để trống");
        }

        const duplicatedRoom = await prisma.phong.findFirst({
            where: {
                tenPhong: tenPhong.trim(),
            }
        })

        if (duplicatedRoom && duplicatedRoom.id !== id) {
            throw new AppError(409, "Tên phòng đã tồn tại");
        }

        updateData.tenPhong = tenPhong.trim();
    }

    if (khach !== undefined) {
        const guest = Number(khach);
        if (!Number.isInteger(guest) || guest <= 0) {
            throw new AppError(400, "Số khách không hợp lệ");
        }
        updateData.khach = guest;
    }

    if (phongNgu !== undefined) {
        const bedRoom = Number(phongNgu);
        if (!Number.isInteger(bedRoom) || bedRoom <= 0) {
            throw new AppError(400, "Số phòng ngủ không hợp lệ");
        }
        updateData.phongNgu = bedRoom;
    }

    if (giuong !== undefined) {
        const bed = Number(giuong);
        if (!Number.isInteger(bed) || bed <= 0) {
            throw new AppError(400, "Số giường không hợp lệ");
        }
        updateData.giuong = bed;
    }

    if (phongTam !== undefined) {
        const bathRoom = Number(phongTam);
        if (!Number.isInteger(bathRoom) || bathRoom <= 0) {
            throw new AppError(400, "Số phòng tắm không hợp lệ");
        }
        updateData.phongTam = bathRoom;
    }

    if (moTa !== undefined) {
        if (!moTa.trim()) {
            throw new AppError(400, "Mô tả không được để trống");
        }
        updateData.moTa = moTa.trim();
    }

    if (giaTien !== undefined) {
        const price = Number(giaTien);
        if (!Number.isInteger(price) || price <= 0) {
            throw new AppError(400, "Giá tiền không hợp lệ");
        }
        updateData.giaTien = price;
    }

    if (mayGiat !== undefined) updateData.mayGiat = mayGiat;
    if (banLa !== undefined) updateData.banLa = banLa;
    if (tivi !== undefined) updateData.tivi = tivi;
    if (dieuHoa !== undefined) updateData.dieuHoa = dieuHoa;
    if (wifi !== undefined) updateData.wifi = wifi;
    if (bep !== undefined) updateData.bep = bep;
    if (doXe !== undefined) updateData.doXe = doXe;
    if (hoBoi !== undefined) updateData.hoBoi = hoBoi;
    if (banUi !== undefined) updateData.banUi = banUi;

    if (maViTri !== undefined) {
        const locationId = Number(maViTri);
        if (!Number.isInteger(locationId) || locationId <= 0) {
            throw new AppError(400, "Mã vị trí không hợp lệ");
        }

        const existingViTri = await prisma.viTri.findUnique({
            where: { id: locationId }
        })

        if (!existingViTri) {
            throw new AppError(404, "Vị trí không tồn tại");
        }

        updateData.maViTri = locationId;
    }

    if (hinhAnh !== undefined) {
        updateData.hinhAnh = hinhAnh;
    }

    const updatedRoom = await prisma.phong.update({
        where: { id },
        data: updateData,
        select: {
            id: true,
            tenPhong: true,
            khach: true,
            phongNgu: true,
            giuong: true,
            phongTam: true,
            moTa: true,
            giaTien: true,
            mayGiat: true,
            banLa: true,
            tivi: true,
            dieuHoa: true,
            wifi: true,
            bep: true,
            doXe: true,
            hoBoi: true,
            banUi: true,
            maViTri: true,
            hinhAnh: true,
            createdAt: true,
            updatedAt: true,
            viTri: {
                select: {
                    id: true,
                    tenViTri: true,
                    tinhThanh: true,
                    quocGia: true,
                    hinhAnh: true,
                }
            }
        }
    })
    return updatedRoom;
}
export const getRoomByLocationService = async (maViTri) => {
    if (!maViTri || !Number.isInteger(maViTri) || maViTri <= 0) {
        throw new AppError(400, "Mã vị trí không hợp lệ");
    }
    const existingRoom = await prisma.viTri.findUnique({
        where: { id: maViTri }
    })
    if (!existingRoom) {
        throw new AppError(404, "Vị trí không tồn tại");
    }
    const roomId = await prisma.phong.findMany({
        where: { maViTri },
        select: {
            id: true,
            tenPhong: true,
            khach: true,
            phongNgu: true,
            giuong: true,
            phongTam: true,
            moTa: true,
            giaTien: true,
            mayGiat: true,
            banLa: true,
            tivi: true,
            dieuHoa: true,
            wifi: true,
            bep: true,
            doXe: true,
            hoBoi: true,
            banUi: true,
            maViTri: true,
            hinhAnh: true,
            createdAt: true,
            updatedAt: true,
            viTri: {
                select: {
                    id: true,
                    tenViTri: true,
                    tinhThanh: true,
                    quocGia: true,
                    hinhAnh: true,
                }
            }
        },
        orderBy: {
            id: "desc",
        }

    })
    return roomId;
}
export const getRoomsByPageService = async (pageIndex, pageSize, keyword) => {

    const currentPage = Number(pageIndex) || 1;
    const limit = Number(pageSize) || 10;
    const searchKeyword = keyword?.trim() || "";

    if (!Number.isInteger(currentPage) || currentPage <= 0) {
        throw new AppError(400, "Trang không hợp lệ");
    }
    if (!Number.isInteger(limit) || limit <= 0) {
        throw new AppError(400, "Số lượng phòng không hợp lệ");
    }
    const skip = (currentPage - 1) * limit;

    const whereCondition = searchKeyword
        ? {
            tenPhong: {
                contains: searchKeyword,
            },
        } : {};
    const totalItem = await prisma.phong.count({
        where: whereCondition,
    })
    const rooms = await prisma.phong.findMany({
        where: whereCondition,
        skip,
        take: limit,
        orderBy: {
            id: "desc",
        },
        select: {
            id: true,
            tenPhong: true,
            khach: true,
            phongNgu: true,
            giuong: true,
            phongTam: true,
            moTa: true,
            giaTien: true,
            mayGiat: true,
            banLa: true,
            tivi: true,
            dieuHoa: true,
            wifi: true,
            bep: true,
            doXe: true,
            hoBoi: true,
            banUi: true,
            maViTri: true,
            hinhAnh: true,
            createdAt: true,
            updatedAt: true,
            viTri: {
                select: {
                    id: true,
                    tenViTri: true,
                    tinhThanh: true,
                    quocGia: true,
                    hinhAnh: true,
                }
            }
        }
    })
    return {
        pageIndex: currentPage,
        pageSize: limit,
        totalItem,
        totalPages: Math.ceil(totalItem / limit),
        items: rooms,
    }

}
export const deleteRoomService = async (currentUser, id) => {
    if (!currentUser || !currentUser.id) {
        throw new AppError(401, "Bạn chưa đăng nhập");
    }
    if (!Number.isInteger(id) || id <= 0) {
        throw new AppError(400, "ID không hợp lệ");
    }
    const isAdmin = currentUser.role === "ADMIN";
    if (!isAdmin) {
        throw new AppError(403, "Bạn không có quyền xóa phòng này");
    }
    const existingRoom = await prisma.phong.findUnique({
        where: { id },
    })
    if (!existingRoom) {
        throw new AppError(404, "Phòng không tồn tại");
    }
    const deletedRoom = await prisma.phong.delete({
        where: { id },
        select: {
            id: true,
            tenPhong: true,
        }
    })
    return deletedRoom;
}
export const getRoomByIdService = async (id) => {
    if (!Number.isInteger(id) || id <= 0) {
        throw new AppError(400, "ID không hợp lệ");
    }
    const getRoomById = await prisma.phong.findUnique({
        where: { id },
        select: {
            id: true,
            tenPhong: true,
            khach: true,
            phongNgu: true,
            giuong: true,
            phongTam: true,
            moTa: true,
            giaTien: true,
            mayGiat: true,
            banLa: true,
            tivi: true,
            dieuHoa: true,
            wifi: true,
            bep: true,
            doXe: true,
            hoBoi: true,
            banUi: true,
            maViTri: true,
            hinhAnh: true,
            createdAt: true,
            updatedAt: true,
            viTri: {
                select: {
                    id: true,
                    tenViTri: true,
                    tinhThanh: true,
                    quocGia: true,
                    hinhAnh: true,
                }
            }
        },
    })
    if (!getRoomById) {
        throw new AppError(404, "Phòng không tồn tại");
    }
    return getRoomById;
}
export const uploadRoomImageService = async (currentUser, file, roomId) => {
    if (!currentUser || !currentUser.id) {
        throw new AppError(401, "Bạn chưa đăng nhập");
    }
    if (!Number.isInteger(roomId) || roomId <= 0) {
        throw new AppError(400, "ID không hợp lệ");
    }
    const isAdmin = currentUser.role === "ADMIN";
    if (!isAdmin) {
        throw new AppError(403, "Bạn không có quyền upload hình ảnh phòng này");
    }
    if (!file) {
        throw new AppError(400, "Hình ảnh không hợp lệ");
    }
    const existingRoom = await prisma.phong.findUnique({
        where: { id: roomId },
    })
    if (!existingRoom) {
        throw new AppError(404, "Phòng không tồn tại");
    }
    let uploadResult;
    try {
        uploadResult = await cloudinary.uploader.upload(file.path, {
            folder: "APIairbnb/rooms",
        })

    } finally {
        await fs.unlink(file.path).catch(() => { });
    }
    const updatedRoom = await prisma.phong.update({
        where: { id: roomId },
        data: {
            hinhAnh: uploadResult.secure_url,
        },
        select: {
            id: true,
            tenPhong: true,
            hinhAnh: true,
            maViTri: true,
            updatedAt: true,
        }
    });
    return updatedRoom;

}
