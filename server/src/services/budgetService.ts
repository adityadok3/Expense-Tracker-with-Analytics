import { prisma } from "../config/prisma";

export class BudgetService {
  static async getBudgets(userId: string) {
    const budgets = await prisma.budget.findMany({
      where: { userId },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });

    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0, 23, 59, 59);

    // Calculate spent amount per budget
    const budgetsWithSpent = await Promise.all(
      budgets.map(async (budget) => {
        let spent = 0;
        if (budget.categoryId) {
          const expenseSum = await prisma.expense.aggregate({
            where: {
              userId,
              categoryId: budget.categoryId,
              date: { gte: startOfMonth, lte: endOfMonth },
            },
            _sum: { amount: true },
          });
          spent = expenseSum._sum.amount || 0;
        } else {
          const expenseSum = await prisma.expense.aggregate({
            where: {
              userId,
              date: { gte: startOfMonth, lte: endOfMonth },
            },
            _sum: { amount: true },
          });
          spent = expenseSum._sum.amount || 0;
        }

        return {
          ...budget,
          spent,
          remaining: Math.max(0, budget.amountLimit - spent),
          percentage: Math.min(100, Math.round((spent / budget.amountLimit) * 100)),
        };
      })
    );

    return budgetsWithSpent;
  }

  static async getBudgetById(userId: string, id: string) {
    const budget = await prisma.budget.findFirst({
      where: { id, userId },
      include: { category: true },
    });
    if (!budget) throw new Error("Budget not found");
    return budget;
  }

  static async createBudget(userId: string, data: any) {
    return prisma.budget.create({
      data: {
        userId,
        categoryId: data.categoryId || null,
        name: data.name,
        amountLimit: data.amountLimit,
        period: data.period || "MONTHLY",
        startDate: data.startDate ? new Date(data.startDate) : new Date(),
        endDate: data.endDate ? new Date(data.endDate) : null,
      },
      include: { category: true },
    });
  }

  static async updateBudget(userId: string, id: string, data: any) {
    await this.getBudgetById(userId, id);
    return prisma.budget.update({
      where: { id },
      data: {
        ...data,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate !== undefined ? (data.endDate ? new Date(data.endDate) : null) : undefined,
      },
      include: { category: true },
    });
  }

  static async deleteBudget(userId: string, id: string) {
    await this.getBudgetById(userId, id);
    await prisma.budget.delete({ where: { id } });
    return true;
  }
}
