import { Response } from "express";
import { AIService } from "../services/aiService";
import { ApiResponse } from "../utils/apiResponse";
import { AuthenticatedRequest } from "../types";

export class AIController {
  static async getInsights(req: AuthenticatedRequest, res: Response) {
    const userId = req.user!.id;
    const insights = await AIService.generateFinancialInsights(userId);
    return ApiResponse.success(res, "AI financial insights generated", insights, 200);
  }
}
