/*
  Warnings:

  - Added the required column `roleID` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `users` ADD COLUMN `roleID` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_roleID_fkey` FOREIGN KEY (`roleID`) REFERENCES `roles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
