import { createBookingService, deleteBookingService, getAllBookingsAdminService, getBookingByIdService, getMyBookingsService, updateBookingService } from "../services/datPhong.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createBooking = asyncHandler(async (req, res) => {
    const booking = await createBookingService(req.body, req.user);
    return res.status(201).json({
        message: "dat phòng thành công",
        data: booking,
    });

})
export const updateBooking = asyncHandler(async (req, res) => {
    const bookingId = Number(req.params.id);
    const booking = await updateBookingService(bookingId, req.body, req.user);
    return res.status(200).json({
        message: "cap nhat dat phong thanh cong",
        data: booking,
    });
})
export const deleteBooking = asyncHandler(async (req, res) => {
    const bookingId = Number(req.params.id)
    const deletedBooking = await deleteBookingService(bookingId, req.user);
    return res.status(200).json({
        message: "xoa dat phong thanh cong",
        data: deletedBooking,
    });
})
export const getMyBookings = asyncHandler(async (req, res) => {
    const bookings = await getMyBookingsService(req.user);
    return res.status(200).json({
        message: "lay danh sach dat phong cua user thanh cong",
        data: bookings,
    });
})
export const getBookingById = asyncHandler(async (req, res) => {
    const bookingId = Number(req.params.id);
    const getBooking = await getBookingByIdService(bookingId, req.user);
    return res.status(200).json({
        message: "lay dat phong thanh cong",
        data: getBooking,
    });
})
export const getAllBookingsAdmin = asyncHandler(async (req, res) => {
    const bookings = await getAllBookingsAdminService(req.user);
    return res.status(200).json({
        message: "lay danh sach dat phong thanh cong",
        data: bookings,
    });
})
