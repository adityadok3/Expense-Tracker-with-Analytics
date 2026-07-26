import { Request } from "express";

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

export interface DateRangeQuery {
  startDate?: string;
  endDate?: string;
  categoryId?: string;
  search?: string;
  page?: string;
  limit?: string;
}

export interface AIInsightResponse {
  summary: string;
  suggestions: string[];
  budgetAdvice: string;
  monthlyReport: string;
}
