import express from "express";
import prisma from "../config/prisma.js";


const router = express.Router();

router.get("/", (req, res) => {
    res.json({
        message: "Airbnb API is running",
    });
});

router.get("/health", (req, res) => {
    res.json({
        status: "ok",
    });
});

router.get("/db-check", async (req, res) => {
    try {
        const userCount = await prisma.nguoiDung.count();

        res.json({
            status: "ok",
            message: "Database connection is successful",
            data: {
                userCount,
            },
        })

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Database connection failed",
            error: error.message,
        })
    }
})

export default router;
