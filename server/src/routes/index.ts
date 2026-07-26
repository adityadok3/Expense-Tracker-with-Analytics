import { Router } from "express";
import authRoutes from "./authRoutes";
import expenseRoutes from "./expenseRoutes";
import incomeRoutes from "./incomeRoutes";
import budgetRoutes from "./budgetRoutes";
import savingsRoutes from "./savingsRoutes";
import categoryRoutes from "./categoryRoutes";
import analyticsRoutes from "./analyticsRoutes";
import aiRoutes from "./aiRoutes";
import reportRoutes from "./reportRoutes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/expenses", expenseRoutes);
router.use("/income", incomeRoutes);
router.use("/budgets", budgetRoutes);
router.use("/savings-goals", savingsRoutes);
router.use("/categories", categoryRoutes);
router.use("/analytics", analyticsRoutes);
router.use("/ai", aiRoutes);
router.use("/reports", reportRoutes);

export default router;
