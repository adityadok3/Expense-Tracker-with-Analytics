import { prisma } from "../config/prisma";

export class AnalyticsService {
  static async getSummary(userId: string) {
    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfCurrentMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

    // Current Month Totals
    const currentMonthExpenses = await prisma.expense.aggregate({
      where: { userId, date: { gte: startOfCurrentMonth, lte: endOfCurrentMonth } },
      _sum: { amount: true },
    });

    const currentMonthIncome = await prisma.income.aggregate({
      where: { userId, date: { gte: startOfCurrentMonth, lte: endOfCurrentMonth } },
      _sum: { amount: true },
    });

    // Last Month Totals
    const lastMonthExpenses = await prisma.expense.aggregate({
      where: { userId, date: { gte: startOfLastMonth, lte: endOfLastMonth } },
      _sum: { amount: true },
    });

    const lastMonthIncome = await prisma.income.aggregate({
      where: { userId, date: { gte: startOfLastMonth, lte: endOfLastMonth } },
      _sum: { amount: true },
    });

    // All Time Totals
    const totalExpenses = await prisma.expense.aggregate({
      where: { userId },
      _sum: { amount: true },
    });

    const totalIncome = await prisma.income.aggregate({
      where: { userId },
      _sum: { amount: true },
    });

    const currentExpenseSum = currentMonthExpenses._sum.amount || 0;
    const currentIncomeSum = currentMonthIncome._sum.amount || 0;
    const lastExpenseSum = lastMonthExpenses._sum.amount || 0;
    const lastIncomeSum = lastMonthIncome._sum.amount || 0;

    const expenseChangePercent = lastExpenseSum === 0 ? 0 : Math.round(((currentExpenseSum - lastExpenseSum) / lastExpenseSum) * 100);
    const incomeChangePercent = lastIncomeSum === 0 ? 0 : Math.round(((currentIncomeSum - lastIncomeSum) / lastIncomeSum) * 100);

    const totalBalance = (totalIncome._sum.amount || 0) - (totalExpenses._sum.amount || 0);

    return {
      currentMonth: {
        income: currentIncomeSum,
        expenses: currentExpenseSum,
        netSavings: currentIncomeSum - currentExpenseSum,
        savingsRate: currentIncomeSum > 0 ? Math.round(((currentIncomeSum - currentExpenseSum) / currentIncomeSum) * 100) : 0,
      },
      comparison: {
        expenseChangePercent,
        incomeChangePercent,
      },
      allTime: {
        totalBalance,
        totalIncome: totalIncome._sum.amount || 0,
        totalExpenses: totalExpenses._sum.amount || 0,
      },
    };
  }

  static async getCategoryBreakdown(userId: string) {
    const expenses = await prisma.expense.findMany({
      where: { userId },
      include: { category: true },
    });

    const categoryMap: { [key: string]: { name: string; amount: number; color: string } } = {};

    for (const exp of expenses) {
      const catName = exp.category.name;
      if (!categoryMap[catName]) {
        categoryMap[catName] = {
          name: catName,
          amount: 0,
          color: exp.category.color,
        };
      }
      categoryMap[catName].amount += exp.amount;
    }

    return Object.values(categoryMap).sort((a, b) => b.amount - a.amount);
  }

  static async getMonthlyTrends(userId: string, monthsCount: number = 6) {
    const result = [];
    const now = new Date();

    for (let i = monthsCount - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);

      const [expAgg, incAgg] = await Promise.all([
        prisma.expense.aggregate({
          where: { userId, date: { gte: startOfMonth, lte: endOfMonth } },
          _sum: { amount: true },
        }),
        prisma.income.aggregate({
          where: { userId, date: { gte: startOfMonth, lte: endOfMonth } },
          _sum: { amount: true },
        }),
      ]);

      const monthName = date.toLocaleString("default", { month: "short", year: "2-digit" });
      const expenses = expAgg._sum.amount || 0;
      const income = incAgg._sum.amount || 0;

      result.push({
        month: monthName,
        income,
        expenses,
        savings: income - expenses,
      });
    }

    return result;
  }
}
