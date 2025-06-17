// middleware/errorHandler.ts
import { Request, Response, NextFunction } from "express";
import ApiError from "../errors";

export function errorHandler(
  err: any,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void {
  const statusCode = err instanceof ApiError ? err.statusCode : 500;
  const message =
    err instanceof ApiError ? err.message : "Something went wrong";
  const details = err instanceof ApiError && err.details;

  res.status(statusCode).json({
    success: false,
    message,
    ...(details && { details }),
  });
}
