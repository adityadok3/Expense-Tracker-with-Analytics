import { Response } from "express";
import { AnalyticsService } from "../services/analyticsService";
import { ApiResponse } from "../utils/apiResponse";
import { AuthenticatedRequest } from "../types";

export class AnalyticsController {
  static async getSummary(req: AuthenticatedRequest, res: Response) {
    const userId = req.user!.id;
    const summary = await AnalyticsService.getSummary(userId);
    return ApiResponse.success(res, "Analytics summary retrieved", summary, 200);
  }

  static async getCategoryBreakdown(req: AuthenticatedRequest, res: Response) {
    const userId = req.user!.id;
    const breakdown = await AnalyticsService.getCategoryBreakdown(userId);
    return ApiResponse.success(res, "Category breakdown retrieved", breakdown, 200);
  }

  static async getMonthlyTrends(req: AuthenticatedRequest, res: Response) {
    const userId = req.user!.id;
    const months = req.query.months ? parseInt(req.query.months as string, 10) : 6;
    const trends = await AnalyticsService.getMonthlyTrends(userId, months);
    return ApiResponse.success(res, "Monthly trends retrieved", trends, 200);
  }
}
