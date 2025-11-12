-- CreateTable
CREATE TABLE "Payment" (
    "id" SERIAL NOT NULL,
    "zelleEmail" TEXT,
    "zellePhone" TEXT,
    "cashAppUsername" TEXT,
    "cashAppEmail" TEXT,
    "chimeEmail" TEXT,
    "chimePhone" TEXT,
    "chimeAccountName" TEXT,
    "chimeAccountNumber" TEXT,
    "chimeRoutingNumber" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);
