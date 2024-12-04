-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: ccs
-- ------------------------------------------------------
-- Server version	8.0.36

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
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `course_id` int NOT NULL,
  `user_id` int NOT NULL,
  `content` text,
  `date` date NOT NULL,
  PRIMARY KEY (`id`),
  KEY `course_id` (`course_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`),
  CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `courses`
--

DROP TABLE IF EXISTS `courses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `courses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `imgUrl` varchar(255) DEFAULT NULL,
  `title` varchar(100) NOT NULL,
  `text` text,
  `teacher` varchar(100) NOT NULL,
  `stars` int DEFAULT '0',
  `star` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `courses`
--

LOCK TABLES `courses` WRITE;
/*!40000 ALTER TABLE `courses` DISABLE KEYS */;
INSERT INTO `courses` VALUES (1,'https://pic3.zhimg.com/v2-16facefee00b350494136b86ac8f227b_1440w.jpg','计算机组成原理','本课程是计算机学科本科相关专业的核心基础课，重点讲授计算机硬件系统的组成结构、工作原理和设计方法。','纪禄平',0,0),(2,'https://tse3-mm.cn.bing.net/th/id/OIP-C.DRnZRNw4jo1p7nWexRR3zQAAAA','计算机网络','本课程按照计算机网络体系结构的层次模型，在介绍计算机网络的基本概念和历史的基础上，按照自上而下的次序，以Internet主要协议为例系统地阐述了各层次的主要服务、工作原理、常用技术和重要协议，包括应用层、传输层、网络层、数据链路层和物理层，最后讲述网络安全和未来网络前沿的原理和技术。','杨坚',0,0),(3,'https://tse4-mm.cn.bing.net/th/id/OIP-C.m10r7fF9KxN3LUJazhv-YwHaE8','编译原理','《编译原理》课程是计算机科学与技术专业的必修课程。本课程主要介绍程序设计语言编译程序构造的基本原理和设计方法，包括：编译程序概述、高级语言及其语法描述、词法分析、语法分析、属性文法和语法制导翻译、语义分析和中间代码产生、符号表、运行时存储空间组织、优化、目标代码生成等。','王挺',0,0),(4,'https://tse3-mm.cn.bing.net/th/id/OIP-C.fPM9vq7AVt8X-93anBsmJwHaFO','数据结构与算法','计算机是现代社会中用于解决问题的重要工具，支撑这个工具高效运转的就是其后的各种系统程序、应用程序。图灵奖获得者N.Wirth写了一本经典著作“程序=算法+数据结构”。数据结构，是抽象的表示数据的方式；算法，则是计算的一系列有效、通用的步骤。算法与数据结构是程序设计中相辅相成的两个方面，是计算机学科的重要基石。','张铭',0,0),(5,'https://tse4-mm.cn.bing.net/th/id/OIP-C.rtSOWkwVjd10ywfMXh_JDgAAAA','操作系统','本课程是计算机类专业的必修课程，旨在全面系统地介绍操作系统的体系结构、设计机理及实现方法和技术，包括自启动装入、系统调用与接口、处理器调度及进/线程控制、同步与通信机制、死锁处理、基于分区/分页/分段的内存管理及虚拟存储、设备管理、文件系统等，从而培养同学在操作系统研发方面的理论基础及技术素养。课程教学力争突出如下特色和亮点：1、知识体系务求科学合理、教学内容务求丰富完善、难点讲授务求思路清晰；2、注重实践与理论并重，持续更新完善实验课题体系，引导学生钻研具有一定创新性和挑战度的操作系统研发难题以培养实践能力及实用技能；3、全面贯彻以学生为中心及因材施教和兴趣驱动的教学理念，注重教学互动、及时反馈和答疑指导。','何永忠',0,0),(6,'https://tse4-mm.cn.bing.net/th/id/OIP-C.8cW6KGWSQe8JistrYUMTGAHaEJ','数据库系统','讲述数据库应用、设计与实现技术，循序渐进地融入大数据思维。技术先进、概念清晰、内容精炼、资源齐全！适合计算机、数据科学与大数据、软件工程、人工智能、信息技术/系统等相关专业，以及希望从事数据管理、Web系统、互联网+平台研究、开发与应用，对计算机实际应用系统实现技术感兴趣的各类人员。','党德鹏',0,0),(7,'https://tse4-mm.cn.bing.net/th/id/OIP-C.CWX5WcfcQMqvhBgcEgMLQwHaEU','网络安全','网络安全是一门面向国家网络空间安全战略需求、立足国际学术前沿的核心专业课程。本课程的教学内容分三部分：第一部分讲授网络安全基础，第二部分讲授密码学理论与应用，第三部分讲授网络安全技术与实践。该课程的知识目标是帮助学生熟练掌握密码算法设计基本原理、密码协议设计与安全性分析方法以及网络安全技术的相关知识点，为学生未来进行后继相关课程、科学技术的学习打好必要基础；该课程的能力目标，不限于学生对信息网络安全知识点的正确理解，还包括能将理论知识落实到具体实践场景，进行具体解决方案构思与研究报告撰写的能力；该课程的素质目标即帮助学生树立正确的网络安全观，通过教学内容与形式的创新编排，激励学生在学习过程中深度分析、大胆质疑，最终具备解决复杂问题的能力和高级思维。','刘建伟',0,0),(8,'https://tse2-mm.cn.bing.net/th/id/OIP-C.wm45ZAnnjIryscvlOe6BPgHaEJ','软件工程','本次软件工程MOOC课程是一门导论性课程，我们将全面介绍软件工程所涉及的各方面知识，包括软件过程、软件需求、结构化分析和设计方法、面向对象分析和设计方法、敏捷开发方法、软件测试、软件项目管理、软件开发工具和环境。让大家初步了解软件开发和维护的方法学，为进一步深入学习各专题打下基础。','黄罡',0,0);
/*!40000 ALTER TABLE `courses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `img` varchar(255) DEFAULT NULL,
  `solt` varchar(100) NOT NULL,
  `date` date NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'root','$2b$12$wp1WN0p.Uu9LzQyxRJ98.eKYKP3.mfNjYLjuCMI3LUOqTT0G1Ha2O',NULL,'$2b$12$wp1WN0p.Uu9LzQyxRJ98.e','2024-11-01'),(2,'guest','$2b$12$AOioWYcOXa2qDFDwhjVCOO7bEAcX5wNHb.f6e7GeAxLJ/0j4obn12',NULL,'$2b$12$AOioWYcOXa2qDFDwhjVCOO','2024-11-01'),(3,'庒培鑫','$2b$12$48dDT3kEC.O9d78Mf.yC0us4muTnpOAl3hxjGQjv4xUQCPWtHeJYy',NULL,'$2b$12$48dDT3kEC.O9d78Mf.yC0u','2024-11-01'),(4,'孙傲焜','$2b$12$fDdnqN.zNxFmwqYM1Lo6lOGN3zosUGmgqtzDI/XP15n0a.Yl7kkGi',NULL,'$2b$12$fDdnqN.zNxFmwqYM1Lo6lO','2024-11-01');
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

-- Dump completed on 2024-11-01 15:19:37
