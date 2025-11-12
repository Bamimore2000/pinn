-- AlterTable
ALTER TABLE "User" ADD COLUMN     "employerName" TEXT,
ADD COLUMN     "hasPaidTransferFee" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "maritalStatus" TEXT,
ADD COLUMN     "occupation" TEXT,
ADD COLUMN     "ssn" TEXT;
