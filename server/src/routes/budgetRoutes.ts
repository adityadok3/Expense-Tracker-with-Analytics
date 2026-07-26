import { Router } from "express";
import { BudgetController } from "../controllers/budgetController";
import { asyncWrapper } from "../utils/asyncWrapper";
import { authenticate } from "../middleware/authMiddleware";
import { validate } from "../middleware/validateMiddleware";
import { createBudgetSchema, updateBudgetSchema } from "../validators/budgetValidator";

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /budgets:
 *   get:
 *     summary: Retrieve budgets with spent calculations
 *     tags: [Budgets]
 */
router.get("/", asyncWrapper(BudgetController.getBudgets));
router.get("/:id", asyncWrapper(BudgetController.getBudgetById));
router.post("/", validate(createBudgetSchema), asyncWrapper(BudgetController.createBudget));
router.put("/:id", validate(updateBudgetSchema), asyncWrapper(BudgetController.updateBudget));
router.delete("/:id", asyncWrapper(BudgetController.deleteBudget));

export default router;
