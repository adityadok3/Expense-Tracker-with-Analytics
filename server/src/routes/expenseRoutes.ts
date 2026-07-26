import { Router } from "express";
import { ExpenseController } from "../controllers/expenseController";
import { asyncWrapper } from "../utils/asyncWrapper";
import { authenticate } from "../middleware/authMiddleware";
import { upload } from "../middleware/uploadMiddleware";
import { validate } from "../middleware/validateMiddleware";
import { createExpenseSchema, updateExpenseSchema } from "../validators/expenseValidator";

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /expenses:
 *   get:
 *     summary: Retrieve paginated expenses list
 *     tags: [Expenses]
 *   post:
 *     summary: Create a new expense record with optional receipt upload
 *     tags: [Expenses]
 */
router.get("/", asyncWrapper(ExpenseController.getExpenses));
router.get("/:id", asyncWrapper(ExpenseController.getExpenseById));
router.post("/", upload.single("receipt"), validate(createExpenseSchema), asyncWrapper(ExpenseController.createExpense));
router.put("/:id", upload.single("receipt"), validate(updateExpenseSchema), asyncWrapper(ExpenseController.updateExpense));
router.delete("/:id", asyncWrapper(ExpenseController.deleteExpense));

export default router;
