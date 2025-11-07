"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { loginAction } from "@/actions";
import { toast } from "sonner";
import Link from "next/link";

interface LoginPageProps {
  onLogin: () => void;
  onNavigateTo2FA: () => void; // redirect to 2FA step
}

export default function LoginPage({
  onLogin,
  onNavigateTo2FA,
}: LoginPageProps) {
  const [identifier, setIdentifier] = useState(""); // email or phone
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!identifier || !password) {
      toast.error("Please enter both email/phone and password");
      return;
    }

    setIsLoading(true);

    try {
      const res = await loginAction({ identifier, password });

      if (!res.success) {
        toast.error(res.message || "Invalid credentials");
        setIsLoading(false);
        return;
      }

      // Store OTP in localStorage
      localStorage.setItem("otp", res.otp!);
      localStorage.setItem("identifier", identifier); // optional, to remember which user

      toast.success("Login successful! OTP sent to your email.");

      // Redirect to 2FA page or open 2FA modal
      setTimeout(() => {
        onNavigateTo2FA();
      }, 500);
    } catch (err) {
      console.log({ err });
      if (err instanceof Error) {
        toast.error(err.message);
      } else toast.error("Something went wrong");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-full h-auto rounded-lg bg-white mb-4">
            <Image
              width={400}
              height={100}
              alt="Pinnacle Bank Logo"
              src="/pinnacle.png"
            />
          </div>

          <p className="text-muted-foreground mt-1">Secure Banking Platform</p>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="identifier" className="text-sm font-medium">
                  Email or Phone Number
                </Label>
                <Input
                  id="identifier"
                  type="text"
                  placeholder="Enter your email or phone number"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="h-10"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-10"
                  disabled={isLoading}
                />
              </div>

              <Button
                type="submit"
                className="w-full h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <p className="text-xs text-muted-foreground text-center mt-4">
              Forgot password?{" "}
              <Link
                href={"/reset"}
                className="text-accent hover:underline font-medium"
              >
                Reset here
              </Link>
            </p>
          </CardContent>
        </Card>

        <p className="text-xs text-muted-foreground text-center mt-4">
          © 2025 Pinnacle Bank. All rights reserved.
        </p>
      </div>
    </div>
  );
}
