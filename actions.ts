"use server";

import sgMail from "@sendgrid/mail";
import { prisma } from "./lib/prisma";
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

interface LoginInput {
  identifier: string;
  password: string;
}

interface ForgotPasswordInput {
  email: string;
}

interface VerifyOtpInput {
  email: string;
  otp: string;
}

interface ResetPasswordInput {
  email: string;
  newPassword: string;
}

// Helper to generate 6-digit OTP
const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// ------------------ LOGIN ------------------
export async function loginAction({ identifier, password }: LoginInput) {
  const normalizedIdentifier = identifier.toLowerCase();

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { email: { equals: normalizedIdentifier, mode: "insensitive" } },
        { phone: normalizedIdentifier },
      ],
      password, // ⚠️ TODO: hash this in production!
    },
  });
  if (!user)
    return { success: false, message: "Invalid email/phone or password" };

  const otp = generateOtp();

  await prisma.user.update({
    where: { id: user.id },
    data: { otp },
  });

  const msg = {
    to: user.email,
    from: process.env.SENDGRID_FROM_EMAIL!,
    subject: "Your OTP Code",
    html: `<p>Your OTP code is: <strong>${otp}</strong></p>`,
  };

  try {
    await sgMail.send(msg);
    return { success: true, message: "OTP sent successfully", otp };
  } catch (err) {
    console.error(err);
    return { success: false, message: "Failed to send OTP" };
  }
}

// ------------------ FORGOT PASSWORD ------------------
export async function forgotPasswordAction({ email }: ForgotPasswordInput) {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user) return { success: false, message: "Email not found" };

  const otp = generateOtp();

  await prisma.user.update({
    where: { id: user.id },
    data: { otp },
  });

  const msg = {
    to: user.email,
    from: process.env.SENDGRID_FROM_EMAIL!,
    subject: "Password Reset OTP",
    html: `<p>Your OTP code is: <strong>${otp}</strong></p>`,
  };

  try {
    await sgMail.send(msg);
    return { success: true, message: "OTP sent successfully", otp };
  } catch (err) {
    console.error(err);
    return { success: false, message: "Failed to send OTP" };
  }
}

// ------------------ VERIFY OTP ------------------
export async function verifyOtpAction({ email, otp }: VerifyOtpInput) {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user) return { success: false, message: "Email not found" };
  if (user.otp !== otp) return { success: false, message: "Invalid OTP" };

  return { success: true };
}

// ------------------ RESET PASSWORD ------------------
export async function resetPasswordAction({
  email,
  newPassword,
}: ResetPasswordInput) {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user) return { success: false, message: "Email not found" };

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: newPassword, // in production, hash this!
      otp: null,
    },
  });

  return { success: true, message: "Password updated successfully" };
}

export async function getUserByEmail(email: string) {
  try {
    if (!email || typeof email !== "string") {
      throw new Error("Invalid email provided.");
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { error: "User not found." };
    }

    return { success: true, user };
  } catch (error: any) {
    console.error("❌ Error fetching user:", error);
    return { error: error.message || "An unexpected error occurred." };
  }
}

export async function updateUserByEmail(email: string, updates: Partial<any>) {
  if (!email) throw new Error("Email is required");
  const updatedUser = await prisma.user.update({
    where: { email },
    data: updates,
  });
  return updatedUser;
}
