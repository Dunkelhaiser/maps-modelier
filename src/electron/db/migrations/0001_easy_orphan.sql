CREATE TABLE `countries` (
	`tag` text NOT NULL,
	`map_id` text NOT NULL,
	`name` text NOT NULL,
	`color` text DEFAULT '#39654a' NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer DEFAULT (unixepoch()) NOT NULL,
	PRIMARY KEY(`map_id`, `tag`),
	FOREIGN KEY (`map_id`) REFERENCES `maps`(`id`) ON UPDATE no action ON DELETE cascade
);
