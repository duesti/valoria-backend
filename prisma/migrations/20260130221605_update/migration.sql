/*
  Warnings:

  - Changed the type of `discord_id` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "discord_id",
ADD COLUMN     "discord_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_discord_id_key" ON "User"("discord_id");
