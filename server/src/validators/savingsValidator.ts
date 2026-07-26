import { z } from "zod";

export const createSavingsGoalSchema = z.object({
  name: z.string().min(1, "Savings goal name is required"),
  targetAmount: z.number().positive("Target amount must be greater than 0"),
  currentAmount: z.number().min(0, "Current amount cannot be negative").optional(),
  targetDate: z.string().optional().nullable(),
  color: z.string().optional(),
});

export const updateSavingsGoalSchema = createSavingsGoalSchema.partial();
