/*
  Warnings:

  - You are about to drop the column `otp` on the `Subscriber` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Creator" ALTER COLUMN "handle" SET DATA TYPE VARCHAR(15);

-- AlterTable
ALTER TABLE "Subscriber" DROP COLUMN "otp";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "otp" VARCHAR(6);
