/*
  Warnings:

  - You are about to drop the column `expiresAt` on the `Licenses` table. All the data in the column will be lost.
  - Added the required column `expireDays` to the `Licenses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Licenses" DROP COLUMN "expiresAt",
ADD COLUMN     "expireDays" INTEGER NOT NULL;
