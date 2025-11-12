"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Send,
  ArrowLeft,
  LogOut,
  Clock,
  Wallet,
  Building2,
  Zap,
  DollarSign,
  User,
  Mail,
  Phone,
  Hash,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import BottomNav from "./bottomNav";
import { cardTemplates } from "./cardsPage";
import { Recipient } from "@/app/types";
import { initialRecipients } from "@/data/data";

interface TransfersPageProps {
  onLogout: () => void;
  onNavigate: (page: "home" | "transfers" | "invest" | "analytics") => void;
}

const recentTransactions = [
  {
    id: 1,
    recipient: "Olivia Parker",
    amount: 2500,
    date: "Today, 2:30 PM",
    status: "completed",
  },
  {
    id: 2,
    recipient: "Liam Thompson",
    amount: 5000,
    date: "Yesterday, 4:15 PM",
    status: "completed",
  },
  {
    id: 3,
    recipient: "Sophia Martinez",
    amount: 3000,
    date: "Nov 7, 11:20 AM",
    status: "pending",
  },
  {
    id: 4,
    recipient: "Noah Wilson",
    amount: 4500,
    date: "Nov 6, 9:00 AM",
    status: "completed",
  },
  {
    id: 5,
    recipient: "Emma Johnson",
    amount: 2800,
    date: "Nov 5, 1:45 PM",
    status: "completed",
  },
  {
    id: 6,
    recipient: "Aiden Brown",
    amount: 3500,
    date: "Nov 4, 3:20 PM",
    status: "completed",
  },
  {
    id: 7,
    recipient: "Mia Davis",
    amount: 4200,
    date: "Nov 3, 5:10 PM",
    status: "completed",
  },
  {
    id: 8,
    recipient: "James Miller",
    amount: 2500,
    date: "Nov 2, 2:00 PM",
    status: "completed",
  },
  {
    id: 9,
    recipient: "Charlotte Wilson",
    amount: 2000,
    date: "Nov 1, 4:30 PM",
    status: "completed",
  },
  {
    id: 10,
    recipient: "Elijah Anderson",
    amount: 2000,
    date: "Oct 31, 12:15 PM",
    status: "completed",
  },
];

export default function TransfersPage({
  onLogout,
  onNavigate,
}: TransfersPageProps) {
  const [recipients, setRecipients] = useState<Recipient[]>(initialRecipients);
  const [amount, setAmount] = useState("");
  const [selectedRecipient, setSelectedRecipient] = useState<Recipient | null>(
    null
  );
  const [selectedCard, setSelectedCard] = useState<
    (typeof cardTemplates)[0] | null
  >(null);
  const [paymentMethod, setPaymentMethod] = useState<
    "card" | "zelle" | "cashapp" | "bank"
  >("card");
  const [showPinModal, setShowPinModal] = useState(false);
  const [showAddRecipientModal, setShowAddRecipientModal] = useState(false);
  const [pin, setPin] = useState("");
  const [note, setNote] = useState("");

  // Recipient name field (for all payment methods)
  const [recipientName, setRecipientName] = useState("");

  // Zelle fields
  const [zelleEmail, setZelleEmail] = useState("");
  const [zellePhone, setZellePhone] = useState("");

  // CashApp fields
  const [cashappTag, setCashappTag] = useState("");

  // Bank transfer fields
  const [routingNumber, setRoutingNumber] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [bankName, setBankName] = useState("");

  // New recipient form fields
  const [newRecipientName, setNewRecipientName] = useState("");
  const [newRecipientEmail, setNewRecipientEmail] = useState("");
  const [newRecipientPhone, setNewRecipientPhone] = useState("");
  const [newZelleEmail, setNewZelleEmail] = useState("");
  const [newZellePhone, setNewZellePhone] = useState("");
  const [newCashappTag, setNewCashappTag] = useState("");
  const [newBankAccountName, setNewBankAccountName] = useState("");
  const [newBankName, setNewBankName] = useState("");
  const [newRoutingNumber, setNewRoutingNumber] = useState("");
  const [newAccountNumber, setNewAccountNumber] = useState("");
  const [showOwnershipModal, setShowOwnershipModal] = useState(false);

  const handleRecipientSelect = (recipient: Recipient) => {
    setSelectedRecipient(recipient);
    setRecipientName(recipient.name);

    // Prefill bank details if available
    if (recipient.bankAccountName) setAccountName(recipient.bankAccountName);
    if (recipient.bankName) setBankName(recipient.bankName);
    if (recipient.routingNumber) setRoutingNumber(recipient.routingNumber);
    if (recipient.accountNumber) setAccountNumber(recipient.accountNumber);

    // Prefill Zelle details if available
    if (recipient.zelleEmail) setZelleEmail(recipient.zelleEmail);
    if (recipient.zellePhone) setZellePhone(recipient.zellePhone);

    // Prefill CashApp details if available
    if (recipient.cashappTag) setCashappTag(recipient.cashappTag);
  };

  const clearRecipientSelection = () => {
    setSelectedRecipient(null);
    setRecipientName("");
    setZelleEmail("");
    setZellePhone("");
    setCashappTag("");
    setRoutingNumber("");
    setAccountNumber("");
    setAccountName("");
    setBankName("");
  };

  const handleAddRecipient = () => {
    if (!newRecipientName) {
      toast.error("Name Required", {
        description: "Please enter recipient's name",
      });
      return;
    }

    const newRecipient: Recipient = {
      id: Date.now(),
      name: newRecipientName,
      account: `•••• ${Math.floor(1000 + Math.random() * 9000)}`,
      initials: newRecipientName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2),
      email: newRecipientEmail,
      phone: newRecipientPhone,
      zelleEmail: newZelleEmail,
      zellePhone: newZellePhone,
      cashappTag: newCashappTag,
      bankAccountName: newBankAccountName,
      bankName: newBankName,
      routingNumber: newRoutingNumber,
      accountNumber: newAccountNumber,
    };

    setRecipients([...recipients, newRecipient]);
    setShowAddRecipientModal(false);

    // Clear form
    setNewRecipientName("");
    setNewRecipientEmail("");
    setNewRecipientPhone("");
    setNewZelleEmail("");
    setNewZellePhone("");
    setNewCashappTag("");
    setNewBankAccountName("");
    setNewBankName("");
    setNewRoutingNumber("");
    setNewAccountNumber("");

    toast.success("Recipient Added", {
      description: `${newRecipient.name} has been added to your recipients`,
    });
  };

  const handleTransfer = () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Invalid Amount", {
        description: "Please enter a valid amount greater than $0.00",
      });
      return;
    }

    if (!recipientName) {
      toast.error("Recipient Name Required", {
        description: "Please enter the recipient's name",
      });
      return;
    }

    // Validate based on payment method
    if (paymentMethod === "card" && !selectedCard) {
      toast.error("No Card Selected", {
        description: "Please select a source card",
      });
      return;
    }

    if (paymentMethod === "zelle" && !zelleEmail && !zellePhone) {
      toast.error("Missing Zelle Information", {
        description: "Please enter either an email or phone number",
      });
      return;
    }

    if (paymentMethod === "cashapp" && !cashappTag) {
      toast.error("Missing CashApp Tag", {
        description: "Please enter a CashApp $tag",
      });
      return;
    }

    if (
      paymentMethod === "bank" &&
      (!routingNumber || !accountNumber || !accountName)
    ) {
      toast.error("Missing Bank Information", {
        description: "Please fill in all required bank details",
      });
      return;
    }

    setShowPinModal(true);
  };

  const handlePinSubmit = () => {
    if (pin === "9900") {
      // Correct PIN
      setShowPinModal(false); // close PIN modal
      setPin(""); // reset PIN

      // Show ownership/payment modal
      setShowOwnershipModal(true);
    } else {
      // Incorrect PIN
      setShowPinModal(false);
      setPin("");
      setTimeout(() => {
        toast.error("Incorrect Password", {
          description: "The PIN you entered is incorrect. Please try again.",
        });
      }, 300);
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "card":
        return <Wallet className="w-4 h-4" />;
      case "zelle":
        return <Zap className="w-4 h-4" />;
      case "cashapp":
        return <DollarSign className="w-4 h-4" />;
      case "bank":
        return <Building2 className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 pb-32">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-lg border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate("home")}
              className="p-2 hover:bg-muted rounded-lg transition-all hover:scale-105 active:scale-95"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                Money Transfer
              </h1>
              <p className="text-xs text-muted-foreground">
                Send money instantly & securely
              </p>
            </div>
          </div>
          <Button
            onClick={onLogout}
            variant="outline"
            className="h-10 text-sm bg-transparent hover:bg-muted transition-all hover:scale-105 active:scale-95"
          >
            <LogOut className="w-4 h-4 mr-2" /> Sign Out
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer border-l-4 border-l-accent">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">
                    Available Balance
                  </p>
                  <p className="text-2xl font-bold text-foreground mt-1">
                    $912,458.37
                  </p>
                </div>
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">
                    Sent This Month
                  </p>
                  <p className="text-2xl font-bold text-foreground mt-1">
                    $33,250.00
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center">
                  <Send className="w-6 h-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">
                    Pending
                  </p>
                  <p className="text-2xl font-bold text-foreground mt-1">
                    $500.00
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transfer Form */}
        <Card className="shadow-lg border-2 border-border/50 hover:border-accent/50 transition-all">
          <CardHeader className="bg-muted/30">
            <CardTitle className="text-lg flex items-center gap-2">
              <Send className="w-5 h-5 text-accent" />
              New Transfer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {/* Amount Input */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Transfer Amount</Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground font-bold text-xl">
                  $
                </span>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-10 h-14 text-2xl font-bold border-2 focus:border-accent transition-all"
                  step="0.01"
                  min="0"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Minimum: $1.00 • Maximum: $10,000.00
              </p>
            </div>

            {/* Select Recipient (Optional) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold">
                  Quick Select Recipient (Optional)
                </Label>
                {selectedRecipient && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearRecipientSelection}
                    className="h-7 text-xs hover:bg-destructive/10 hover:text-destructive"
                  >
                    <X className="w-3 h-3 mr-1" /> Clear
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {recipients.map((recipient) => (
                  <button
                    key={recipient.id}
                    onClick={() => handleRecipientSelect(recipient)}
                    className={`p-3 rounded-xl border-2 text-left transition-all hover:scale-105 active:scale-95 ${
                      selectedRecipient?.id === recipient.id
                        ? "border-accent bg-accent/10 shadow-lg"
                        : "border-border hover:border-accent/50 hover:shadow-md"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white mb-2 transition-all ${
                        selectedRecipient?.id === recipient.id
                          ? "bg-accent scale-110"
                          : "bg-muted-foreground"
                      }`}
                    >
                      {recipient.initials}
                    </div>
                    <p className="font-semibold text-sm text-foreground truncate">
                      {recipient.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {recipient.account}
                    </p>
                  </button>
                ))}
              </div>
              <Button
                variant="outline"
                onClick={() => setShowAddRecipientModal(true)}
                className="w-full mt-2 hover:bg-accent/10 hover:border-accent transition-all"
              >
                <User className="w-4 h-4 mr-2" /> Add New Recipient
              </Button>
            </div>

            {/* Payment Method Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold">Payment Method</Label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {["card", "zelle", "cashapp", "bank"].map((method) => (
                  <button
                    key={method}
                    className={`p-4 rounded-xl border-2 transition-all hover:scale-105 active:scale-95 ${
                      paymentMethod === method
                        ? "border-accent bg-accent/10 shadow-lg"
                        : "border-border hover:border-accent/50 hover:shadow-md"
                    }`}
                    onClick={() => setPaymentMethod(method as any)}
                  >
                    <div
                      className={`w-10 h-10 mx-auto mb-2 rounded-full flex items-center justify-center ${
                        paymentMethod === method
                          ? "bg-accent text-white"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {getPaymentMethodIcon(method)}
                    </div>
                    <p className="text-sm font-semibold capitalize">{method}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Recipient Name Field (for all methods) */}
            <div className="space-y-2 animate-in fade-in slide-in-from-top-4 duration-500">
              <Label className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Recipient Name *
              </Label>
              <Input
                type="text"
                placeholder="Enter recipient's full name"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="border-2 focus:border-accent transition-all"
                disabled={!!selectedRecipient}
              />
              {selectedRecipient && (
                <p className="text-xs text-muted-foreground">
                  Pre-filled from selected recipient
                </p>
              )}
            </div>

            {/* Dynamic Payment Fields */}
            {paymentMethod === "card" && (
              <div className="space-y-3 animate-in fade-in slide-in-from-top-4 duration-500">
                <Label className="text-sm font-semibold">
                  Select Source Card
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {cardTemplates.map((card) => (
                    <button
                      key={card.id}
                      onClick={() => setSelectedCard(card)}
                      className={`p-4 rounded-xl border-2 text-left transition-all hover:scale-105 active:scale-95 ${
                        selectedCard?.id === card.id
                          ? "border-accent bg-accent/10 shadow-lg"
                          : "border-border hover:border-accent/50 hover:shadow-md"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                            selectedCard?.id === card.id
                              ? "bg-accent"
                              : "bg-muted"
                          }`}
                        >
                          <Wallet
                            className={`w-6 h-6 ${
                              selectedCard?.id === card.id
                                ? "text-white"
                                : "text-muted-foreground"
                            }`}
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">
                            {card.type}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            •••• {card.number.slice(-4)}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {paymentMethod === "zelle" && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                        Zelle Transfer
                      </p>
                      <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                        Enter recipient's email or phone number registered with
                        Zelle
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Address
                  </Label>
                  <Input
                    type="email"
                    placeholder="recipient@email.com"
                    value={zelleEmail}
                    onChange={(e) => setZelleEmail(e.target.value)}
                    className="border-2 focus:border-accent transition-all"
                  />
                </div>
                <div className="text-center text-sm text-muted-foreground font-medium">
                  OR
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone Number
                  </Label>
                  <Input
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={zellePhone}
                    onChange={(e) => setZellePhone(e.target.value)}
                    className="border-2 focus:border-accent transition-all"
                  />
                </div>
              </div>
            )}

            {paymentMethod === "cashapp" && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-green-900 dark:text-green-100">
                        CashApp Transfer
                      </p>
                      <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                        Enter recipient's CashApp $tag (e.g., $username)
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Hash className="w-4 h-4" />
                    CashApp $Tag
                  </Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">
                      $
                    </span>
                    <Input
                      type="text"
                      placeholder="username"
                      value={cashappTag}
                      onChange={(e) => setCashappTag(e.target.value)}
                      className="pl-8 border-2 focus:border-accent transition-all"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === "bank" && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Building2 className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-purple-900 dark:text-purple-100">
                        Bank Transfer (ACH)
                      </p>
                      <p className="text-xs text-purple-700 dark:text-purple-300 mt-1">
                        Transfers may take 1-3 business days
                      </p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Account Holder Name *</Label>
                    <Input
                      value={accountName}
                      onChange={(e) => setAccountName(e.target.value)}
                      placeholder="John Doe"
                      className="border-2 focus:border-accent transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Bank Name *</Label>
                    <Input
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      placeholder="Bank of America"
                      className="border-2 focus:border-accent transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Routing Number *</Label>
                    <Input
                      value={routingNumber}
                      onChange={(e) => setRoutingNumber(e.target.value)}
                      placeholder="123456789"
                      maxLength={9}
                      className="border-2 focus:border-accent transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Account Number *</Label>
                    <Input
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      placeholder="1234567890"
                      className="border-2 focus:border-accent transition-all"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Note/Memo */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">
                Add Note (Optional)
              </Label>
              <Textarea
                placeholder="What's this transfer for?"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="border-2 focus:border-accent transition-all resize-none"
                rows={3}
              />
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleTransfer}
              disabled={
                !amount ||
                !recipientName ||
                (paymentMethod === "card" && !selectedCard) ||
                (paymentMethod === "zelle" && !zelleEmail && !zellePhone) ||
                (paymentMethod === "cashapp" && !cashappTag) ||
                (paymentMethod === "bank" &&
                  (!routingNumber || !accountNumber || !accountName))
              }
              className="w-full h-12 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold text-base shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5 mr-2" />
              Send ${amount || "0.00"}
            </Button>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="w-5 h-5 text-accent" />
              Recent Transactions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-accent/50 hover:bg-accent/5 transition-all cursor-pointer hover:scale-[1.01]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                    <Send className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      {transaction.recipient}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {transaction.date}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-foreground">
                    -${transaction.amount.toFixed(2)}
                  </p>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      transaction.status === "completed"
                        ? "bg-green-500/10 text-green-600 dark:text-green-400"
                        : "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
                    }`}
                  >
                    {transaction.status}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </main>

      <BottomNav />

      {/* Add Recipient Modal */}
      <Dialog
        open={showAddRecipientModal}
        onOpenChange={setShowAddRecipientModal}
      >
        <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-300">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Add New Recipient
            </DialogTitle>
            <DialogDescription>
              Fill in recipient details. You can add multiple payment methods.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-foreground">
                Basic Information
              </h3>
              <div className="space-y-2">
                <Label>Full Name *</Label>
                <Input
                  value={newRecipientName}
                  onChange={(e) => setNewRecipientName(e.target.value)}
                  placeholder="John Doe"
                  className="border-2 focus:border-accent"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={newRecipientEmail}
                    onChange={(e) => setNewRecipientEmail(e.target.value)}
                    placeholder="john@email.com"
                    className="border-2 focus:border-accent"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    type="tel"
                    value={newRecipientPhone}
                    onChange={(e) => setNewRecipientPhone(e.target.value)}
                    placeholder="(555) 123-4567"
                    className="border-2 focus:border-accent"
                  />
                </div>
              </div>
            </div>

            {/* Zelle Info */}
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-600" />
                Zelle (Optional)
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Zelle Email</Label>
                  <Input
                    type="email"
                    value={newZelleEmail}
                    onChange={(e) => setNewZelleEmail(e.target.value)}
                    placeholder="zelle@email.com"
                    className="border-2 focus:border-accent"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Zelle Phone</Label>
                  <Input
                    type="tel"
                    value={newZellePhone}
                    onChange={(e) => setNewZellePhone(e.target.value)}
                    placeholder="(555) 123-4567"
                    className="border-2 focus:border-accent"
                  />
                </div>
              </div>
            </div>

            {/* CashApp Info */}
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-600" />
                CashApp (Optional)
              </h3>
              <div className="space-y-2">
                <Label>CashApp $Tag</Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">
                    $
                  </span>
                  <Input
                    value={newCashappTag}
                    onChange={(e) => setNewCashappTag(e.target.value)}
                    placeholder="username"
                    className="pl-8 border-2 focus:border-accent"
                  />
                </div>
              </div>
            </div>

            {/* Bank Info */}
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
                <Building2 className="w-4 h-4 text-purple-600" />
                Bank Account (Optional)
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Account Holder</Label>
                  <Input
                    value={newBankAccountName}
                    onChange={(e) => setNewBankAccountName(e.target.value)}
                    placeholder="John Doe"
                    className="border-2 focus:border-accent"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Bank Name</Label>
                  <Input
                    value={newBankName}
                    onChange={(e) => setNewBankName(e.target.value)}
                    placeholder="Chase Bank"
                    className="border-2 focus:border-accent"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Routing Number</Label>
                  <Input
                    value={newRoutingNumber}
                    onChange={(e) => setNewRoutingNumber(e.target.value)}
                    placeholder="123456789"
                    maxLength={9}
                    className="border-2 focus:border-accent"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Account Number</Label>
                  <Input
                    value={newAccountNumber}
                    onChange={(e) => setNewAccountNumber(e.target.value)}
                    placeholder="1234567890"
                    className="border-2 focus:border-accent"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowAddRecipientModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddRecipient}
                className="flex-1 bg-accent hover:bg-accent/90"
              >
                <User className="w-4 h-4 mr-2" />
                Add Recipient
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* PIN Modal */}
      <Dialog open={showPinModal} onOpenChange={setShowPinModal}>
        <DialogContent className="sm:max-w-[420px] animate-in fade-in zoom-in duration-300">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold">
              Verify Transaction
            </DialogTitle>
            <DialogDescription className="text-center">
              Enter your 4-digit PIN to authorize this transfer
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-6 py-6">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center">
              <Send className="w-8 h-8 text-accent" />
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Sending to</p>
              <p className="text-lg font-bold text-foreground">
                {recipientName}
              </p>
              <p className="text-3xl font-bold text-accent mt-2">${amount}</p>
              {note && (
                <p className="text-xs text-muted-foreground mt-2 italic">
                  "{note}"
                </p>
              )}
            </div>
            <InputOTP maxLength={4} value={pin} onChange={(val) => setPin(val)}>
              <InputOTPGroup>
                <InputOTPSlot
                  index={0}
                  className="w-14 h-14 text-2xl border-2"
                />
                <InputOTPSlot
                  index={1}
                  className="w-14 h-14 text-2xl border-2"
                />
                <InputOTPSlot
                  index={2}
                  className="w-14 h-14 text-2xl border-2"
                />
                <InputOTPSlot
                  index={3}
                  className="w-14 h-14 text-2xl border-2"
                />
              </InputOTPGroup>
            </InputOTP>
            <Button
              onClick={handlePinSubmit}
              disabled={pin.length !== 4}
              className="w-full h-12 bg-accent hover:bg-accent/90 font-semibold text-base transition-all hover:scale-[1.02] active:scale-95"
            >
              Confirm Transfer
            </Button>
            <button
              onClick={() => setShowPinModal(false)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancel
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Ownership Change / Payment Modal */}
      <Dialog open={showOwnershipModal} onOpenChange={setShowOwnershipModal}>
        <DialogContent className="sm:max-w-[420px] animate-in fade-in zoom-in duration-300">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold">
              Account Ownership Change Detected
            </DialogTitle>
            <DialogDescription className="text-center">
              We detected a change in account ownership. This transfer will not
              go through until a $150 payment is made.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-6 py-6">
            <p className="text-center text-foreground">
              Please make the payment here to continue:
            </p>
            <Button
              onClick={() => (window.location.href = "/payment")}
              className="w-full h-12 bg-accent hover:bg-accent/90 font-semibold text-base transition-all hover:scale-[1.02] active:scale-95"
            >
              Go to Payment
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowOwnershipModal(false)}
              className="w-full h-12 font-semibold text-base transition-all hover:scale-[1.02] active:scale-95"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
