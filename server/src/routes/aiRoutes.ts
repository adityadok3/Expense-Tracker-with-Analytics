import { Router } from "express";
import { AIController } from "../controllers/aiController";
import { asyncWrapper } from "../utils/asyncWrapper";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /ai/insights:
 *   get:
 *     summary: Generate AI financial advice and insights using Google Generative AI
 *     tags: [AI Financial Advisor]
 */
router.get("/insights", asyncWrapper(AIController.getInsights));

export default router;
