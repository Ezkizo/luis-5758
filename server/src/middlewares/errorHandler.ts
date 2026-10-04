import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError.js";

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // 1. Errores controlados
  if ("isOperational" in err && err.isOperational) {
    return res.status((err as AppError).statusCode).json({
      status: "error",
      message: err.message,
    });
  }

  // 2. Errores no controlados
  console.error("Error inesperado:", err);

  const isDevelopment = process.env.NODE_ENV !== "production";

  return res.status(500).json({
    status: "error",
    message: isDevelopment ? err.message : "Internal server error",
    stack: isDevelopment ? err.stack : undefined,
  });
};
