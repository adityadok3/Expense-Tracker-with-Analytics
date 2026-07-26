import { PrismaClient, CategoryType, BudgetPeriod } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Default Categories
  const defaultCategories = [
    { name: "Salary", type: CategoryType.INCOME, icon: "Briefcase", color: "#10B981", isDefault: true },
    { name: "Freelance", type: CategoryType.INCOME, icon: "Laptop", color: "#06B6D4", isDefault: true },
    { name: "Investments", type: CategoryType.INCOME, icon: "TrendingUp", color: "#8B5CF6", isDefault: true },
    { name: "Housing & Rent", type: CategoryType.EXPENSE, icon: "Home", color: "#EF4444", isDefault: true },
    { name: "Food & Groceries", type: CategoryType.EXPENSE, icon: "ShoppingBag", color: "#F59E0B", isDefault: true },
    { name: "Utilities & Bills", type: CategoryType.EXPENSE, icon: "Zap", color: "#3B82F6", isDefault: true },
    { name: "Transportation", type: CategoryType.EXPENSE, icon: "Car", color: "#EC4899", isDefault: true },
    { name: "Entertainment", type: CategoryType.EXPENSE, icon: "Film", color: "#6366F1", isDefault: true },
    { name: "Healthcare", type: CategoryType.EXPENSE, icon: "Activity", color: "#14B8A6", isDefault: true },
    { name: "Education", type: CategoryType.EXPENSE, icon: "BookOpen", color: "#84CC16", isDefault: true },
  ];

  for (const cat of defaultCategories) {
    const existing = await prisma.category.findFirst({
      where: { name: cat.name, isDefault: true },
    });

    if (!existing) {
      await prisma.category.create({
        data: cat,
      });
    }
  }

  // Demo User
  const demoEmail = "demo@example.com";
  let demoUser = await prisma.user.findUnique({
    where: { email: demoEmail },
  });

  if (!demoUser) {
    const hashedPassword = await bcrypt.hash("Password123!", 10);
    demoUser = await prisma.user.create({
      data: {
        email: demoEmail,
        password: hashedPassword,
        name: "Alex Johnson",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      },
    });
    console.log("Created demo user: demo@example.com / Password123!");

    // Get categories for demo data
    const categories = await prisma.category.findMany();
    const salaryCat = categories.find((c) => c.name === "Salary");
    const freelanceCat = categories.find((c) => c.name === "Freelance");
    const foodCat = categories.find((c) => c.name === "Food & Groceries");
    const housingCat = categories.find((c) => c.name === "Housing & Rent");
    const utilCat = categories.find((c) => c.name === "Utilities & Bills");
    const transportCat = categories.find((c) => c.name === "Transportation");
    const entCat = categories.find((c) => c.name === "Entertainment");

    // Add Incomes
    if (salaryCat) {
      await prisma.income.create({
        data: {
          userId: demoUser.id,
          categoryId: salaryCat.id,
          amount: 4500,
          description: "Monthly Software Engineer Salary",
          date: new Date(),
        },
      });
      await prisma.income.create({
        data: {
          userId: demoUser.id,
          categoryId: salaryCat.id,
          amount: 4500,
          description: "Monthly Software Engineer Salary",
          date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      });
    }

    if (freelanceCat) {
      await prisma.income.create({
        data: {
          userId: demoUser.id,
          categoryId: freelanceCat.id,
          amount: 850,
          description: "Web Design Project for Client",
          date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
        },
      });
    }

    // Add Expenses
    if (housingCat) {
      await prisma.expense.create({
        data: {
          userId: demoUser.id,
          categoryId: housingCat.id,
          amount: 1400,
          description: "Apartment Rent",
          date: new Date(),
          isRecurring: true,
        },
      });
    }

    if (foodCat) {
      await prisma.expense.create({
        data: {
          userId: demoUser.id,
          categoryId: foodCat.id,
          amount: 320,
          description: "Weekly Organic Groceries",
          date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        },
      });
      await prisma.expense.create({
        data: {
          userId: demoUser.id,
          categoryId: foodCat.id,
          amount: 85,
          description: "Dinner with Team",
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      });
    }

    if (utilCat) {
      await prisma.expense.create({
        data: {
          userId: demoUser.id,
          categoryId: utilCat.id,
          amount: 145,
          description: "High-speed Fiber Internet & Electricity",
          date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        },
      });
    }

    if (transportCat) {
      await prisma.expense.create({
        data: {
          userId: demoUser.id,
          categoryId: transportCat.id,
          amount: 60,
          description: "Metro Commuter Pass",
          date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        },
      });
    }

    if (entCat) {
      await prisma.expense.create({
        data: {
          userId: demoUser.id,
          categoryId: entCat.id,
          amount: 45,
          description: "Movie Tickets & Snacks",
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        },
      });
    }

    // Add Budgets
    if (foodCat) {
      await prisma.budget.create({
        data: {
          userId: demoUser.id,
          categoryId: foodCat.id,
          name: "Food & Dining Budget",
          amountLimit: 600,
          period: BudgetPeriod.MONTHLY,
        },
      });
    }

    if (housingCat) {
      await prisma.budget.create({
        data: {
          userId: demoUser.id,
          categoryId: housingCat.id,
          name: "Housing & Living Budget",
          amountLimit: 1600,
          period: BudgetPeriod.MONTHLY,
        },
      });
    }

    // Add Savings Goals
    await prisma.savingsGoal.create({
      data: {
        userId: demoUser.id,
        name: "Emergency Fund",
        targetAmount: 10000,
        currentAmount: 4500,
        targetDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
        color: "#10B981",
      },
    });

    await prisma.savingsGoal.create({
      data: {
        userId: demoUser.id,
        name: "New M3 MacBook Pro",
        targetAmount: 2500,
        currentAmount: 1200,
        targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        color: "#3B82F6",
      },
    });
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
