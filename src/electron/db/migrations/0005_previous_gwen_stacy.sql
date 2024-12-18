CREATE TABLE `ethnicities` (
	`id` integer NOT NULL,
	`map_id` text NOT NULL,
	`name` text NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer DEFAULT (unixepoch()) NOT NULL,
	PRIMARY KEY(`map_id`, `id`),
	FOREIGN KEY (`map_id`) REFERENCES `maps`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `province_populations` (
	`province_id` integer NOT NULL,
	`ethnicity_id` integer NOT NULL,
	`map_id` text NOT NULL,
	`population` integer DEFAULT 0 NOT NULL,
	PRIMARY KEY(`map_id`, `province_id`, `ethnicity_id`),
	FOREIGN KEY (`map_id`) REFERENCES `maps`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`map_id`,`province_id`) REFERENCES `provinces`(`map_id`,`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`map_id`,`ethnicity_id`) REFERENCES `ethnicities`(`map_id`,`id`) ON UPDATE no action ON DELETE cascade
);
