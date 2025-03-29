PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_political_parties` (
	`id` integer NOT NULL,
	`map_id` text NOT NULL,
	`country_id` integer NOT NULL,
	`name` text NOT NULL,
	`acronym` text,
	`color` text DEFAULT '#808080' NOT NULL,
	`leader_id` integer NOT NULL,
	`members_count` integer DEFAULT 1 NOT NULL,
	`founded_at` integer,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer DEFAULT (unixepoch()) NOT NULL,
	PRIMARY KEY(`map_id`, `id`),
	FOREIGN KEY (`map_id`) REFERENCES `maps`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`map_id`,`leader_id`) REFERENCES `politicians`(`map_id`,`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`map_id`,`country_id`) REFERENCES `countries`(`map_id`,`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_political_parties`("id", "map_id", "country_id", "name", "acronym", "color", "leader_id", "members_count", "founded_at", "createdAt", "updatedAt") SELECT "id", "map_id", "country_id", "name", "acronym", "color", "leader_id", "members_count", "founded_at", "createdAt", "updatedAt" FROM `political_parties`;--> statement-breakpoint
DROP TABLE `political_parties`;--> statement-breakpoint
ALTER TABLE `__new_political_parties` RENAME TO `political_parties`;--> statement-breakpoint
PRAGMA foreign_keys=ON;