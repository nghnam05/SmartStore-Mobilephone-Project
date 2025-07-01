-- AlterTable
ALTER TABLE `products` MODIFY `name` TEXT NOT NULL,
    MODIFY `detailDesc` TEXT NOT NULL,
    MODIFY `shortDesc` TEXT NOT NULL,
    MODIFY `factory` TEXT NOT NULL,
    MODIFY `target` TEXT NOT NULL,
    MODIFY `os` VARCHAR(100) NOT NULL,
    MODIFY `ram` VARCHAR(100) NOT NULL,
    MODIFY `status` VARCHAR(100) NOT NULL DEFAULT 'In stock',
    MODIFY `storage` VARCHAR(100) NOT NULL;
