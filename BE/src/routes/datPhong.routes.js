import express from "express";
import { createBooking, deleteBooking, getAllBookingsAdmin, getBookingById, getMyBookings, updateBooking, } from "../controllers/datPhong.controller.js";
import { authorizeRoles, protect } from "../middlewares/auth.middleware.js";

const datPhongRouter = express.Router();

// datPhongRouter.get("/", getBookings);
datPhongRouter.post("/", protect, createBooking);
datPhongRouter.put("/:id", protect, updateBooking);
datPhongRouter.delete("/:id", protect, deleteBooking);
datPhongRouter.get("/admin", protect, authorizeRoles("ADMIN"), getAllBookingsAdmin);
datPhongRouter.get("/me", protect, getMyBookings);
datPhongRouter.get("/:id", protect, getBookingById);

export default datPhongRouter;
