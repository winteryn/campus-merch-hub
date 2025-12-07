/*
SQLyog Community v13.1.5  (64 bit)
MySQL - 10.4.32-MariaDB : Database - campus_merch_hub
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`campus_merch_hub` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;

USE `campus_merch_hub`;

/*Table structure for table `admins` */

DROP TABLE IF EXISTS `admins`;

CREATE TABLE `admins` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `admins` */

insert  into `admins`(`id`,`first_name`,`last_name`,`email`,`password_hash`,`created_at`) values 
(1,'THEA MAE','TULABING','admin@um.edu.ph','$2y$10$g1mQxEvBHvgdxCCeki4MwuVLS.PTfXbPFM5C9b3kEvH4J2oNZGY8.','2025-11-19 15:47:14'),
(2,'','','','','2025-12-06 00:25:54');

/*Table structure for table `cart_items` */

DROP TABLE IF EXISTS `cart_items`;

CREATE TABLE `cart_items` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `cart_id` bigint(20) DEFAULT NULL,
  `product_variant_id` bigint(20) DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `added_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `cart_id` (`cart_id`),
  KEY `product_variant_id` (`product_variant_id`),
  CONSTRAINT `cart_items_ibfk_1` FOREIGN KEY (`cart_id`) REFERENCES `shopping_carts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `cart_items_ibfk_2` FOREIGN KEY (`product_variant_id`) REFERENCES `product_variants` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `cart_items` */

insert  into `cart_items`(`id`,`cart_id`,`product_variant_id`,`quantity`,`added_at`) values 
(1,1,1,1,'2025-11-19 17:00:06');

/*Table structure for table `categories` */

DROP TABLE IF EXISTS `categories`;

CREATE TABLE `categories` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `categories` */

insert  into `categories`(`id`,`name`) values 
(1,'Jacket'),
(2,'Jersey');

/*Table structure for table `courses` */

DROP TABLE IF EXISTS `courses`;

CREATE TABLE `courses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `department_id` int(11) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `code` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `department_id` (`department_id`),
  CONSTRAINT `courses_ibfk_1` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `courses` */

insert  into `courses`(`id`,`department_id`,`name`,`code`) values 
(1,1,'Bachelor of Science in Computer Science','BSCS'),
(2,1,'Bachelor of Science in Information Technology','BSIT'),
(3,1,'Bachelor of Science in Information Systems','BSIS'),
(4,2,'Bachelor of Science in Civil Engineering','BSCE'),
(5,2,'Bachelor of Science in Electrical Engineering','BSEE'),
(6,3,'Bachelor of Science in Business Administration','BSBA'),
(7,3,'Bachelor of Science in Accountancy','BSA'),
(8,4,'Bachelor of Elementary Education','BEED'),
(9,4,'Bachelor of Secondary Education','BSED'),
(10,5,'Bachelor of Arts in Communication','BACOMM'),
(11,5,'Bachelor of Science in Psychology','BSPsych');

/*Table structure for table `customers` */

DROP TABLE IF EXISTS `customers`;

CREATE TABLE `customers` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `customers` */

insert  into `customers`(`id`,`first_name`,`last_name`,`email`,`phone`) values 
(1,'MARIELA','BATUMBAKAL','m@um.edu.ph','09111222333'),
(2,'TEYAMI','DIAGBEL','t@um.edu.ph','09999888774'),
(3,'WINDOL','COPALENS','w@um.edu.ph','09666111223'),
(4,'CASSANDRA','JOE','c@um.edu.ph','09555123784'),
(5,'','','',NULL);

/*Table structure for table `departments` */

DROP TABLE IF EXISTS `departments`;

CREATE TABLE `departments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `departments` */

insert  into `departments`(`id`,`name`,`description`,`created_at`) values 
(1,'Department of Computing Education','Computer Science and IT programs','2025-12-05 14:08:59'),
(2,'College of Engineering','Engineering programs','2025-12-05 14:08:59'),
(3,'College of Business Administration','Business and management programs','2025-12-05 14:08:59'),
(4,'College of Education','Education programs','2025-12-05 14:08:59'),
(5,'College of Arts and Sciences','Liberal arts and sciences','2025-12-05 14:08:59');

/*Table structure for table `design_submissions` */

DROP TABLE IF EXISTS `design_submissions`;

CREATE TABLE `design_submissions` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) DEFAULT NULL,
  `design_name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `submission_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` enum('pending','approved','rejected') NOT NULL,
  `admin_id` bigint(20) DEFAULT NULL,
  `review_date` timestamp NULL DEFAULT NULL,
  `notes` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `admin_id` (`admin_id`),
  CONSTRAINT `design_submissions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `design_submissions_ibfk_2` FOREIGN KEY (`admin_id`) REFERENCES `admins` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `design_submissions` */

insert  into `design_submissions`(`id`,`user_id`,`design_name`,`description`,`submission_date`,`status`,`admin_id`,`review_date`,`notes`) values 
(1,1,'barbie','Pink','2025-11-19 15:56:22','approved',NULL,NULL,NULL);

/*Table structure for table `inventory_logs` */

DROP TABLE IF EXISTS `inventory_logs`;

CREATE TABLE `inventory_logs` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `product_variant_id` bigint(20) DEFAULT NULL,
  `change_type` enum('restock','sale','adjustment') NOT NULL,
  `quantity_change` int(11) NOT NULL,
  `change_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `notes` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `product_variant_id` (`product_variant_id`),
  CONSTRAINT `inventory_logs_ibfk_1` FOREIGN KEY (`product_variant_id`) REFERENCES `product_variants` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `inventory_logs` */

insert  into `inventory_logs`(`id`,`product_variant_id`,`change_type`,`quantity_change`,`change_date`,`notes`) values 
(1,1,'sale',0,'2025-11-19 16:35:27','oki');

/*Table structure for table `order_items` */

DROP TABLE IF EXISTS `order_items`;

CREATE TABLE `order_items` (
  `order_id` bigint(20) NOT NULL,
  `product_id` bigint(20) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price_at_purchase` decimal(10,2) NOT NULL,
  PRIMARY KEY (`order_id`,`product_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `order_items` */

insert  into `order_items`(`order_id`,`product_id`,`quantity`,`price_at_purchase`) values 
(2,1,1,1000.00);

/*Table structure for table `orders` */

DROP TABLE IF EXISTS `orders`;

CREATE TABLE `orders` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `customer_id` bigint(20) DEFAULT NULL,
  `order_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `total_amount` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `customer_id` (`customer_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `orders` */

insert  into `orders`(`id`,`customer_id`,`order_date`,`total_amount`) values 
(1,1,'2025-11-19 16:47:01',1000.00),
(2,4,'2025-11-19 16:47:14',1000.00);

/*Table structure for table `payments` */

DROP TABLE IF EXISTS `payments`;

CREATE TABLE `payments` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `order_id` bigint(20) DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `method` enum('G-Cash','Cash') NOT NULL,
  `status` enum('pending','completed','failed') NOT NULL,
  `transaction_date` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `payments` */

insert  into `payments`(`id`,`order_id`,`amount`,`method`,`status`,`transaction_date`) values 
(1,1,1000.00,'G-Cash','pending','2025-11-19 16:58:13');

/*Table structure for table `product_categories` */

DROP TABLE IF EXISTS `product_categories`;

CREATE TABLE `product_categories` (
  `product_id` bigint(20) NOT NULL,
  `category_id` bigint(20) NOT NULL,
  PRIMARY KEY (`product_id`,`category_id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `product_categories_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `product_categories_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `product_categories` */

insert  into `product_categories`(`product_id`,`category_id`) values 
(1,1);

/*Table structure for table `product_variants` */

DROP TABLE IF EXISTS `product_variants`;

CREATE TABLE `product_variants` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `product_id` bigint(20) DEFAULT NULL,
  `size` enum('S','M','L','XL','XXL') DEFAULT NULL,
  `stock_quantity` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_product_variant` (`product_id`,`size`),
  CONSTRAINT `product_variants_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `product_variants` */

insert  into `product_variants`(`id`,`product_id`,`size`,`stock_quantity`) values 
(1,1,'S',1);

/*Table structure for table `products` */

DROP TABLE IF EXISTS `products`;

CREATE TABLE `products` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `stock_quantity` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `products` */

insert  into `products`(`id`,`name`,`description`,`price`,`stock_quantity`) values 
(1,'jacket','black pink',1000.00,10),
(2,'jersey','orange',350.00,5);

/*Table structure for table `shopping_carts` */

DROP TABLE IF EXISTS `shopping_carts`;

CREATE TABLE `shopping_carts` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `shopping_carts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `shopping_carts` */

insert  into `shopping_carts`(`id`,`user_id`,`created_at`,`updated_at`) values 
(1,1,'2025-11-19 15:57:32','2025-11-19 15:57:32');

/*Table structure for table `users` */

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `student_id` varchar(50) DEFAULT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('student','faculty','alumni') NOT NULL,
  `department` int(11) DEFAULT NULL,
  `course` int(11) DEFAULT NULL,
  `year_level` enum('1st','2nd','3rd','4th','5th') DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_admin` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `student_id` (`student_id`),
  UNIQUE KEY `student_id_2` (`student_id`)
) ENGINE=InnoDB AUTO_INCREMENT=78 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `users` */

insert  into `users`(`id`,`student_id`,`first_name`,`last_name`,`email`,`password_hash`,`role`,`department`,`course`,`year_level`,`created_at`,`is_admin`) values 
(1,'142748','JULIUS','CORTEZ','j@um.edu.ph','password','student',1,1,'3rd','2025-11-19 15:50:32',0),
(2,'147652','JUPRI','BATONGHINOG','jupri@um.edu.ph','hash','student',2,4,'3rd','2025-11-19 16:39:27',0),
(3,'A','MARIELA','BATUMBAKAL','m@um.edu.ph','ano','alumni',1,2,NULL,'2025-11-19 17:09:05',0),
(4,'','TEYAMI','DIAGBEL','t@um.edu.ph','asdfghjkl','faculty',2,NULL,NULL,'2025-11-19 17:10:53',0),
(5,'165854','WINDOL','COPALENS','w@um.edu.ph','win_gwaps','student',1,1,'1st','2025-11-19 17:10:50',0),
(6,'457864','CASSANDRA','JOE','c@um.edu.ph','cass123','student',2,2,'2nd','2025-11-19 17:11:53',0),
(7,'524572','QUIM','MARIPOSA','q@um.edu.ph','quimpang','student',2,5,'4th','2025-11-19 17:12:50',0),
(8,'S123456','Juan','Juan','a@umindanao.edu.ph','$2y$10$g1mQxEvBHvgdxCCeki4MwuVLS.PTfXbPFM5C9b3kEvH4J2oNZGY8.','student',1,1,'1st','2025-12-05 23:06:17',0),
(9,'S142358','juan','juan','s.salubre.142358.tc@umindanao.edu.ph','$2y$10$S.NktBDkmyC9EqYIRLoRce4gMB4TO4XoenEMOzXVpCLazqllL4zf6','student',1,2,'2nd','2025-12-06 13:21:01',0),
(10,'S144114','simon','simon','j@umindanao.edu.ph','$2y$10$eQVmxaDnwituosjhwtm6i.Vr5/WJUk2tdl8x3G6XwifhAg8mbPtRa','student',1,2,'3rd','2025-12-06 13:34:58',0),
(11,'S012305','Jhon','Jhon','jc@umindanao.edu.ph','$2y$10$Xlu4gt2oOAZBWXTKJyUba.zJCzMLdCr6tSNdPA9nCNjLTkE.NfbAa','student',1,1,'3rd','2025-12-06 13:43:43',0),
(26,'S144113','simon','layao','jl@umindanao.edu.ph','$2y$10$nfv2c/QTq4Y9OrlBtBsLmOSETpoCRKmGJULS1XmpoY2sMViNmkp3u','student',1,2,'3rd','2025-12-06 15:07:28',0),
(34,'S147852','sabing','rina','sb@umindanao.edu.ph','$2y$10$vYj4UGdT7jOBmLRxu6rFqutGBuZHHr.U/JBQcLcIezgeFod957L5m','student',1,1,'4th','2025-12-06 15:36:45',0),
(35,'S751364','maria','jose','mj@umindanao.edu.ph','$2y$10$bPzidXetzE60vgOhimwe4uG0wqbpEc7c54PUOUTVRmDWfAgcmRY.e','student',1,2,'5th','2025-12-06 15:45:05',0);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
