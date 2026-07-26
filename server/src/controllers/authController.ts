import { Response } from "express";
import { AuthService } from "../services/authService";
import { ApiResponse } from "../utils/apiResponse";
import { AuthenticatedRequest } from "../types";

export class AuthController {
  static async register(req: AuthenticatedRequest, res: Response) {
    const result = await AuthService.register(req.body);
    return ApiResponse.success(res, "User registered successfully", result, 201);
  }

  static async login(req: AuthenticatedRequest, res: Response) {
    const result = await AuthService.login(req.body);
    return ApiResponse.success(res, "Login successful", result, 200);
  }

  static async refreshTokens(req: AuthenticatedRequest, res: Response) {
    const { refreshToken } = req.body;
    const result = await AuthService.refreshTokens(refreshToken);
    return ApiResponse.success(res, "Tokens refreshed successfully", result, 200);
  }

  static async logout(req: AuthenticatedRequest, res: Response) {
    const { refreshToken } = req.body;
    if (refreshToken) {
      await AuthService.logout(refreshToken);
    }
    return ApiResponse.success(res, "Logout successful", null, 200);
  }

  static async me(req: AuthenticatedRequest, res: Response) {
    if (!req.user) {
      return ApiResponse.error(res, "Unauthorized", null, 401);
    }
    const user = await AuthService.getCurrentUser(req.user.id);
    return ApiResponse.success(res, "Current user fetched successfully", user, 200);
  }
}
