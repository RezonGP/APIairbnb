import { createRoomService, deleteRoomService, getRoomByIdService, getRoomByLocationService, getRoomsByPageService, getRoomsService, updateRoomService, uploadRoomImageService } from "../services/room.services.js";
import { asyncHandler } from "../utils/asyncHandler.js";


export const getRooms = asyncHandler(async (req, res) => {
    const rooms = await getRoomsService()
    return res.status(200).json({
        message: "Get rooms successfully",
        data: rooms,
    })
});

export const getRoomByLocation = asyncHandler(async (req, res) => {
    const maViTri = Number(req.params.maViTri)
    const roomByVitri = await getRoomByLocationService(maViTri)
    return res.status(200).json({
        message: "Get room by location successfully",
        data: roomByVitri,
    })


});

export const createRoom = asyncHandler(async (req, res) => {
    const room = await createRoomService(req.body, req.user)
    return res.status(201).json({
        message: "Create room successfully",
        data: room,
    })
});

export const updateRoom = asyncHandler(async (req, res) => {
    const id = Number(req.params.id)
    const payload = req.body
    const room = await updateRoomService(id, payload, req.user)
    return res.status(200).json({
        message: "Update room successfully",
        data: room,
    })
});

export const deleteRoom = asyncHandler(async (req, res) => {
    const id = Number(req.params.id)
    const deletedRoom = await deleteRoomService(req.user, id)
    return res.status(200).json({
        message: "Delete room successfully",
        data: deletedRoom,
    })
});


export const getRoomsByPage = asyncHandler(async (req, res) => {
    const { pageIndex, pageSize, keyword } = req.query
    const rooms = await getRoomsByPageService(pageIndex, pageSize, keyword)
    return res.status(200).json({
        message: "Get rooms by page successfully",
        data: rooms,
    })
});
export const getRoomById = asyncHandler(async (req, res) => {
    const id = Number(req.params.id)
    const room = await getRoomByIdService(id)
    return res.status(200).json({
        message: "Get room by id successfully",
        data: room,
    })
});
export const uploadRoomImage = asyncHandler(async (req, res) => {
    const roomId = Number(req.query.maPhong)
    const room = await uploadRoomImageService(req.user, req.file, roomId)
    return res.status(200).json({
        message: "Upload room image successfully",
        data: room,
    })
});
