"use client";

import {
  Home,
  CreditCard,
  BarChart2,
  PieChart,
  LogOut,
  Settings as SettingsIcon,
} from "lucide-react";
import { useAppContext } from "@/app/context/appcontext";
import { Button } from "@/components/ui/button";

export default function BottomNav() {
  const { currentPage, setCurrentPage, handleLogout } = useAppContext();

  const navItems = [
    { page: "home", label: "Home", icon: <Home className="w-6 h-6" /> },
    {
      page: "transfers",
      label: "Transfers",
      icon: <CreditCard className="w-6 h-6" />,
    },
    {
      page: "invest",
      label: "Invest",
      icon: <BarChart2 className="w-6 h-6" />,
    },
    {
      page: "analytics",
      label: "Analytics",
      icon: <PieChart className="w-6 h-6" />,
    },
    {
      page: "settings",
      label: "Settings",
      icon: <SettingsIcon className="w-6 h-6" />,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-around">
        {navItems.map((item) => (
          <button
            key={item.page}
            onClick={() => setCurrentPage(item.page as any)}
            className={`flex flex-col items-center gap-1 p-2 transition-colors ${
              currentPage === item.page
                ? "text-accent"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {item.icon}
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}

        {/* Optional Logout Button */}
        <Button
          onClick={handleLogout}
          variant="outline"
          className="flex flex-col items-center gap-1 p-2 h-auto"
        >
          <LogOut className="w-6 h-6" />
          <span className="text-xs font-medium">Logout</span>
        </Button>
      </div>
    </nav>
  );
}
