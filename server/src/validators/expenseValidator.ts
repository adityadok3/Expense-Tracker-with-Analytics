import { z } from "zod";

export const createExpenseSchema = z.object({
  categoryId: z.string().uuid("Invalid category ID"),

  amount: z.coerce
    .number()
    .positive("Amount must be greater than 0"),

  description: z.string().min(1, "Description is required"),

  date: z.string().optional(),

  receiptUrl: z.string().optional(),

  isRecurring: z.coerce.boolean().optional(),
});

export const updateExpenseSchema = createExpenseSchema.partial();
