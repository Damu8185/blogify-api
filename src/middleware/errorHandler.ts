// middleware/errorHandler.ts
import { Request, Response, NextFunction } from "express";
import ApiError from "../errors";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const statusCode = err instanceof ApiError ? err.statusCode : 500;
  const message =
    err instanceof ApiError ? err.message : "Something went wrong";
  const details =
    err instanceof ApiError && err.details ? err.details : undefined;

  const response: any = {
    success: false,
    message,
  };

  if (details) {
    response.details = details;
  }

  res.status(statusCode).json(response);
}
