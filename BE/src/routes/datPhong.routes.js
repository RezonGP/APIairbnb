import express from "express";
import { createBooking, deleteBooking, getAllBookingsAdmin, getBookingById, getMyBookings, updateBooking, } from "../controllers/datPhong.controller.js";
import { authorizeRoles, protect } from "../middlewares/auth.middleware.js";
import { validateBody } from "../middlewares/validate.middleware.js";
import { createBookingSchema, updateBookingSchema } from "../validators/datPhong.validator.js";

const datPhongRouter = express.Router();

// datPhongRouter.get("/", getBookings);
datPhongRouter.post("/", protect, validateBody(createBookingSchema), createBooking);
datPhongRouter.put("/:id", protect, validateBody(updateBookingSchema), updateBooking);
datPhongRouter.delete("/:id", protect, deleteBooking);
datPhongRouter.get("/admin", protect, authorizeRoles("ADMIN"), getAllBookingsAdmin);
datPhongRouter.get("/me", protect, getMyBookings);
datPhongRouter.get("/:id", protect, getBookingById);

export default datPhongRouter;
