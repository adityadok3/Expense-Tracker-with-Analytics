import { prisma } from "../config/prisma";

export class CategoryService {
  static async getCategories(userId: string) {
    return prisma.category.findMany({
      where: {
        OR: [{ userId }, { isDefault: true }],
      },
      orderBy: { name: "asc" },
    });
  }

  static async getCategoryById(userId: string, id: string) {
    const category = await prisma.category.findFirst({
      where: {
        id,
        OR: [{ userId }, { isDefault: true }],
      },
    });
    if (!category) throw new Error("Category not found");
    return category;
  }

  static async createCategory(userId: string, data: any) {
    return prisma.category.create({
      data: {
        userId,
        name: data.name,
        type: data.type,
        icon: data.icon || "Tag",
        color: data.color || "#3B82F6",
        isDefault: false,
      },
    });
  }

  static async updateCategory(userId: string, id: string, data: any) {
    const category = await this.getCategoryById(userId, id);
    if (category.isDefault) {
      throw new Error("Cannot edit default system categories");
    }

    return prisma.category.update({
      where: { id },
      data,
    });
  }

  static async deleteCategory(userId: string, id: string) {
    const category = await this.getCategoryById(userId, id);
    if (category.isDefault) {
      throw new Error("Cannot delete default system categories");
    }

    await prisma.category.delete({ where: { id } });
    return true;
  }
}
