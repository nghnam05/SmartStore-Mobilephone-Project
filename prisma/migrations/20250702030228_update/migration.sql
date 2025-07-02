/*
  Warnings:

  - A unique constraint covering the columns `[appTransId]` on the table `orders` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `orders` ADD COLUMN `appTransId` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `orders_appTransId_key` ON `orders`(`appTransId`);
