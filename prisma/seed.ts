import "dotenv/config"; // ✅ Loads DATABASE_URL and other env vars
import { prisma } from "@/lib/prisma";
async function main() {
  const users = [
    {
      email: "rvsanchez255@gmail.com",
      phone: "+1 (555) 123-4567",
      password: "Roberto99",
      otp: "287753",

      // --- U.S. Bank Metadata ---
      firstName: "Roberto",
      lastName: "Sanchez",
      middleName: "V.",
      dateOfBirth: new Date("1989-07-12"),
      gender: "male",
      address: "123 Elm Street",
      city: "San Diego",
      state: "California",
      country: "USA",
      accountNumber: "1048293751",
      accountType: "checking",
      balance: 24500.75,
      currency: "USD",
      isVerified: true,
      kycLevel: "Tier 2",
      profileImageUrl: "https://randomuser.me/api/portraits/men/10.jpg",
    },
    {
      email: "anthonygurrie@gmail.com",
      phone: "+1 (929) 542-7566",
      password: "securepass456",
      otp: "654321",

      // --- U.S. Bank Metadata ---
      firstName: "Anthony",
      lastName: "Gurrie",
      middleName: null,
      dateOfBirth: new Date("1992-03-21"),
      gender: "male",
      address: "45 Maple Avenue",
      city: "New York",
      state: "New York",
      country: "USA",
      accountNumber: "1082947563",
      accountType: "savings",
      balance: 89200.5,
      currency: "USD",
      isVerified: false,
      kycLevel: "Tier 1",
      profileImageUrl: "https://randomuser.me/api/portraits/men/20.jpg",
    },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: user,
      create: user,
    });
  }

  console.log("✅ U.S. users pre-added successfully with full metadata");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding data:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
