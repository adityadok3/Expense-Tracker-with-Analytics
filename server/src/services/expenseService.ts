import { prisma } from "../config/prisma";
import { DateRangeQuery } from "../types";

export class ExpenseService {
  static async getExpenses(userId: string, query: DateRangeQuery) {
    const { startDate, endDate, categoryId, search, page = "1", limit = "10" } = query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const where: any = { userId };

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (search) {
      where.description = { contains: search, mode: "insensitive" };
    }

    const [total, expenses] = await Promise.all([
      prisma.expense.count({ where }),
      prisma.expense.findMany({
        where,
        include: { category: true },
        orderBy: { date: "desc" },
        skip,
        take: limitNum,
      }),
    ]);

    return {
      expenses,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    };
  }

  static async getExpenseById(userId: string, id: string) {
    const expense = await prisma.expense.findFirst({
      where: { id, userId },
      include: { category: true },
    });
    if (!expense) throw new Error("Expense not found");
    return expense;
  }

  static async createExpense(userId: string, data: any) {
    const category = await prisma.category.findFirst({
      where: {
        id: data.categoryId,
        OR: [{ userId }, { isDefault: true }],
      },
    });

    if (!category) throw new Error("Invalid category specified");

    return prisma.expense.create({
      data: {
        userId,
        categoryId: data.categoryId,
        amount: data.amount,
        description: data.description,
        date: data.date ? new Date(data.date) : new Date(),
        receiptUrl: data.receiptUrl,
        isRecurring: data.isRecurring || false,
      },
      include: { category: true },
    });
  }

  static async updateExpense(userId: string, id: string, data: any) {
    await this.getExpenseById(userId, id);

    if (data.categoryId) {
      const category = await prisma.category.findFirst({
        where: { id: data.categoryId, OR: [{ userId }, { isDefault: true }] },
      });
      if (!category) throw new Error("Invalid category specified");
    }

    return prisma.expense.update({
      where: { id },
      data: {
        ...data,
        date: data.date ? new Date(data.date) : undefined,
      },
      include: { category: true },
    });
  }

  static async deleteExpense(userId: string, id: string) {
    await this.getExpenseById(userId, id);
    await prisma.expense.delete({ where: { id } });
    return true;
  }
}
