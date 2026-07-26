import { Response } from "express";
import { BudgetService } from "../services/budgetService";
import { ApiResponse } from "../utils/apiResponse";
import { AuthenticatedRequest } from "../types";

export class BudgetController {
  static async getBudgets(req: AuthenticatedRequest, res: Response) {
    const userId = req.user!.id;
    const budgets = await BudgetService.getBudgets(userId);
    return ApiResponse.success(res, "Budgets retrieved successfully", budgets, 200);
  }

  static async getBudgetById(req: AuthenticatedRequest, res: Response) {
    const userId = req.user!.id;
    const id = req.params.id as string;
    const budget = await BudgetService.getBudgetById(userId, id);
    return ApiResponse.success(res, "Budget fetched successfully", budget, 200);
  }

  static async createBudget(req: AuthenticatedRequest, res: Response) {
    const userId = req.user!.id;
    const budget = await BudgetService.createBudget(userId, req.body);
    return ApiResponse.success(res, "Budget created successfully", budget, 201);
  }

  static async updateBudget(req: AuthenticatedRequest, res: Response) {
    const userId = req.user!.id;
    const id = req.params.id as string;
    const budget = await BudgetService.updateBudget(userId, id, req.body);
    return ApiResponse.success(res, "Budget updated successfully", budget, 200);
  }

  static async deleteBudget(req: AuthenticatedRequest, res: Response) {
    const userId = req.user!.id;
    const id = req.params.id as string;
    await BudgetService.deleteBudget(userId, id);
    return ApiResponse.success(res, "Budget deleted successfully", null, 200);
  }
}
