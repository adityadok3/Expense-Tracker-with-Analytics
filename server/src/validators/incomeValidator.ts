import { z } from "zod";

export const createIncomeSchema = z.object({
  categoryId: z.string().uuid("Invalid category ID"),
  amount: z.number().positive("Amount must be greater than 0"),
  description: z.string().min(1, "Description is required"),
  date: z.string().optional(),
});

export const updateIncomeSchema = createIncomeSchema.partial();
