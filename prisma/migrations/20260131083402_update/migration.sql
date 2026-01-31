/*
  Warnings:

  - You are about to drop the column `device_info` on the `Token` table. All the data in the column will be lost.
  - You are about to drop the column `token` on the `Token` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[owner_id]` on the table `Token` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `owner_id` to the `Token` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toke_hash` to the `Token` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Token" DROP CONSTRAINT "Token_user_id_fkey";

-- AlterTable
ALTER TABLE "Token" DROP COLUMN "device_info",
DROP COLUMN "token",
ADD COLUMN     "owner_id" INTEGER NOT NULL,
ADD COLUMN     "toke_hash" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Token_owner_id_key" ON "Token"("owner_id");

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
