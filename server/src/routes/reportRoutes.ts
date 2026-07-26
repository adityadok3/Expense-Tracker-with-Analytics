import { Router } from "express";
import { ReportController } from "../controllers/reportController";
import { asyncWrapper } from "../utils/asyncWrapper";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /reports/monthly-pdf:
 *   get:
 *     summary: Download branded monthly PDF statement
 *     tags: [Reports]
 */
router.get("/monthly-pdf", asyncWrapper(ReportController.downloadMonthlyPDF));

export default router;
