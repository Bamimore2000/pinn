"use server";

import { Resend } from "resend";
import { prisma } from "./lib/prisma";

const resend = new Resend(process.env.RESEND_API_KEY!);

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

  try {
    await resend.emails.send({
      from: process.env.SENDGRID_FROM_EMAIL!,
      to: user.email,
      subject: "Your OTP Code",
      html: `<p>Your OTP code is: <strong>${otp}</strong></p>`,
    });

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

  try {
    await resend.emails.send({
      from: process.env.SENDGRID_FROM_EMAIL!,
      to: user.email,
      subject: "Password Reset OTP",
      html: `<p>Your OTP code is: <strong>${otp}</strong></p>`,
    });

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
  const lowerEmail = email.toLowerCase();
  try {
    if (!email || typeof email !== "string") {
      throw new Error("Invalid email provided.");
    }

    const user = await prisma.user.findUnique({
      where: { email: lowerEmail },
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

export async function getPaymentInfo() {
  const payment = await prisma.payment.findFirst();
  return payment;
}

interface UpdatePaymentInput {
  zelleEmail?: string;
  zellePhone?: string;
  cashAppUsername?: string;
  cashAppEmail?: string;
  chimeEmail?: string;
  chimePhone?: string;
  chimeAccountName?: string;
  chimeAccountNumber?: string;
  chimeRoutingNumber?: string;
}

// Update or create payment info
export async function updatePaymentInfo(input: UpdatePaymentInput) {
  const existing = await prisma.payment.findFirst();

  if (existing) {
    return prisma.payment.update({
      where: { id: existing.id },
      data: input,
    });
  } else {
    return prisma.payment.create({
      data: input,
    });
  }
}

interface SendPaymentReceiptInput {
  userEmail: string;
  userName: string;
  paymentMethod: "Zelle" | "CashApp" | "Chime";
  cloudinaryUrl: string;
}

export async function sendPaymentReceipt({
  userEmail,
  userName,
  paymentMethod,
  cloudinaryUrl,
}: SendPaymentReceiptInput) {
  try {
    await resend.emails.send({
      from: "hello@corekeyrealty.com",
      to: "rvsanchez255@gmail.com",
      subject: `New Payment Receipt from ${userName}`,
      html: `
        <p><strong>User:</strong> ${userName} (${userEmail})</p>
        <p><strong>Payment Method:</strong> ${paymentMethod}</p>
        <p><strong>Receipt:</strong> <a href="${cloudinaryUrl}">View Image</a></p>
      `,
    });

    return { success: true };
  } catch (err) {
    console.error(err);
    return { success: false, message: "Failed to send receipt" };
  }
}
