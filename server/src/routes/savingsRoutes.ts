import { Router } from "express";
import { SavingsController } from "../controllers/savingsController";
import { asyncWrapper } from "../utils/asyncWrapper";
import { authenticate } from "../middleware/authMiddleware";
import { validate } from "../middleware/validateMiddleware";
import { createSavingsGoalSchema, updateSavingsGoalSchema } from "../validators/savingsValidator";

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /savings-goals:
 *   get:
 *     summary: Retrieve savings goals
 *     tags: [Savings]
 */
router.get("/", asyncWrapper(SavingsController.getSavingsGoals));
router.get("/:id", asyncWrapper(SavingsController.getSavingsGoalById));
router.post("/", validate(createSavingsGoalSchema), asyncWrapper(SavingsController.createSavingsGoal));
router.put("/:id", validate(updateSavingsGoalSchema), asyncWrapper(SavingsController.updateSavingsGoal));
router.delete("/:id", asyncWrapper(SavingsController.deleteSavingsGoal));

export default router;
