CREATE TABLE `countries` (
	`id` integer NOT NULL,
	`map_id` text NOT NULL,
	`name` text NOT NULL,
	`color` text NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer DEFAULT (unixepoch()) NOT NULL,
	PRIMARY KEY(`map_id`, `id`),
	FOREIGN KEY (`map_id`) REFERENCES `maps`(`id`) ON UPDATE no action ON DELETE cascade
);
