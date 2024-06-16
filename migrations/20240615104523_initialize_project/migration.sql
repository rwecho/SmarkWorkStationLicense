-- CreateTable
CREATE TABLE "Licenses" (
    "id" SERIAL NOT NULL,
    "fingerprint" TEXT NOT NULL,
    "license" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Licenses_pkey" PRIMARY KEY ("id")
);
