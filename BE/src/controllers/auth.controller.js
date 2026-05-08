import { signInService, signUpService, getProfileService } from "../services/auth.services.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const signUp = asyncHandler(async (req, res) => {
    const newUser = await signUpService(req.body);

    return res.status(201).json({
        message: "Sign up successfully",
        data: newUser,
    });
});

export const signIn = asyncHandler(async (req, res) => {
    const { token, user } = await signInService(req.body);

    return res.status(200).json({
        message: "Sign in successfully",
        token,
        data: user,
    });
});

export const getProfile = asyncHandler(async (req, res) => {
    const user = await getProfileService(req.user);

    return res.status(200).json({
        message: "Get profile successfully",
        data: user,
    });
});
