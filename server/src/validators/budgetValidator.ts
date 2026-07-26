import { z } from "zod";

export const createBudgetSchema = z.object({
  categoryId: z.string().uuid("Invalid category ID").optional().nullable(),
  name: z.string().min(1, "Budget name is required"),
  amountLimit: z.number().positive("Amount limit must be greater than 0"),
  period: z.enum(["MONTHLY", "YEARLY", "WEEKLY"]).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional().nullable(),
});

export const updateBudgetSchema = createBudgetSchema.partial();
