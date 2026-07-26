import { prisma } from "../config/prisma";
import { DateRangeQuery } from "../types";

export class IncomeService {
  static async getIncomes(userId: string, query: DateRangeQuery) {
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

    const [total, incomes] = await Promise.all([
      prisma.income.count({ where }),
      prisma.income.findMany({
        where,
        include: { category: true },
        orderBy: { date: "desc" },
        skip,
        take: limitNum,
      }),
    ]);

    return {
      incomes,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    };
  }

  static async getIncomeById(userId: string, id: string) {
    const income = await prisma.income.findFirst({
      where: { id, userId },
      include: { category: true },
    });
    if (!income) throw new Error("Income record not found");
    return income;
  }

  static async createIncome(userId: string, data: any) {
    const category = await prisma.category.findFirst({
      where: { id: data.categoryId, OR: [{ userId }, { isDefault: true }] },
    });
    if (!category) throw new Error("Invalid category specified");

    return prisma.income.create({
      data: {
        userId,
        categoryId: data.categoryId,
        amount: data.amount,
        description: data.description,
        date: data.date ? new Date(data.date) : new Date(),
      },
      include: { category: true },
    });
  }

  static async updateIncome(userId: string, id: string, data: any) {
    await this.getIncomeById(userId, id);

    if (data.categoryId) {
      const category = await prisma.category.findFirst({
        where: { id: data.categoryId, OR: [{ userId }, { isDefault: true }] },
      });
      if (!category) throw new Error("Invalid category specified");
    }

    return prisma.income.update({
      where: { id },
      data: {
        ...data,
        date: data.date ? new Date(data.date) : undefined,
      },
      include: { category: true },
    });
  }

  static async deleteIncome(userId: string, id: string) {
    await this.getIncomeById(userId, id);
    await prisma.income.delete({ where: { id } });
    return true;
  }
}
