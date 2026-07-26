import { Response } from "express";
import { ExpenseService } from "../services/expenseService";
import { ApiResponse } from "../utils/apiResponse";
import { AuthenticatedRequest } from "../types";

export class ExpenseController {
  static async getExpenses(req: AuthenticatedRequest, res: Response) {
    const userId = req.user!.id;
    const result = await ExpenseService.getExpenses(userId, req.query);
    return ApiResponse.success(res, "Expenses retrieved successfully", result, 200);
  }

  static async getExpenseById(req: AuthenticatedRequest, res: Response) {
    const userId = req.user!.id;
    const id = req.params.id as string;
    const expense = await ExpenseService.getExpenseById(userId, id);
    return ApiResponse.success(res, "Expense fetched successfully", expense, 200);
  }

  static async createExpense(req: AuthenticatedRequest, res: Response) {
    const userId = req.user!.id;
    let receiptUrl = req.body.receiptUrl;

    if (req.file) {
      receiptUrl = `/uploads/${req.file.filename}`;
    }

    const expense = await ExpenseService.createExpense(userId, { ...req.body, receiptUrl });
    return ApiResponse.success(res, "Expense created successfully", expense, 201);
  }

  static async updateExpense(req: AuthenticatedRequest, res: Response) {
    const userId = req.user!.id;
    const id = req.params.id as string;
    let receiptUrl = req.body.receiptUrl;

    if (req.file) {
      receiptUrl = `/uploads/${req.file.filename}`;
    }

    const data = receiptUrl ? { ...req.body, receiptUrl } : req.body;
    const expense = await ExpenseService.updateExpense(userId, id, data);
    return ApiResponse.success(res, "Expense updated successfully", expense, 200);
  }

  static async deleteExpense(req: AuthenticatedRequest, res: Response) {
    const userId = req.user!.id;
    const id = req.params.id as string;
    await ExpenseService.deleteExpense(userId, id);
    return ApiResponse.success(res, "Expense deleted successfully", null, 200);
  }
}
