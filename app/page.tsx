"use client";

import LoginPage from "@/components/login-page";
import TwoFAPage from "@/components/two-fa-page";
import DashboardPage from "@/components/dashboard-page";
import TransfersPage from "@/components/transfers-page";
import InvestPage from "@/components/invest-page";
import AnalyticsPage from "@/components/analytics-page";
import SettingsPage from "@/components/settings-page";
import { useAppContext, AppProvider } from "@/app/context/appcontext";

// Optional: a simple spinner for loading
function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function HomeContent() {
  const {
    authStep,
    currentPage,
    userData,
    setAuthStep,
    setCurrentPage,
    handleLogout,
    loading,
  } = useAppContext();

  // Auth flow
  if (authStep !== "authenticated") {
    return authStep === "login" ? (
      <LoginPage
        onLogin={() => setAuthStep("2fa")}
        onNavigateTo2FA={() => setAuthStep("2fa")}
      />
    ) : (
      <TwoFAPage
        onBack={() => setAuthStep("login")}
        onVerify={() => setAuthStep("authenticated")}
      />
    );
  }

  // Loading spinner
  if (loading) return <LoadingSpinner />;

  // Render pages based on currentPage
  switch (currentPage) {
    case "transfers":
      return (
        <TransfersPage onLogout={handleLogout} onNavigate={setCurrentPage} />
      );
    case "invest":
      return <InvestPage onLogout={handleLogout} onNavigate={setCurrentPage} />;
    case "analytics":
      return (
        <AnalyticsPage onLogout={handleLogout} onNavigate={setCurrentPage} />
      );
    case "settings":
      return (
        <SettingsPage onNavigate={setCurrentPage} onLogout={handleLogout} />
      );
    default:
      return (
        <DashboardPage
          data={userData?.user}
          onLogout={handleLogout}
          onNavigate={setCurrentPage}
        />
      );
  }
}

export default function Home() {
  return (
    <AppProvider>
      <HomeContent />
    </AppProvider>
  );
}
