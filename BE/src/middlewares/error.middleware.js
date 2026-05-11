export const errorHandler = (err, req, res, next) => {
    //  - P2002 : vi phạm unique (vd email đã tồn tại)
    //→ map sang HTTP 409 Conflict
    // - P2025 : không tìm thấy record khi update / delete
    //→ map sang HTTP 404 Not Found
    if (err?.code === "P2002") {
        err.statusCode = 409
        err.message = err.message || "Dữ liệu đã tồn tại"
        err.details = err.details || err.meta
    }

    if (err?.code === "P2025") {
        err.statusCode = 404
        err.message = err.message || "Không tìm thấy dữ liệu"
        err.details = err.details || err.meta
    }

    const statusCode =
        err.statusCode || (err.name === "ZodError" ? 400 : 500)
    const message = err.message || "Internal server error"

    const payload = {
        statusCode,
        message,
        path: req.originalUrl,
        timestamp: new Date().toISOString(),
    }

    if (err.name === "ZodError" && Array.isArray(err.issues)) {
        payload.details = err.issues
    } else if (err.details !== undefined) {
        payload.details = err.details
    }

    if (process.env.NODE_ENV === "development") {
        payload.stack = err.stack
    }

    return res.status(statusCode).json(payload)
} 
