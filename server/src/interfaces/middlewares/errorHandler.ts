import { NextFunction, Request, Response } from "express";
import { ApplicationError } from "../../application/errors/ApplicationError";
import { HttpStatus } from "../enums/HttpStatus";

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    console.error('error ', err)

    if (err instanceof ApplicationError) {
        res.status(err.statusCode).json({ success: false, message: err.message })
        return
    }

    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: "Internal Server Error" });
}