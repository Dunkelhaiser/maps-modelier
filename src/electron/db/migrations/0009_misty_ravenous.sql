CREATE TABLE `country_anthems` (
	`country_tag` text NOT NULL,
	`map_id` text NOT NULL,
	`name` text NOT NULL,
	`path` text NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer DEFAULT (unixepoch()) NOT NULL,
	PRIMARY KEY(`map_id`, `country_tag`),
	FOREIGN KEY (`map_id`) REFERENCES `maps`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`map_id`,`country_tag`) REFERENCES `countries`(`map_id`,`tag`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `country_coat_of_arms` (
	`country_tag` text NOT NULL,
	`map_id` text NOT NULL,
	`path` text NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer DEFAULT (unixepoch()) NOT NULL,
	PRIMARY KEY(`map_id`, `country_tag`),
	FOREIGN KEY (`map_id`) REFERENCES `maps`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`map_id`,`country_tag`) REFERENCES `countries`(`map_id`,`tag`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `country_flags` (
	`country_tag` text NOT NULL,
	`map_id` text NOT NULL,
	`path` text NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer DEFAULT (unixepoch()) NOT NULL,
	PRIMARY KEY(`map_id`, `country_tag`),
	FOREIGN KEY (`map_id`) REFERENCES `maps`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`map_id`,`country_tag`) REFERENCES `countries`(`map_id`,`tag`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `country_names` (
	`country_tag` text NOT NULL,
	`map_id` text NOT NULL,
	`common_name` text NOT NULL,
	`official_name` text,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer DEFAULT (unixepoch()) NOT NULL,
	PRIMARY KEY(`map_id`, `country_tag`),
	FOREIGN KEY (`map_id`) REFERENCES `maps`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`map_id`,`country_tag`) REFERENCES `countries`(`map_id`,`tag`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
ALTER TABLE `countries` DROP COLUMN `name`;--> statement-breakpoint
ALTER TABLE `countries` DROP COLUMN `flag`;--> statement-breakpoint
ALTER TABLE `countries` DROP COLUMN `coat_of_arms`;--> statement-breakpoint
ALTER TABLE `countries` DROP COLUMN `anthem_name`;--> statement-breakpoint
ALTER TABLE `countries` DROP COLUMN `anthem_path`;