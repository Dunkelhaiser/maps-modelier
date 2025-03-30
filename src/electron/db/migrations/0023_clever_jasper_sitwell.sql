PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_parliaments` (
	`id` integer NOT NULL,
	`map_id` text NOT NULL,
	`country_id` integer NOT NULL,
	`name` text NOT NULL,
	`total_seats` integer NOT NULL,
	`coalition_leader_id` integer,
	`opposition_leader_id` integer,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer DEFAULT (unixepoch()) NOT NULL,
	PRIMARY KEY(`map_id`, `id`),
	FOREIGN KEY (`map_id`) REFERENCES `maps`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`map_id`,`country_id`) REFERENCES `countries`(`map_id`,`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`map_id`,`coalition_leader_id`) REFERENCES `politicians`(`map_id`,`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`map_id`,`opposition_leader_id`) REFERENCES `politicians`(`map_id`,`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
INSERT INTO `__new_parliaments`("id", "map_id", "country_id", "name", "total_seats", "createdAt", "updatedAt") SELECT "id", "map_id", "country_id", "name", "total_seats", "createdAt", "updatedAt" FROM `parliaments`;--> statement-breakpoint
DROP TABLE `parliaments`;--> statement-breakpoint
ALTER TABLE `__new_parliaments` RENAME TO `parliaments`;--> statement-breakpoint
PRAGMA foreign_keys=ON;