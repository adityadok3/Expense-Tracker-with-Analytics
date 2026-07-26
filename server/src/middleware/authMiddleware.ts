import { Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";
import { ApiResponse } from "../utils/apiResponse";
import { AuthenticatedRequest } from "../types";

export function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return ApiResponse.error(res, "Access token is missing or malformed", null, 401);
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return ApiResponse.error(res, "Invalid or expired access token", null, 401);
  }
}
