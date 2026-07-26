import { Router } from "express";
import { IncomeController } from "../controllers/incomeController";
import { asyncWrapper } from "../utils/asyncWrapper";
import { authenticate } from "../middleware/authMiddleware";
import { validate } from "../middleware/validateMiddleware";
import { createIncomeSchema, updateIncomeSchema } from "../validators/incomeValidator";

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /income:
 *   get:
 *     summary: Retrieve paginated income list
 *     tags: [Income]
 *   post:
 *     summary: Create a new income entry
 *     tags: [Income]
 */
router.get("/", asyncWrapper(IncomeController.getIncomes));
router.get("/:id", asyncWrapper(IncomeController.getIncomeById));
router.post("/", validate(createIncomeSchema), asyncWrapper(IncomeController.createIncome));
router.put("/:id", validate(updateIncomeSchema), asyncWrapper(IncomeController.updateIncome));
router.delete("/:id", asyncWrapper(IncomeController.deleteIncome));

export default router;
