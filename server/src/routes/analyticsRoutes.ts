import { Router } from "express";
import { AnalyticsController } from "../controllers/analyticsController";
import { asyncWrapper } from "../utils/asyncWrapper";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /analytics/summary:
 *   get:
 *     summary: Retrieve total balances and monthly comparisons
 *     tags: [Analytics]
 */
router.get("/summary", asyncWrapper(AnalyticsController.getSummary));
router.get("/category-breakdown", asyncWrapper(AnalyticsController.getCategoryBreakdown));
router.get("/monthly-trends", asyncWrapper(AnalyticsController.getMonthlyTrends));

export default router;
