CREATE TABLE `heads_of_state` (
	`country_id` integer NOT NULL,
	`map_id` text NOT NULL,
	`politician_id` integer NOT NULL,
	`title` text NOT NULL,
	`start_date` integer DEFAULT (unixepoch()) NOT NULL,
	`end_date` integer,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer DEFAULT (unixepoch()) NOT NULL,
	PRIMARY KEY(`map_id`, `country_id`),
	FOREIGN KEY (`map_id`) REFERENCES `maps`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`map_id`,`country_id`) REFERENCES `countries`(`map_id`,`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`map_id`,`politician_id`) REFERENCES `politicians`(`map_id`,`id`) ON UPDATE no action ON DELETE cascade
);
