import { AppError } from "../utils/error.js";
export const errorHandler = (
    error,
    req,
    res,
    next
) => {
    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
        status: "failed",
        message: error.message || "Internal Server Error",
    });
};