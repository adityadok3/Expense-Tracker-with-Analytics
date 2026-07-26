import { Request, Response, NextFunction } from "express";
import { logger } from "../config/logger";
import { ApiResponse } from "../utils/apiResponse";

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  logger.error("Unhandled Error: %o", err);

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || "Internal Server Error";

  return ApiResponse.error(res, message, process.env.NODE_ENV === "development" ? err.stack : null, statusCode);
}
