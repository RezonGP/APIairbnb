import prisma from "../config/prisma.js";
import { AppError } from "../utils/AppError.js";
import { createBookingSchema, updateBookingSchema } from "../validators/datPhong.validator.js";

const parseDate = (value) => {
    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? null : date;
}


const validateCreateBookingPayload = (payload) => {

    // safeParse : validate và parse payload theo schema, nếu không thành công thì throw error
    const parsedPayload = createBookingSchema.safeParse(payload);
    if (!parsedPayload.success) {
        throw new AppError(400, parsedPayload.error.issues[0].message);
    }
    const { maPhong, soLuongKhach, ngayDen, ngayDi } = parsedPayload.data;
    const roomId = Number(maPhong);
    const guestCount = Number(soLuongKhach);
    const checkInDate = parseDate(ngayDen);
    const checkOutDate = parseDate(ngayDi);

    if (!checkInDate || !checkOutDate) {
        throw new AppError(400, "thiếu thông tin ngày check-in hoặc ngày check-out");
    }
    if (checkInDate >= checkOutDate) {
        throw new AppError(400, "ngày check-in không thể lớn hơn ngày check-out");
    }
    return {
        roomId,
        guestCount,
        checkInDate,
        checkOutDate,
    }
}
const validateUpdateBookingPayload = (payload, existingBooking) => {
    const parsedPayload = updateBookingSchema.safeParse(payload);
    // nếu không thành công thì throw error
    if (!parsedPayload.success) {
        throw new AppError(400, parsedPayload.error.issues[0].message);
    }
    const { maPhong, soLuongKhach, ngayDen, ngayDi } = parsedPayload.data;

    if (maPhong === undefined && soLuongKhach === undefined && ngayDen === undefined && ngayDi === undefined) {
        throw new AppError(400, "Khong co du lieu de cap nhat");
    }
    const guestCount = soLuongKhach !== undefined
        ? Number(soLuongKhach)
        : existingBooking.soLuongKhach;
    const roomId = maPhong !== undefined
        ? Number(maPhong)
        : existingBooking.maPhong;
    const checkInDate = ngayDen !== undefined
        ? parseDate(ngayDen)
        : existingBooking.ngayDen;
    const checkOutDate = ngayDi !== undefined
        ? parseDate(ngayDi)
        : existingBooking.ngayDi;
    if (!Number.isInteger(roomId) || roomId <= 0) {
        throw new AppError(400, "ma phong khong hop le");
    }
    if (!checkInDate || !checkOutDate || checkInDate >= checkOutDate) {
        throw new AppError(400, "ngay dat phong khong hop le");
    }
    return {
        roomId,
        guestCount,
        checkInDate,
        checkOutDate,
    }
}
export const createBookingService = async (payload, currentUser) => {
    if (!currentUser || !currentUser.id) {
        throw new AppError(401, "Bạn cần đăng nhập để tạo đặt phòng");
    }
    const { roomId, guestCount, checkInDate, checkOutDate } = validateCreateBookingPayload(payload);
    const userId = currentUser.id;
    const existingRoom = await prisma.phong.findUnique({
        where: {
            id: roomId,
        }
    })
    const existingUser = await prisma.nguoiDung.findUnique({
        where: {
            id: userId,
        }
    })
    if (!existingRoom) {
        throw new AppError(404, "phòng không tồn tại");
    }
    if (!existingUser) {
        throw new AppError(404, "người dùng không tồn tại");
    }
    //- gt = >
    // - gte = >=
    // - lt = <
    // - lte = <= 
    const overlappingBooking = await prisma.datPhong.findFirst({
        where: {
            maPhong: roomId,
            ngayDen: {
                lt: checkOutDate,
            },
            ngayDi: {
                gt: checkInDate,
            }
        }
    })
    if (overlappingBooking) {
        throw new AppError(409, "phòng này đã có người đặt trong chính khoảng thời gian đó");
    }
    const booking = await prisma.datPhong.create({
        data: {
            maPhong: roomId,
            ngayDen: checkInDate,
            ngayDi: checkOutDate,
            soLuongKhach: guestCount,
            maNguoiDung: userId,
        },
        select: {
            id: true,
            maPhong: true,
            ngayDen: true,
            ngayDi: true,
            soLuongKhach: true,
            maNguoiDung: true,
            createdAt: true,
            updatedAt: true,
            phong: {
                select: {
                    id: true,
                    tenPhong: true,
                    giaTien: true,
                    hinhAnh: true,
                },
            },
            nguoiDung: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    role: true,
                }
            }
        }
    })

    return booking;


}
export const updateBookingService = async (bookingId, payload, currentUser) => {
    if (!currentUser || !currentUser.id) {
        throw new AppError(401, "Bạn cần đăng nhập để cập nhật đặt phòng");
    }

    if (!Number.isInteger(bookingId) || bookingId <= 0) {
        throw new AppError(400, "id không hợp lệ");
    }

    const existingBooking = await prisma.datPhong.findUnique({
        where: {
            id: bookingId,
        },
    })
    if (!existingBooking) {
        throw new AppError(404, "dat phòng không tồn tại");
    }
    const isOwner = existingBooking.maNguoiDung === currentUser.id
    const isAdmin = currentUser.role === "ADMIN"
    if (!isOwner && !isAdmin) {
        throw new AppError(403, "Bạn không có quyền cập nhật đặt phòng này");
    }
    const { roomId, guestCount, checkInDate, checkOutDate } = validateUpdateBookingPayload(payload, existingBooking);
    const existingRoom = await prisma.phong.findUnique({
        where: {
            id: roomId,
        }
    })

    if (!existingRoom) {
        throw new AppError(404, "phòng không tồn tại");
    }
    const overlappingBooking = await prisma.datPhong.findFirst({
        where: {
            maPhong: roomId,
            id: {
                not: bookingId,
            },
            ngayDen: {
                lt: checkOutDate,
            },
            ngayDi: {
                gt: checkInDate,
            }
        }
    })
    if (overlappingBooking) {
        throw new AppError(409, "phong da duoc dat trong khoang thoi gian nay");
    }

    const updatedBooking = await prisma.datPhong.update({
        where: {
            id: bookingId,
        },
        data: {
            maPhong: roomId,
            ngayDen: checkInDate,
            ngayDi: checkOutDate,
            soLuongKhach: guestCount,
        },
        select: {
            id: true,
            maPhong: true,
            ngayDen: true,
            ngayDi: true,
            soLuongKhach: true,
            maNguoiDung: true,
            createdAt: true,
            updatedAt: true,
            phong: {
                select: {
                    id: true,
                    tenPhong: true,
                    giaTien: true,
                    hinhAnh: true,
                },
            },
            nguoiDung: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    role: true,
                }
            }
        }
    })
    return updatedBooking;
}
export const deleteBookingService = async (bookingId, currentUser) => {
    if (!currentUser || !currentUser.id) {
        throw new AppError(401, "Bạn cần đăng nhập để xóa đặt phòng");
    }
    if (!Number.isInteger(bookingId) || bookingId <= 0) {
        throw new AppError(400, "id không hợp lệ");
    }
    const existingBooking = await prisma.datPhong.findUnique({
        where: {
            id: bookingId,
        }
    })
    if (!existingBooking) {
        throw new AppError(404, "đặt phòng không tồn tại");
    }
    const isOwner = existingBooking.maNguoiDung === currentUser.id
    const isAdmin = currentUser.role === "ADMIN"
    if (!isOwner && !isAdmin) {
        throw new AppError(403, "Bạn không có quyền xóa đặt phòng này");
    }

    const deleteBooking = await prisma.datPhong.delete({
        where: {
            id: bookingId,
        },
        select: {
            id: true,
        }
    })
    return deleteBooking;
}
export const getMyBookingsService = async (currentUser) => {
    if (!currentUser || !currentUser.id) {
        throw new AppError(401, "Bạn cần đăng nhập để xem đặt phòng");
    }
    const bookings = await prisma.datPhong.findMany({
        where: {
            maNguoiDung: currentUser.id,
        },
        select: {
            id: true,
            maPhong: true,
            ngayDen: true,
            ngayDi: true,
            soLuongKhach: true,
            maNguoiDung: true,
            createdAt: true,
            updatedAt: true,
            phong: {
                select: {
                    id: true,
                    tenPhong: true,
                    giaTien: true,
                    hinhAnh: true,
                },
            },
        },
    })
    return bookings;
}
export const getBookingByIdService = async (bookingId, currentUser) => {
    if (!currentUser || !currentUser.id) {
        throw new AppError(401, "Bạn cần đăng nhập để xem đặt phòng");
    }
    if (!Number.isInteger(bookingId) || bookingId <= 0) {
        throw new AppError(400, "id không hợp lệ");
    }
    const existingBooking = await prisma.datPhong.findUnique({
        where: {
            id: bookingId,

        }
    })
    if (!existingBooking) {
        throw new AppError(404, "dat phòng không tồn tại");
    }
    const isOwner = existingBooking.maNguoiDung === currentUser.id
    const isAdmin = currentUser.role === "ADMIN"
    if (!isOwner && !isAdmin) {
        throw new AppError(403, "Bạn không có quyền xem đặt phòng này");
    }
    const booking = await prisma.datPhong.findUnique({
        where: {
            id: bookingId,
        },
        select: {
            id: true,
            maPhong: true,
            ngayDen: true,
            ngayDi: true,
            soLuongKhach: true,
            maNguoiDung: true,
            createdAt: true,
            updatedAt: true,
            phong: {
                select: {
                    id: true,
                    tenPhong: true,
                    giaTien: true,
                    hinhAnh: true,
                },
            },
            nguoiDung: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    role: true,
                }
            }
        }
    })
    return booking;

}
export const getAllBookingsAdminService = async (currentUser) => {
    if (!currentUser || !currentUser.id) {
        throw new AppError(401, "Bạn cần đăng nhập để xem đặt phòng");
    }
    if (currentUser.role !== "ADMIN") {
        throw new AppError(403, "Bạn không có quyền xem danh sách đặt phòng");
    }
    const bookings = await prisma.datPhong.findMany({
        select: {
            id: true,
            maPhong: true,
            ngayDen: true,
            ngayDi: true,
            soLuongKhach: true,
            maNguoiDung: true,
            createdAt: true,
            updatedAt: true,
            phong: {
                select: {
                    id: true,
                    tenPhong: true,
                    giaTien: true,
                    hinhAnh: true,
                },
            },
            nguoiDung: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    role: true,
                }
            }
        },
    })
    return bookings;

}
