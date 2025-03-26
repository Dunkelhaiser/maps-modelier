CREATE TABLE `politicians` (
	`id` integer NOT NULL,
	`map_id` text NOT NULL,
	`name` text NOT NULL,
	`portrait` text,
	`country_id` integer NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer DEFAULT (unixepoch()) NOT NULL,
	PRIMARY KEY(`map_id`, `id`),
	FOREIGN KEY (`map_id`) REFERENCES `maps`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`map_id`,`country_id`) REFERENCES `countries`(`map_id`,`id`) ON UPDATE no action ON DELETE cascade
);
