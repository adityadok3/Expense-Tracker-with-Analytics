import { Response } from "express";
import { SavingsService } from "../services/savingsService";
import { ApiResponse } from "../utils/apiResponse";
import { AuthenticatedRequest } from "../types";

export class SavingsController {
  static async getSavingsGoals(req: AuthenticatedRequest, res: Response) {
    const userId = req.user!.id;
    const goals = await SavingsService.getSavingsGoals(userId);
    return ApiResponse.success(res, "Savings goals retrieved successfully", goals, 200);
  }

  static async getSavingsGoalById(req: AuthenticatedRequest, res: Response) {
    const userId = req.user!.id;
    const id = req.params.id as string;
    const goal = await SavingsService.getSavingsGoalById(userId, id);
    return ApiResponse.success(res, "Savings goal fetched successfully", goal, 200);
  }

  static async createSavingsGoal(req: AuthenticatedRequest, res: Response) {
    const userId = req.user!.id;
    const goal = await SavingsService.createSavingsGoal(userId, req.body);
    return ApiResponse.success(res, "Savings goal created successfully", goal, 201);
  }

  static async updateSavingsGoal(req: AuthenticatedRequest, res: Response) {
    const userId = req.user!.id;
    const id = req.params.id as string;
    const goal = await SavingsService.updateSavingsGoal(userId, id, req.body);
    return ApiResponse.success(res, "Savings goal updated successfully", goal, 200);
  }

  static async deleteSavingsGoal(req: AuthenticatedRequest, res: Response) {
    const userId = req.user!.id;
    const id = req.params.id as string;
    await SavingsService.deleteSavingsGoal(userId, id);
    return ApiResponse.success(res, "Savings goal deleted successfully", null, 200);
  }
}
