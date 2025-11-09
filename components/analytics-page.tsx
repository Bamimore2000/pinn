"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, LogOut, TrendingDown, TrendingUp } from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import BottomNav from "./bottomNav";

interface AnalyticsPageProps {
  onLogout: () => void;
  onNavigate: (page: "home" | "transfers" | "invest" | "analytics") => void;
}

const monthlyData = [
  { month: "Jan", income: 500034, expenses: 3200, savings: 1800 },
  { month: "Feb", income: 523200, expenses: 3400, savings: 1800 },
  { month: "Mar", income: 522000, expenses: 3100, savings: 1900 },
  { month: "Apr", income: 553400, expenses: 3300, savings: 2200 },
  { month: "May", income: 533400, expenses: 31250, savings: 2150 },
  { month: "Jun", income: 582300, expenses: 35300, savings: 2300 },
  { month: "Jul", income: 602100, expenses: 34020, savings: 2600 },
];

const categoryData = [
  { name: "Food & Dining", value: 120300, color: "#f59e0b" },
  { name: "Transportation", value: 8590, color: "#3b82f6" },
  { name: "Entertainment", value: 4020, color: "#ec4899" },
  { name: "Utilities", value: 5780, color: "#10b981" },
  { name: "Other", value: 34450, color: "#8b5cf6" },
];

export default function AnalyticsPage({
  onLogout,
  onNavigate,
}: AnalyticsPageProps) {
  const totalIncome = monthlyData.reduce((sum, m) => sum + m.income, 0);
  const totalExpenses = monthlyData.reduce((sum, m) => sum + m.expenses, 0);
  const totalSavings = monthlyData.reduce((sum, m) => sum + m.savings, 0);
  const avgMonthlySpend = (totalExpenses / monthlyData.length).toFixed(2);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate("home")}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                Financial Analytics
              </h1>
              <p className="text-xs text-muted-foreground">
                Track your spending patterns
              </p>
            </div>
          </div>
          <Button
            onClick={onLogout}
            variant="outline"
            className="h-10 text-sm bg-transparent"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 pb-32">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Total Income
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    ${(totalIncome / 1000).toFixed(1)}k
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Total Expenses
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    ${(totalExpenses / 1000).toFixed(1)}k
                  </p>
                </div>
                <TrendingDown className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Total Saved
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    ${(totalSavings / 1000).toFixed(1)}k
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Monthly Avg
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    ${avgMonthlySpend}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                  <span className="text-sm font-bold text-muted-foreground">
                    $
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Income vs Expenses Trend */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Income vs Expenses Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--color-border)"
                />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
                <YAxis stroke="var(--color-muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "0.5rem",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Income"
                />
                <Line
                  type="monotone"
                  dataKey="expenses"
                  stroke="#ef4444"
                  strokeWidth={2}
                  name="Expenses"
                />
                <Line
                  type="monotone"
                  dataKey="savings"
                  stroke="var(--color-accent)"
                  strokeWidth={2}
                  name="Savings"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Monthly Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Monthly Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={monthlyData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--color-border)"
                  />
                  <XAxis
                    dataKey="month"
                    stroke="var(--color-muted-foreground)"
                  />
                  <YAxis stroke="var(--color-muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "0.5rem",
                    }}
                  />
                  <Bar dataKey="income" fill="#10b981" radius={[8, 8, 0, 0]} />
                  <Bar
                    dataKey="expenses"
                    fill="#ef4444"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Spending by Category */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Spending by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "0.5rem",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Category Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Expense Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryData.map((category, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 hover:bg-muted rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <p className="font-medium text-foreground">
                      {category.name}
                    </p>
                  </div>
                  <p className="font-bold text-foreground">
                    ${category.value.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
