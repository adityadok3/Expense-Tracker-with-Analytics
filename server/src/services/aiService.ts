import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "../config/env";
import { AnalyticsService } from "./analyticsService";
import { ExpenseService } from "./expenseService";
import { BudgetService } from "./budgetService";
import { AIInsightResponse } from "../types";

export class AIService {
  static async generateFinancialInsights(userId: string): Promise<AIInsightResponse> {
    const [summary, categoryBreakdown, budgets] = await Promise.all([
      AnalyticsService.getSummary(userId),
      AnalyticsService.getCategoryBreakdown(userId),
      BudgetService.getBudgets(userId),
    ]);

    const promptData = {
      income: summary.currentMonth.income,
      expenses: summary.currentMonth.expenses,
      netSavings: summary.currentMonth.netSavings,
      savingsRate: summary.currentMonth.savingsRate,
      topCategories: categoryBreakdown.slice(0, 5),
      budgets: budgets.map((b) => ({ name: b.name, limit: b.amountLimit, spent: b.spent })),
    };

    if (env.GOOGLE_API_KEY) {
      try {
        const genAI = new GoogleGenerativeAI(env.GOOGLE_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const response = await model.generateContent(
          `You are an expert personal finance advisor AI. Analyze the user's financial metrics below and generate structured json insights:
          
          User Financial Metrics:
          ${JSON.stringify(promptData, null, 2)}
          
          Respond in strict JSON format with keys:
          - summary: Concise 2-sentence overview of spending habits.
          - suggestions: Array of 3 actionable financial advice tips.
          - budgetAdvice: 1 paragraph recommendation regarding current budgets and overspending risks.
          - monthlyReport: Comprehensive monthly financial health overview with actionable targets.`
        );

        const text = response.response.text() || "";
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return {
            summary: parsed.summary || "Your monthly financial profile is stable.",
            suggestions: parsed.suggestions || [
              "Consider automating your savings transfer on payday.",
              "Review recurring subscriptions for potential cancellations.",
              "Aim to maintain an emergency fund covering 3-6 months of living expenses.",
            ],
            budgetAdvice: parsed.budgetAdvice || "Your spending aligns with standard budget allocations.",
            monthlyReport: parsed.monthlyReport || "Financial performance is healthy overall with room for optimization.",
          };
        }
      } catch (err) {
        console.error("Google Generative AI request failed, falling back to heuristic insights:", err);
      }
    }

    // Heuristic Engine Fallback
    const suggestions: string[] = [];
    if (summary.currentMonth.savingsRate < 20) {
      suggestions.push("Your savings rate is currently below 20%. Try reducing discretionary spending to build a stronger safety net.");
    } else {
      suggestions.push("Great job! You are maintaining a healthy savings rate above 20%.");
    }

    if (categoryBreakdown.length > 0) {
      suggestions.push(`Your highest spending category is ${categoryBreakdown[0].name} ($${categoryBreakdown[0].amount.toFixed(2)}). Keep an eye on non-essential purchases here.`);
    }

    const overBudget = budgets.find((b) => b.spent > b.amountLimit);
    if (overBudget) {
      suggestions.push(`Warning: You have exceeded your budget for ${overBudget.name} ($${overBudget.spent} spent vs $${overBudget.amountLimit} limit).`);
    } else {
      suggestions.push("All your tracked budgets are currently within safe spending limits.");
    }

    return {
      summary: `In the current month, you have earned $${summary.currentMonth.income.toFixed(2)} and spent $${summary.currentMonth.expenses.toFixed(2)}, resulting in net savings of $${summary.currentMonth.netSavings.toFixed(2)}.`,
      suggestions,
      budgetAdvice: overBudget
        ? `Attention needed for ${overBudget.name} budget. We recommend reallocating funds from lower priority categories to stay balanced.`
        : "Your current budget limits are well-balanced. Continue tracking daily expenses to maintain positive cashflow.",
      monthlyReport: `Monthly Health Check: Savings rate sits at ${summary.currentMonth.savingsRate}%. Total balance is $${summary.allTime.totalBalance.toFixed(2)}. Maintain your current disciplined trajectory for maximum financial growth.`,
    };
  }
}
