import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { validateBody } from "../middlewares/validate.middleware.js";
import { signIn, signUp, getProfile } from "../controllers/auth.controller.js";
import { signInSchema, signUpSchema } from "../validators/auth.validator.js";

const authRouter = express.Router();

authRouter.get("/profile", protect, getProfile);
authRouter.post("/signup", validateBody(signUpSchema), signUp);
authRouter.post("/signin", validateBody(signInSchema), signIn);

export default authRouter;
