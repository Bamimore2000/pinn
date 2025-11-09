"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Send,
  Plus,
  Eye,
  EyeOff,
  LogOut,
  TrendingDown,
  TrendingUp,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react";
import TransactionDetailDrawer from "./transaction-detail-drawer";
import { TransactionItem } from "./transaction-detail-drawer";
import { mockTransactions } from "./data";

import { TransactionHistory } from "./transaction-detail-drawer";
import CardsComponent, { CardItem } from "./cardsPage";
import { toast } from "sonner";
import Image from "next/image";
import BottomNav from "./bottomNav";
interface DashboardPageProps {
  onLogout: () => void;
  onNavigate: (page: "home" | "transfers" | "invest" | "analytics") => void;
  data?: Record<string, any>;
}

const mockSpendingData = [
  { month: "Aug", amount: 145000, income: 320000 },
  { month: "Sep", amount: 168000, income: 340000 },
  { month: "Oct", amount: 157000, income: 335000 },
  { month: "Nov", amount: 174000, income: 360000 },
];

const mockCategoryData = [
  { name: "Luxury Travel", value: 72000, color: "#10B981" }, // Green
  { name: "Fine Dining", value: 42000, color: "#3B82F6" }, // Blue
  { name: "Entertainment", value: 35000, color: "#8B5CF6" }, // Purple
  { name: "Real Estate & Utilities", value: 25000, color: "#F59E0B" }, // Amber
  { name: "Charity & Donations", value: 18000, color: "#EF4444" }, // Red
  { name: "Personal Staff", value: 30000, color: "#EC4899" }, // Pink
];

export default function DashboardPage({
  onLogout,
  onNavigate,
  data,
}: DashboardPageProps) {
  const [showBalance, setShowBalance] = useState(true);
  const [isCardsDrawerOpen, setIsCardsDrawerOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<CardItem | null>(null);
  const mockCards: CardItem[] = [
    {
      id: 1,
      type: "Visa Platinum",
      number: "•••• 1534",
      balance: 252300,
      status: "active",
    },
    {
      id: 2,
      type: "MasterCard Gold",
      number: "•••• 5128",
      balance: 271250,
      status: "locked",
    },
    {
      id: 3,
      type: "Amex Green",
      number: "•••• 9012",
      balance: 131200,
      status: "active",
    },
  ];

  console.log("User Data in DashboardPage:", data);

  const [selectedTransaction, setSelectedTransaction] = useState<
    (typeof mockTransactions)[0] | null
  >(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showAllTransactions, setShowAllTransactions] = useState(false);

  const handleCardClick = (card: CardItem) => {
    setSelectedCard(card);
    setIsCardsDrawerOpen(true);
  };

  const balance = 912458.37;
  const hours = new Date().getHours();
  const greeting =
    hours < 12
      ? "Good Morning"
      : hours < 18
      ? "Good Afternoon"
      : "Good Evening";

  const localeDate = new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date());
  const monthlySpending = mockTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const handleTransactionClick = (
    transaction: (typeof mockTransactions)[0]
  ) => {
    setSelectedTransaction(transaction);
    setShowAllTransactions(false);
    setIsDrawerOpen(true);
  };

  const handleViewAll = () => {
    setSelectedTransaction(null);
    setShowAllTransactions(true);
    setIsDrawerOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary">
              <span className="text-primary-foreground font-bold">
                <Image
                  width={400}
                  height={100}
                  alt="hello"
                  src="/pinnacle.png"
                />
              </span>
            </div>
            <h1 className="text-xl font-bold text-foreground">Pinnacle Bank</h1>
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
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            {greeting},{" "}
            {data?.firstName || data?.lastName
              ? `${data?.firstName ?? ""} ${data?.lastName ?? ""}`.trim()
              : "User"}
            !
          </h2>
          <p className="text-muted-foreground">
            Here's your financial overview
          </p>
        </div>

        {/* Account Balance Card */}
        <Card className="mb-6 bg-primary text-primary-foreground shadow-lg border-0">
          <CardContent className="pt-8 pb-8">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-primary-foreground/80 text-sm mb-2">
                  Total Balance
                </p>
                <div className="flex items-center gap-3">
                  <h3 className="text-4xl font-bold tracking-tight">
                    {showBalance
                      ? `$${Number(balance.toFixed(2)).toLocaleString()}`
                      : "••••••"}
                  </h3>
                  <button
                    onClick={() => setShowBalance(!showBalance)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    {showBalance ? (
                      <Eye className="w-5 h-5" />
                    ) : (
                      <EyeOff className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
              <Wallet className="w-12 h-12 opacity-80" />
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Button
            onClick={() => onNavigate("transfers")}
            className="h-16 flex flex-col items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg"
          >
            <Send className="w-5 h-5" />
            <span className="text-xs font-medium">Send Money</span>
          </Button>
          <Button
            onClick={() => {
              toast("Try Again!", {
                description: "Service unavailable at the moment.",
              });
            }}
            variant="outline"
            className="h-16 flex flex-col items-center justify-center gap-2 rounded-lg bg-transparent"
          >
            <Plus className="w-5 h-5" />
            <span className="text-xs font-medium">Add Money</span>
          </Button>
          <Button
            onClick={() => onNavigate("invest")}
            variant="outline"
            className="h-16 flex flex-col items-center justify-center gap-2 rounded-lg bg-transparent"
          >
            <TrendingUp className="w-5 h-5" />
            <span className="text-xs font-medium">Invest</span>
          </Button>
          <Button
            variant="outline"
            className="h-16 flex flex-col items-center justify-center gap-2 rounded-lg bg-transparent"
          >
            <Wallet className="w-5 h-5" />
            <span
              onClick={() => setIsCardsDrawerOpen(true)}
              className="text-xs font-medium"
            >
              Cards
            </span>
          </Button>
        </div>

        {/* Enhanced Stats Grid with Better Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Income vs Spending Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">
                Income vs Spending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart
                  data={mockSpendingData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="colorIncome"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="hsl(var(--color-chart-1))"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor="hsl(var(--color-chart-1))"
                        stopOpacity={0}
                      />
                    </linearGradient>
                    <linearGradient
                      id="colorSpending"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="hsl(var(--color-chart-2))"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor="hsl(var(--color-chart-2))"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--color-border)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    stroke="var(--color-muted-foreground)"
                    style={{ fontSize: "12px" }}
                  />
                  <YAxis
                    stroke="var(--color-muted-foreground)"
                    style={{ fontSize: "12px" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "0.5rem",
                      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    }}
                    formatter={(value) => `$${value}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="income"
                    stroke="hsl(var(--color-chart-1))"
                    fillOpacity={1}
                    fill="url(#colorIncome)"
                    name="Income"
                  />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="hsl(var(--color-chart-2))"
                    fillOpacity={1}
                    fill="url(#colorSpending)"
                    name="Spending"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Spending by Category */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">
                Spending by Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
                <div className="w-full md:w-auto flex justify-center">
                  <ResponsiveContainer width={180} height={220}>
                    <PieChart>
                      <Pie
                        data={mockCategoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                        startAngle={90}
                        endAngle={-270}
                      >
                        {mockCategoryData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.color}
                            stroke="white"
                            strokeWidth={2}
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-full md:w-auto flex flex-col justify-center gap-4">
                  {mockCategoryData.map((category, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 whitespace-nowrap"
                    >
                      <div
                        className="w-4 h-4 rounded-full flex-shrink-0 border border-white/20"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="text-sm text-muted-foreground flex-1">
                        {category.name}
                      </span>
                      <span className="text-sm font-semibold text-foreground ml-4">
                        ${category.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transaction History */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">
                Recent Transactions
              </CardTitle>
              <button
                onClick={handleViewAll}
                className="text-sm text-accent hover:underline font-medium"
              >
                View All
              </button>
            </div>
          </CardHeader>
          <CardContent className="px-3">
            <div className="space-y-1">
              {mockTransactions.map((transaction) => (
                <button
                  key={transaction.id}
                  onClick={() => handleTransactionClick(transaction)}
                  className="w-full flex items-center justify-between p-2 hover:bg-muted rounded-lg transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        transaction.type === "income"
                          ? "bg-green-100"
                          : "bg-muted"
                      }`}
                    >
                      {transaction.type === "income" ? (
                        <ArrowDownLeft className="w-5 h-5 text-green-600" />
                      ) : (
                        <ArrowUpRight className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-sm">
                        {transaction.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {transaction.merchant}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-semibold text-sm ${
                        transaction.type === "income"
                          ? "text-green-600"
                          : "text-foreground"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : ""}$
                      {Math.abs(transaction.amount).toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {transaction.date}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Bottom Navigation */}
      <BottomNav />

      {/* Transaction Detail Drawer Component */}
      <TransactionDetailDrawer
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedTransaction(null);
          setShowAllTransactions(false);
        }}
        title={showAllTransactions ? "All Transactions" : "Transaction Details"}
      >
        {showAllTransactions ? (
          <TransactionHistory
            transactions={mockTransactions}
            onTransactionClick={handleTransactionClick}
          />
        ) : selectedTransaction ? (
          <TransactionItem transaction={selectedTransaction} />
        ) : null}
      </TransactionDetailDrawer>

      <TransactionDetailDrawer
        isOpen={isCardsDrawerOpen}
        onClose={() => {
          setIsCardsDrawerOpen(false);
          setSelectedCard(null);
        }}
        title={selectedCard ? selectedCard.type : "My Cards"}
      >
        <CardsComponent
          cards={mockCards}
          onAddCard={() => console.log("Add card clicked")}
          onToggleCardStatus={(cardId) =>
            console.log("Toggle card status", cardId)
          }
        />
      </TransactionDetailDrawer>
    </div>
  );
}
