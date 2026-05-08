import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { signIn, signUp, getProfile } from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.get("/profile", protect, getProfile);
authRouter.post("/signup", signUp);
authRouter.post("/signin", signIn);

export default authRouter;