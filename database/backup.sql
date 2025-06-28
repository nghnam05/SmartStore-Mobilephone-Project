-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: userdashboard
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `_prisma_migrations`
--

DROP TABLE IF EXISTS `_prisma_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_prisma_migrations`
--

LOCK TABLES `_prisma_migrations` WRITE;
/*!40000 ALTER TABLE `_prisma_migrations` DISABLE KEYS */;
INSERT INTO `_prisma_migrations` VALUES ('2657a9e2-986d-46bb-b295-fef723b93667','32e76df7fe5b89051d0234c6c92f058671850867bd7c320f4a9c4e5109bcf6b9','2025-06-18 16:09:40.939','20250618160940_mobilephone_project',NULL,NULL,'2025-06-18 16:09:40.793',1),('4c2dd959-9e14-47b6-a3b2-aab539260e6f','7df9652363a32fd00c19cf8935c66df8e08ca40b1ed9983dc9e5695b1c22e941','2025-06-23 16:31:09.457','20250623163109_update',NULL,NULL,'2025-06-23 16:31:09.327',1),('5de429c8-e7c5-49ce-b1b3-385cf9a5cce6','f3254a91e087edc55addaa26e147dd07f2210b34158ad2525e4228031fa76419','2025-06-21 16:02:50.133','20250621160249_update_sold',NULL,NULL,'2025-06-21 16:02:50.012',1),('6ccacdff-d0fa-44da-9e2f-b408ed8309d5','a08f45b0aca99135f9ffe83c85b8b6295902205e533d3c616ea7d4d67e03c820','2025-06-26 15:58:43.502','20250626155843_create',NULL,NULL,'2025-06-26 15:58:43.054',1),('843a7d13-061b-43e8-b713-4cc086351d21','3fb05e6ee0d45a90eed8791aeda7de3c00662bab4c7962f22e7330fd202c736b','2025-06-22 03:37:31.303','20250622033731_update_detail_desc',NULL,NULL,'2025-06-22 03:37:31.143',1),('8a0347ea-c4cc-4ddf-bd3f-1bf2cd609e1f','cf92714f3d98a628059a7cb563aafdf0dc14e688f0b03f10284514cc9d2640d2','2025-06-27 06:01:37.444','20250627060137_update',NULL,NULL,'2025-06-27 06:01:37.366',1),('8b05cf3d-e873-442f-b4a8-a6c3332c2c90','aaa8716950fcd5fbd46fb689104c75db12c9bc6ec6295aa7e04c8e4ad9be5533','2025-06-19 16:45:29.513','20250619164211_relation_user_role',NULL,NULL,'2025-06-19 16:45:29.327',1),('d6958030-2b61-4d35-9afe-ad45b9c5034e','449323f2aa1aff34975c8a3b46eb35bb598b1d134ff9c919e7e91a183c7ba31f','2025-06-24 10:25:59.570','20250624102559_add_session',NULL,NULL,'2025-06-24 10:25:59.509',1),('d98d1eec-6ba0-4894-b2c4-e35e47360792','2c793c288a585ae36f907a2e23d420048bdbb6302e196f7e0cafbc140928b9aa','2025-06-26 04:02:18.068','20250626040217_update_model',NULL,NULL,'2025-06-26 04:02:17.729',1);
/*!40000 ALTER TABLE `_prisma_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart_detail`
--

DROP TABLE IF EXISTS `cart_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_detail` (
  `id` int NOT NULL AUTO_INCREMENT,
  `price` int NOT NULL,
  `quantity` int NOT NULL,
  `cartId` int NOT NULL,
  `productId` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `cart_detail_cartId_fkey` (`cartId`),
  KEY `cart_detail_productId_fkey` (`productId`),
  CONSTRAINT `cart_detail_cartId_fkey` FOREIGN KEY (`cartId`) REFERENCES `carts` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `cart_detail_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_detail`
--

LOCK TABLES `cart_detail` WRITE;
/*!40000 ALTER TABLE `cart_detail` DISABLE KEYS */;
/*!40000 ALTER TABLE `cart_detail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `carts`
--

DROP TABLE IF EXISTS `carts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sum` int NOT NULL,
  `userId` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `carts_userId_key` (`userId`),
  CONSTRAINT `carts_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carts`
--

LOCK TABLES `carts` WRITE;
/*!40000 ALTER TABLE `carts` DISABLE KEYS */;
INSERT INTO `carts` VALUES (11,55000001,3);
/*!40000 ALTER TABLE `carts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_detail`
--

DROP TABLE IF EXISTS `order_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_detail` (
  `id` int NOT NULL AUTO_INCREMENT,
  `price` int NOT NULL,
  `quantity` int NOT NULL,
  `orderId` int NOT NULL,
  `productId` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `order_detail_orderId_fkey` (`orderId`),
  KEY `order_detail_productId_fkey` (`productId`),
  CONSTRAINT `order_detail_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `order_detail_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_detail`
--

LOCK TABLES `order_detail` WRITE;
/*!40000 ALTER TABLE `order_detail` DISABLE KEYS */;
INSERT INTO `order_detail` VALUES (13,29000000,2,1,33),(14,26000000,1,1,41);
/*!40000 ALTER TABLE `order_detail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `totalPrice` int NOT NULL,
  `paymentMethod` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `paymentRef` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `paymentStatus` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `receiverAddress` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `userId` int NOT NULL,
  `receiverName` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `receiverPhone` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `orders_userId_key` (`userId`),
  CONSTRAINT `orders_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,84000000,'COD',NULL,'pending','Ha Noi','pending',3,'Nguyen Van A','03456789987');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` int NOT NULL,
  `image` mediumtext COLLATE utf8mb4_unicode_ci,
  `detailDesc` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `shortDesc` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantity` int NOT NULL,
  `sold` int DEFAULT '0',
  `factory` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `target` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (31,'iPhone 16 Plus',26000000,'c1ce0536-202d-4529-b5a9-67412f196a8d.jpg','iPhone 16 is expected to feature a larger edge-to-edge display, powered by the new A18 Bionic chip for exceptional performance and energy efficiency.','Chip A18, GPU 5‑core, Neural Engine. ',10,0,'APPLE','Thin & Light'),(33,'iPhone 16 Plus 512GB',29000000,'8aa2b41c-f84c-42df-bbd1-571db7a1f382.jpg','iPhone 16 is expected to feature a larger edge-to-edge display, powered by the new A18 Bionic chip for exceptional performance and energy efficiency.','Chip A18, GPU 5‑core, Neural Engine. ',12,0,'APPLE','Thin & Light'),(34,'iPhone 13 Mini',8000000,'bcab3f86-481b-4e8d-90f9-136a23d450d4.jpg','iPhone 13 offers solid upgrades with the powerful A15 Bionic chip and enhanced dual-camera system. The battery lasts longer, the OLED screen ','Chip A15, GPU 5‑core, Neural Engine.  appleinsider.com +3 phonearena.com +3 apple.com +3  Màn hình Super Retina XDR 6.1″, True Tone, Ceramic Shield, USB‑C (USB 2.0). ',21,0,'APPLE','Thin & Light'),(35,'iPhone 14 Pro Max',21000000,'2f4abead-8dab-4817-921e-9330925a74cc.jpg','iPhone 14 maintains a familiar look but includes useful upgrades like a new front camera with autofocus, crash detection, and emergency SOS. ','Chip A18, GPU 5‑core, Neural Engine. ',34,0,'APPLE','Thin & Light'),(36,'iPhone 15 Pro Max',23000000,'adf916bd-8bbf-409e-80f3-e6c9af190667.jpg','iPhone 15 introduces Dynamic Island for interactive alerts, a 48MP main camera for ultra-clear shots, and a USB-C port for universal charging','Chip A18, GPU 5‑core, Neural Engine.  appleinsider.com +3 phonearena.com +3 apple.com +3  Màn hình Super Retina XDR 6.1″, True Tone, Ceramic Shield, USB‑C (USB 2.0). ',12,0,'APPLE','Thin & Light'),(37,'iPhone 15 Plus',24000000,'bd82f625-444f-4438-ad1f-92b1abe420aa.jpg','iPhone 15 introduces Dynamic Island for interactive alerts, a 48MP main camera for ultra-clear shots, and a USB-C port for universal charging','Chip A18, GPU 5‑core, Neural Engine. ',2,0,'APPLE','Thin & Light'),(38,'OPPO Reno13 F 5G',12000000,'1c9f3f5e-0652-454e-bcf7-9fad310f9bd3.jpg','The OPPO Reno13 F 5G balances strong features—a vivid high-refresh display, immense battery, 5G connectivity, rugged durability, and creative AI camera tools—at a competitive price (8–12 M VND)','Options for 8 GB or 12 GB RAM, with internal storage: 128 GB / 256 GB / 512 GB (UFS 3.1) ',12,0,'OPPO','HOT'),(39,'OPPO Reno 14 PRO',13000000,'28a307d4-77dc-4549-aeea-27ef45220701.jpg','The OPPO Reno14 offers a compelling mix of flagship-level design and features in the mid-range space Bright 120 Hz OLED display 50 MP OIS main camera + telephoto lens',' 6.59″ LTPS AMOLED, 1.5K (1256×2760), 120 Hz refresh, ~1200 nits peak brightness, protected by Crystal Shield Glass, usable with wet or gloved fingers  indiatimes.com +15',12,0,'OPPO','HOT'),(40,'OPPO RENO 12 5G',12000000,'dc0f9b60-ece2-429a-9ae9-a0496c24acda.jpg','Advanced AI camera features: Includes AI Eraser 2.0, AI Clear Face, Live Photo, Reflection Remover — ideal for content creation',' Dimensity 8350 delivers strong benchmarks (~1.3M AnTuTu) and supports casual gaming at 90–120 fps',23,0,'OPPO','HOT'),(41,'Samsung Galaxy S24 Plus',26000000,'6d08f1b9-f626-4e60-a8b1-f1fac64d66a6.jpg','IP68 rating, Gorilla Glass Victus 2, Armor Aluminum frame, AI features via Galaxy AI, S-Pen-compatible Circle to Search','6.7″ Dynamic AMOLED 2X, QHD+ (3120×1440), 120 Hz refresh (1–120 Hz), peak brightness ≈2600 nits',12,0,'SAMSUNG','HOT'),(42,'SamSung S25 +',26000000,'73067279-a1af-4b40-999f-52bdd4e99e06.jpg','IP68 rating, Gorilla Glass Victus 2, Armor Aluminum frame, AI features via Galaxy AI, S-Pen-compatible Circle to Search','Snapdragon 8 Gen 3 (UF version) in regions like the US, Exynos 2400 elsewhere',12,0,'SAMSUNG','Thin & Light'),(44,'Xiaomi Redmi Note 14 (128GB - 256GB)',12000000,'6d8260eb-73a7-428b-b932-d0716c80f07e.jpg','IP64, in‑display fingerprint, 3.5 mm jack, NFC, HyperOS (Android 14), ≤2 Android updates + 4 years security updates for 5G; 4G version gets 6 Android + 6 years security','6.67″ AMOLED, 1080 × 2400, 120 Hz, Gorilla Glass 5, 2100 nits peak',12,0,'XIAOMI','Gaming');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `roles_name_key` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'ADMIN','Admin full quyền'),(2,'USER','User thong thuong');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `session`
--

DROP TABLE IF EXISTS `session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `session` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sid` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `data` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiresAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Session_sid_key` (`sid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `session`
--

LOCK TABLES `session` WRITE;
/*!40000 ALTER TABLE `session` DISABLE KEYS */;
INSERT INTO `session` VALUES ('0pU9qjB8pB4xK29yOCfofZX7xKozkxjz','0pU9qjB8pB4xK29yOCfofZX7xKozkxjz','{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-07-01T16:02:13.923Z\",\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":3}}','2025-07-01 16:02:13.923'),('27-tc1hOFPwK9AlqnTArD-KurIsr81lS','27-tc1hOFPwK9AlqnTArD-KurIsr81lS','{\"cookie\":{\"originalMaxAge\":604799996,\"expires\":\"2025-07-03T11:13:31.874Z\",\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":1}}','2025-07-03 11:13:31.874'),('2INc6n-HZofCropB91ey_zcgX9kl7B9H','2INc6n-HZofCropB91ey_zcgX9kl7B9H','{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-07-01T16:31:49.403Z\",\"httpOnly\":true,\"path\":\"/\"}}','2025-07-01 16:31:49.403'),('4b-6TjTfgqdVUNjnDLBZZe4HBNo5AYvd','4b-6TjTfgqdVUNjnDLBZZe4HBNo5AYvd','{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-07-03T07:35:20.317Z\",\"httpOnly\":true,\"path\":\"/\"}}','2025-07-03 07:35:20.317'),('5pGv8lxFz_5DvA_yQmW9q7e4aRXI5Bl1','5pGv8lxFz_5DvA_yQmW9q7e4aRXI5Bl1','{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-07-01T16:05:12.362Z\",\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":6}}','2025-07-01 16:05:12.362'),('7PqhUSJVn9pdrvdTXUC6nI8kZKIwxA9i','7PqhUSJVn9pdrvdTXUC6nI8kZKIwxA9i','{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-07-01T16:06:42.470Z\",\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":6}}','2025-07-01 16:06:42.470'),('9C5cjxkmUOIqlcDIOQiq8UMm_KzI0gb0','9C5cjxkmUOIqlcDIOQiq8UMm_KzI0gb0','{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-07-01T16:09:55.176Z\",\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":6}}','2025-07-01 16:09:55.176'),('a6aD-UHxH_d_pQ1JtKPjyzOXMVfGgj_8','a6aD-UHxH_d_pQ1JtKPjyzOXMVfGgj_8','{\"cookie\":{\"originalMaxAge\":604799999,\"expires\":\"2025-07-03T07:36:06.864Z\",\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":1}}','2025-07-03 07:36:06.864'),('B6QfF3nbCwTv9tDfNk7J5iXd0ViblS5w','B6QfF3nbCwTv9tDfNk7J5iXd0ViblS5w','{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-07-04T03:43:24.272Z\",\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":1}}','2025-07-04 03:43:24.272'),('cQtOdElZ7vnYDB4YrllWF1Gg2Rbunb5v','cQtOdElZ7vnYDB4YrllWF1Gg2Rbunb5v','{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-07-01T16:37:27.495Z\",\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":7}}','2025-07-01 16:37:27.495'),('dg8fM63-pPewZOtqaecGCGqBFHvU6MGY','dg8fM63-pPewZOtqaecGCGqBFHvU6MGY','{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-07-04T15:30:49.506Z\",\"httpOnly\":true,\"path\":\"/\"}}','2025-07-04 15:30:49.506'),('EroWfNcI6QC1UgrzV-i6hkKl2F5uX6ln','EroWfNcI6QC1UgrzV-i6hkKl2F5uX6ln','{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-07-01T16:11:27.370Z\",\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":6}}','2025-07-01 16:11:27.370'),('fcp1FNcDQYEFOvLgb7PcQUj5NfRyEblR','fcp1FNcDQYEFOvLgb7PcQUj5NfRyEblR','{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-07-03T11:13:40.050Z\",\"httpOnly\":true,\"path\":\"/\"}}','2025-07-03 11:13:40.050'),('H1wW7DbY6eFg5Wfvd6axsGhrdA1-nkLi','H1wW7DbY6eFg5Wfvd6axsGhrdA1-nkLi','{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-07-01T16:42:14.792Z\",\"httpOnly\":true,\"path\":\"/\"}}','2025-07-01 16:42:14.792'),('hOBhKwUTPzKVaPEwEXLxqgUoYs-E4Wuu','hOBhKwUTPzKVaPEwEXLxqgUoYs-E4Wuu','{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-07-01T16:36:48.177Z\",\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":7}}','2025-07-01 16:36:48.177'),('hq1SgdZDagT-dG8ZWa4PU6iK0yZM6hLO','hq1SgdZDagT-dG8ZWa4PU6iK0yZM6hLO','{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-07-03T07:37:43.594Z\",\"httpOnly\":true,\"path\":\"/\"}}','2025-07-03 07:37:43.594'),('IXylvSFkSzktHLkYEdGvW3Eq45wlTEZO','IXylvSFkSzktHLkYEdGvW3Eq45wlTEZO','{\"cookie\":{\"originalMaxAge\":604799999,\"expires\":\"2025-07-01T16:31:06.072Z\",\"httpOnly\":true,\"path\":\"/\"}}','2025-07-01 16:31:06.072'),('jEXiMgUfmO0XLmrhTiYcEv3-2TB2zQMK','jEXiMgUfmO0XLmrhTiYcEv3-2TB2zQMK','{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-07-03T07:37:10.806Z\",\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":1}}','2025-07-03 07:37:10.806'),('m4PLEphU2oBz4oI2Lznj64HO9g2nl-Zn','m4PLEphU2oBz4oI2Lznj64HO9g2nl-Zn','{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-07-01T16:07:26.045Z\",\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":6}}','2025-07-01 16:07:26.045'),('M8h46EiljJjBs09Otw6nsvqDieUwWAVs','M8h46EiljJjBs09Otw6nsvqDieUwWAVs','{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-07-04T15:35:58.383Z\",\"httpOnly\":true,\"path\":\"/\"}}','2025-07-04 15:35:58.383'),('mUTCLibUso0dzbaGmnFkK6cKUQzcaf1u','mUTCLibUso0dzbaGmnFkK6cKUQzcaf1u','{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-07-03T10:05:55.210Z\",\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":1}}','2025-07-03 10:05:55.210'),('Mv34YZT38yRpg6VUDI4xXOwlnZb2A-kn','Mv34YZT38yRpg6VUDI4xXOwlnZb2A-kn','{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-07-01T15:59:22.367Z\",\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":3}}','2025-07-01 15:59:22.367'),('nFEP4k85PRjk44P9PwRrd09h0Tt0hpqu','nFEP4k85PRjk44P9PwRrd09h0Tt0hpqu','{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-07-02T07:30:41.027Z\",\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":24}}','2025-07-02 07:30:41.027'),('NHKEdUJc-QNDyODHyJv3Tk7A8DgbwjvD','NHKEdUJc-QNDyODHyJv3Tk7A8DgbwjvD','{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-07-03T07:35:15.092Z\",\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":1}}','2025-07-03 07:35:15.092'),('oxkb53E_Kkfqty6hHjMTriYka9y0Yt9g','oxkb53E_Kkfqty6hHjMTriYka9y0Yt9g','{\"cookie\":{\"originalMaxAge\":604799995,\"expires\":\"2025-07-01T16:26:08.833Z\",\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":3}}','2025-07-01 16:26:08.833'),('Oyt9aKxLNvB1jAQaUU6wKNDEcTYQ3WOA','Oyt9aKxLNvB1jAQaUU6wKNDEcTYQ3WOA','{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-07-05T09:31:39.496Z\",\"httpOnly\":true,\"path\":\"/\"}}','2025-07-05 09:31:39.496'),('S5UWcOyhuEpoUjCkzSjy62-cxYFWihNZ','S5UWcOyhuEpoUjCkzSjy62-cxYFWihNZ','{\"cookie\":{\"originalMaxAge\":604799999,\"expires\":\"2025-07-01T16:31:37.227Z\",\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":7}}','2025-07-01 16:31:37.227'),('vlaee_YX3Pp1OIZMsoKSybX3IfIQtMfa','vlaee_YX3Pp1OIZMsoKSybX3IfIQtMfa','{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-07-01T16:47:31.754Z\",\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":9}}','2025-07-01 16:47:31.754'),('wBlhno33U9JWq2-YAOcwdeBAuePsETBh','wBlhno33U9JWq2-YAOcwdeBAuePsETBh','{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-07-01T16:36:06.523Z\",\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":7}}','2025-07-01 16:36:06.523'),('wURujduioWyEBrkl8tOT20Coh_LvneTS','wURujduioWyEBrkl8tOT20Coh_LvneTS','{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-07-01T15:56:45.091Z\",\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":5}}','2025-07-01 15:56:45.091'),('xqja5Vr3yH5QxTI9hOqQEnj3CO6re94Y','xqja5Vr3yH5QxTI9hOqQEnj3CO6re94Y','{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-07-01T15:59:04.297Z\",\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":3}}','2025-07-01 15:59:04.297'),('YBcAibjvX4UXXjM3kYauwsIpGz1NvSjZ','YBcAibjvX4UXXjM3kYauwsIpGz1NvSjZ','{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-07-01T16:31:03.288Z\",\"httpOnly\":true,\"path\":\"/\"}}','2025-07-01 16:31:03.288');
/*!40000 ALTER TABLE `session` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fullname` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `accountType` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `roleID` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_username_key` (`username`),
  KEY `users_roleID_fkey` (`roleID`),
  CONSTRAINT `users_roleID_fkey` FOREIGN KEY (`roleID`) REFERENCES `roles` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (2,'hoainam2053@gmail.com','$2b$10$aI1bFTARHdROMjFPZ.XJ9e8o25hShRksU7J/TORxjqqyg7O/3JjM.','Nguyen Hoai Nam','Nguyen Van Qua,Q12,HCM\r\n\r\n','0344921800','SYSTEM',NULL,1),(3,'nguyenvana@example.com','$2b$10$j2tDaHZbjuzd/wTx.7PKSe5O.CBKS2Sei9hkAUuBYEWBEUfL3PHfu','Nguyễn Văn A','12 Lý Thường Kiệt, Hà Nội\r\n','0912345678','SYSTEM',NULL,2),(4,'tranthib@example.com','$2b$10$PzdaumMA4Lbn8HCX5G2hW.z2U3FhwU./pVV.wMBDrp/39DmAoGP8S','Trần Thị B','88 Nguyễn Huệ, Quận 1, TP. HCM','0908765432','SYSTEM',NULL,2),(5,'levanc@example.com','$2b$10$utOpusqn74dvgps84sWOeuPUwPI5ppvZAkmJfWj9gcS91U8NPtNhi','Lê Văn C','45 Trần Phú, Hải Phòng','0984824173','SYSTEM',NULL,2),(6,'phamthid@example.com','$2b$10$YE2WyEI4yDnJIHwo71H2zuKKgrG0HT4G9FnGkKhdEFOZ2ChljIb.a','Phạm Thị D','72 Hoàng Văn Thụ, Đà Nẵng','0912345678','SYSTEM',NULL,2),(7,'hoangvane@example.com','$2b$10$WR/3bd04vkk6ZDoAcIYwqeoj68CgDdUgu.x1jfrc2vDq8bZUrsrXa','Hoàng Văn E','5 Phạm Ngũ Lão, Cần Thơ','0912345678','SYSTEM',NULL,2),(8,'dangthif@example.com','$2b$10$1Ag63GgjxGBpnGEc953M9.BGXHKsb7Hf54QcTvW5TDkUslBnMXC1K','Đặng Thị F','23 Hùng Vương, Huế','0908765432','SYSTEM',NULL,2),(9,'buivang@example.com','$2b$10$iJ80er1hJ2xj/DAg7skEmO7iCWDfY3Uf9FSETrK1VPkmhv37v8EVy','Bùi Văn G','101 Trường Chinh, Nam Định','0344921833','SYSTEM',NULL,2),(10,'vuthih@example.com','$2b$10$N.LemqGsf2uLJmS8eoPu0.F05xc11JTL7v0lG.TFav5IcHHJlr1Ti','Vũ Thị H','11 Hai Bà Trưng, Bắc Ninh','0912345678','SYSTEM',NULL,2),(11,'hoainam205@gmail.com','$2b$10$DnnCi9Jqu3D9fmfSOShzV.yyRTyMHJhDTtaAHyQfpdtHz2jFZEK52','Nam Hoai','Ha Noi',NULL,'SYSTEM','https://i.pinimg.com/736x/03/82/39/0382396087da28c40b9950580447ad8b.jpg',1);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-28 16:32:35
