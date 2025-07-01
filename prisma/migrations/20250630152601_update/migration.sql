/*
  Warnings:

  - Added the required column `os` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ram` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `storage` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `products` ADD COLUMN `battery` VARCHAR(100) NULL,
    ADD COLUMN `camera` VARCHAR(100) NULL,
    ADD COLUMN `os` VARCHAR(50) NOT NULL,
    ADD COLUMN `ram` VARCHAR(50) NOT NULL,
    ADD COLUMN `rating` DOUBLE NULL DEFAULT 0.0,
    ADD COLUMN `screen` VARCHAR(100) NULL,
    ADD COLUMN `status` VARCHAR(50) NOT NULL DEFAULT 'In stock',
    ADD COLUMN `storage` VARCHAR(50) NOT NULL;
