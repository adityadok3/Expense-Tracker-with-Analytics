import { Response } from "express";
import { CategoryService } from "../services/categoryService";
import { ApiResponse } from "../utils/apiResponse";
import { AuthenticatedRequest } from "../types";

export class CategoryController {
  static async getCategories(req: AuthenticatedRequest, res: Response) {
    const userId = req.user!.id;
    const categories = await CategoryService.getCategories(userId);
    return ApiResponse.success(res, "Categories retrieved successfully", categories, 200);
  }

  static async getCategoryById(req: AuthenticatedRequest, res: Response) {
    const userId = req.user!.id;
    const id = req.params.id as string;
    const category = await CategoryService.getCategoryById(userId, id);
    return ApiResponse.success(res, "Category fetched successfully", category, 200);
  }

  static async createCategory(req: AuthenticatedRequest, res: Response) {
    const userId = req.user!.id;
    const category = await CategoryService.createCategory(userId, req.body);
    return ApiResponse.success(res, "Category created successfully", category, 201);
  }

  static async updateCategory(req: AuthenticatedRequest, res: Response) {
    const userId = req.user!.id;
    const id = req.params.id as string;
    const category = await CategoryService.updateCategory(userId, id, req.body);
    return ApiResponse.success(res, "Category updated successfully", category, 200);
  }

  static async deleteCategory(req: AuthenticatedRequest, res: Response) {
    const userId = req.user!.id;
    const id = req.params.id as string;
    await CategoryService.deleteCategory(userId, id);
    return ApiResponse.success(res, "Category deleted successfully", null, 200);
  }
}
