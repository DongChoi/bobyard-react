/*
  Warnings:

  - You are about to drop the column `profile_picture` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `provider_account_id` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[providerAccountId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `providerAccountId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `User_provider_account_id_key` ON `User`;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `profile_picture`,
    DROP COLUMN `provider_account_id`,
    ADD COLUMN `profilePicture` VARCHAR(191) NOT NULL DEFAULT 'https://i.stack.imgur.com/34AD2.jpg',
    ADD COLUMN `providerAccountId` VARCHAR(255) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_providerAccountId_key` ON `User`(`providerAccountId`);
