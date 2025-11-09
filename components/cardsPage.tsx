"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CreditCard,
  Lock,
  Unlock,
  Plus,
  Eye,
  EyeOff,
  Shield,
  Star,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

// Card Item Type
export interface CardItem {
  id: number;
  type: string;
  number: string;
  balance: number;
  status: "active" | "locked";
  gradient?: string;
}

// Card templates object for reuse
export const cardTemplates: CardItem[] = [
  {
    id: 1,
    type: "Black Titanium",
    number: "1234567890123456",
    balance: 12000,
    status: "active",
    gradient: "from-purple-600 via-pink-500 to-rose-500",
  },
  {
    id: 2,
    type: "Emerald Card",
    number: "9876543210987654",
    balance: 8000,
    status: "locked",
    gradient: "from-emerald-500 via-teal-500 to-cyan-600",
  },
  // Add more predefined cards here
];

interface CardsComponentProps {
  cards?: CardItem[];
  onAddCard?: () => void;
  onToggleCardStatus?: (cardId: number) => void;
}

const defaultGradients = [
  "from-purple-600 via-pink-500 to-rose-500",
  "from-emerald-500 via-teal-500 to-cyan-600",
  "from-amber-500 via-orange-500 to-red-600",
  "from-indigo-600 via-blue-600 to-cyan-500",
  "from-slate-700 via-zinc-800 to-neutral-900",
];

export default function CardsComponent({
  cards = cardTemplates,
  onAddCard,
  onToggleCardStatus,
}: CardsComponentProps) {
  const [showBalance, setShowBalance] = useState<Record<number, boolean>>({});
  const [selectedCard, setSelectedCard] = useState<CardItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const toggleBalance = (cardId: number) => {
    setShowBalance((prev) => ({ ...prev, [cardId]: !prev[cardId] }));
  };

  const handleToggleStatus = (card: CardItem) => {
    if (onToggleCardStatus) onToggleCardStatus(card.id);
    setSelectedCard(card);
    setIsDialogOpen(true);
  };

  const formatBalance = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-8 p-2 pb-12 bg-gradient-to-br from-slate-50 via-white to-blue-50 min-h-screen">
      {/* Add New Card */}
      <Card
        onClick={onAddCard}
        className="group relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black border-0 shadow-2xl cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-3xl"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <CardContent className="relative flex items-center justify-center gap-4 py-12">
          <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg transform transition-transform group-hover:rotate-12 group-hover:scale-110">
            <Plus className="w-8 h-8 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-xl">Issue Premium Card</p>
            <p className="text-gray-400 text-sm">
              Black Titanium • Unlimited • 0% FX
            </p>
          </div>
          <Star className="w-6 h-6 text-yellow-400 absolute top-4 right-4 animate-pulse" />
        </CardContent>
      </Card>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {cards.map((card, index) => {
          const gradient =
            card.gradient || defaultGradients[index % defaultGradients.length];
          const isBalanceVisible = showBalance[card.id] ?? true;

          return (
            <div
              key={card.id}
              className="group relative transform transition-all duration-500 hover:-translate-y-2"
            >
              {/* Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-700" />

              {/* Main Card */}
              <Card
                className={cn(
                  "relative overflow-hidden border-0 shadow-xl text-white h-56 rounded-2xl",
                  "bg-gradient-to-br",
                  gradient
                )}
              >
                {/* Chip */}
                <div className="absolute top-4 right-4 w-10 h-8 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-lg shadow-inner flex items-center justify-center">
                  <div className="w-7 h-5 bg-gradient-to-br from-yellow-300 to-amber-500 rounded" />
                </div>

                <CardHeader className="relative z-10 pb-2 px-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg font-bold tracking-wide flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        {card.type}
                      </CardTitle>
                      <p className="text-white/70 text-xs mt-1">
                        •••• {card.number.slice(-4)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleToggleStatus(card)}
                      className="p-2 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all duration-300 hover:scale-110"
                    >
                      {card.status === "active" ? (
                        <Unlock className="w-5 h-5" />
                      ) : (
                        <Lock className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </CardHeader>

                <CardContent className="relative z-10 px-4">
                  <div className="mb-4">
                    <p className="font-mono text-lg tracking-widest drop-shadow-md">
                      {card.number.replace(/(\d{4})/g, "$1 ")}
                    </p>
                  </div>

                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-white/70 text-sm font-medium mb-1">
                        Available Balance
                      </p>
                      <p className="text-2xl font-bold tracking-tight">
                        {isBalanceVisible ? (
                          formatBalance(card.balance)
                        ) : (
                          <span className="tracking-widest">••••••••</span>
                        )}
                      </p>
                    </div>
                    <button
                      onClick={() => toggleBalance(card.id)}
                      className="p-2.5 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-300 hover:scale-110"
                    >
                      {isBalanceVisible ? (
                        <Eye className="w-5 h-5" />
                      ) : (
                        <EyeOff className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <div
                      className={cn(
                        "px-3 py-1 rounded-full text-xs font-semibold",
                        card.status === "active"
                          ? "bg-green-500/20 text-green-300"
                          : "bg-red-500/20 text-red-300"
                      )}
                    >
                      {card.status === "active" ? "● Active" : "● Locked"}
                    </div>
                    <CreditCard className="w-4 h-4 opacity-60" />
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
}
