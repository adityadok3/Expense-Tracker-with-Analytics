import { prisma } from "../config/prisma";

export class SavingsService {
  static async getSavingsGoals(userId: string) {
    return prisma.savingsGoal.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  static async getSavingsGoalById(userId: string, id: string) {
    const goal = await prisma.savingsGoal.findFirst({
      where: { id, userId },
    });
    if (!goal) throw new Error("Savings goal not found");
    return goal;
  }

  static async createSavingsGoal(userId: string, data: any) {
    return prisma.savingsGoal.create({
      data: {
        userId,
        name: data.name,
        targetAmount: data.targetAmount,
        currentAmount: data.currentAmount || 0,
        targetDate: data.targetDate ? new Date(data.targetDate) : null,
        color: data.color || "#10B981",
      },
    });
  }

  static async updateSavingsGoal(userId: string, id: string, data: any) {
    await this.getSavingsGoalById(userId, id);
    return prisma.savingsGoal.update({
      where: { id },
      data: {
        ...data,
        targetDate: data.targetDate !== undefined ? (data.targetDate ? new Date(data.targetDate) : null) : undefined,
      },
    });
  }

  static async deleteSavingsGoal(userId: string, id: string) {
    await this.getSavingsGoalById(userId, id);
    await prisma.savingsGoal.delete({ where: { id } });
    return true;
  }
}
