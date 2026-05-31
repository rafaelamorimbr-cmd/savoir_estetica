CREATE TABLE `appointments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`serviceId` int NOT NULL,
	`clientName` varchar(200) NOT NULL,
	`clientEmail` varchar(320),
	`clientPhone` varchar(20) NOT NULL,
	`appointmentDate` varchar(10) NOT NULL,
	`appointmentTime` varchar(5) NOT NULL,
	`status` enum('pending','confirmed','cancelled','completed') NOT NULL DEFAULT 'pending',
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `appointments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `business_hours` (
	`id` int AUTO_INCREMENT NOT NULL,
	`dayOfWeek` int NOT NULL,
	`openTime` varchar(5),
	`closeTime` varchar(5),
	`isOpen` boolean NOT NULL DEFAULT true,
	CONSTRAINT `business_hours_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `gallery` (
	`id` int AUTO_INCREMENT NOT NULL,
	`category` enum('facial','corporal','outros') NOT NULL DEFAULT 'outros',
	`serviceId` int,
	`beforeImageUrl` text,
	`afterImageUrl` text NOT NULL,
	`description` text,
	`active` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `gallery_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `services` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(200) NOT NULL,
	`category` enum('facial','corporal') NOT NULL,
	`description` text,
	`duration` int NOT NULL DEFAULT 60,
	`price` decimal(10,2),
	`active` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `services_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `testimonials` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientName` varchar(200) NOT NULL,
	`rating` int NOT NULL DEFAULT 5,
	`comment` text NOT NULL,
	`serviceId` int,
	`approved` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `testimonials_id` PRIMARY KEY(`id`)
);
