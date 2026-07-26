export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt?: string;
}

export interface Category {
  id: string;
  name: string;
  type: "EXPENSE" | "INCOME";
  icon: string;
  color: string;
  isDefault: boolean;
}

export interface Expense {
  id: string;
  userId: string;
  categoryId: string;
  category: Category;
  amount: number;
  description: string;
  date: string;
  receiptUrl?: string;
  isRecurring: boolean;
  createdAt: string;
}

export interface Income {
  id: string;
  userId: string;
  categoryId: string;
  category: Category;
  amount: number;
  description: string;
  date: string;
  createdAt: string;
}

export interface Budget {
  id: string;
  userId: string;
  categoryId?: string;
  category?: Category;
  name: string;
  amountLimit: number;
  spent: number;
  remaining: number;
  percentage: number;
  period: "MONTHLY" | "YEARLY" | "WEEKLY";
  startDate: string;
  endDate?: string;
}

export interface SavingsGoal {
  id: string;
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate?: string;
  color: string;
}

export interface AnalyticsSummary {
  currentMonth: {
    income: number;
    expenses: number;
    netSavings: number;
    savingsRate: number;
  };
  comparison: {
    expenseChangePercent: number;
    incomeChangePercent: number;
  };
  allTime: {
    totalBalance: number;
    totalIncome: number;
    totalExpenses: number;
  };
}

export interface CategoryBreakdown {
  name: string;
  amount: number;
  color: string;
}

export interface MonthlyTrend {
  month: string;
  income: number;
  expenses: number;
  savings: number;
}

export interface AIInsightResponse {
  summary: string;
  suggestions: string[];
  budgetAdvice: string;
  monthlyReport: string;
}
