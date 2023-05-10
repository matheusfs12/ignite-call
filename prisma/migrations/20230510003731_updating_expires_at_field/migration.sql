/*
  Warnings:

  - You are about to drop the column `access_token_expires` on the `accounts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "accounts" DROP COLUMN "access_token_expires",
ADD COLUMN     "expires_at" INTEGER;
