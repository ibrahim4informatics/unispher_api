import { NextFunction, Request, Response } from "express";
import { AppError } from "../shared/errors/AppError";

export default (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error("midle");
    console.error(err instanceof AppError);
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message
        });
    }

    switch (err.code) {
        case "P2002":
            return res.status(400).json({
                success: false,
                message: "Unique constraint failed"
            });
        case "P2025":
            return res.status(404).json({
                success: false,
                message: "Record not found"
            });

        case "P2003":
            return res.status(400).json({
                success: false,
                message: "Foreign key constraint failed"
            });


        default:
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
    }
}