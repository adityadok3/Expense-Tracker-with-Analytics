import { Response } from "express";
import { IncomeService } from "../services/incomeService";
import { ApiResponse } from "../utils/apiResponse";
import { AuthenticatedRequest } from "../types";

export class IncomeController {
  static async getIncomes(req: AuthenticatedRequest, res: Response) {
    const userId = req.user!.id;
    const result = await IncomeService.getIncomes(userId, req.query);
    return ApiResponse.success(res, "Incomes retrieved successfully", result, 200);
  }

  static async getIncomeById(req: AuthenticatedRequest, res: Response) {
    const userId = req.user!.id;
    const id = req.params.id as string;
    const income = await IncomeService.getIncomeById(userId, id);
    return ApiResponse.success(res, "Income fetched successfully", income, 200);
  }

  static async createIncome(req: AuthenticatedRequest, res: Response) {
    const userId = req.user!.id;
    const income = await IncomeService.createIncome(userId, req.body);
    return ApiResponse.success(res, "Income created successfully", income, 201);
  }

  static async updateIncome(req: AuthenticatedRequest, res: Response) {
    const userId = req.user!.id;
    const id = req.params.id as string;
    const income = await IncomeService.updateIncome(userId, id, req.body);
    return ApiResponse.success(res, "Income updated successfully", income, 200);
  }

  static async deleteIncome(req: AuthenticatedRequest, res: Response) {
    const userId = req.user!.id;
    const id = req.params.id as string;
    await IncomeService.deleteIncome(userId, id);
    return ApiResponse.success(res, "Income deleted successfully", null, 200);
  }
}
