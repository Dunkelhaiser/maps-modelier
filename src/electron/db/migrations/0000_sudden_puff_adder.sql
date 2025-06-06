CREATE TABLE `maps` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`imgPath` text,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `provinces` (
	`id` integer NOT NULL,
	`map_id` text NOT NULL,
	`color` text NOT NULL,
	`type` text DEFAULT 'land' NOT NULL,
	`shape` text DEFAULT (json_array()) NOT NULL,
	PRIMARY KEY(`map_id`, `id`),
	FOREIGN KEY (`map_id`) REFERENCES `maps`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `state_provinces` (
	`state_id` integer NOT NULL,
	`province_id` integer NOT NULL,
	`map_id` text NOT NULL,
	PRIMARY KEY(`state_id`, `province_id`, `map_id`),
	FOREIGN KEY (`map_id`) REFERENCES `maps`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`map_id`,`province_id`) REFERENCES `provinces`(`map_id`,`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`map_id`,`state_id`) REFERENCES `states`(`map_id`,`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `states` (
	`id` integer NOT NULL,
	`map_id` text NOT NULL,
	`name` text NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer DEFAULT (unixepoch()) NOT NULL,
	PRIMARY KEY(`map_id`, `id`),
	FOREIGN KEY (`map_id`) REFERENCES `maps`(`id`) ON UPDATE no action ON DELETE cascade
);
