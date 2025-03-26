CREATE TABLE `party_members` (
	`party_id` integer NOT NULL,
	`politician_id` integer NOT NULL,
	`map_id` text NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer DEFAULT (unixepoch()) NOT NULL,
	PRIMARY KEY(`map_id`, `party_id`, `politician_id`),
	FOREIGN KEY (`map_id`) REFERENCES `maps`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`map_id`,`party_id`) REFERENCES `political_parties`(`map_id`,`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`map_id`,`politician_id`) REFERENCES `politicians`(`map_id`,`id`) ON UPDATE no action ON DELETE cascade
);
