/*
  Warnings:

  - You are about to drop the column `reciverName` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `reciverPhone` on the `orders` table. All the data in the column will be lost.
  - Added the required column `receiverName` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `receiverPhone` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `orders` DROP COLUMN `reciverName`,
    DROP COLUMN `reciverPhone`,
    ADD COLUMN `receiverName` VARCHAR(255) NOT NULL,
    ADD COLUMN `receiverPhone` VARCHAR(255) NOT NULL;
