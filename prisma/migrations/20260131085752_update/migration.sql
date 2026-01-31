/*
  Warnings:

  - You are about to drop the column `toke_hash` on the `Token` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Token` table. All the data in the column will be lost.
  - Added the required column `token` to the `Token` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Token_user_id_key";

-- AlterTable
ALTER TABLE "Token" DROP COLUMN "toke_hash",
DROP COLUMN "user_id",
ADD COLUMN     "revoked" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "token" TEXT NOT NULL;
