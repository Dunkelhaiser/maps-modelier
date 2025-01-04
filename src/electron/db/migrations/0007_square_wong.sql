PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_countries` (
	`tag` text NOT NULL,
	`map_id` text NOT NULL,
	`name` text NOT NULL,
	`color` text DEFAULT '#39654a' NOT NULL,
	`flag` text NOT NULL,
	`coat_of_arms` text NOT NULL,
	`anthem_name` text NOT NULL,
	`anthem_path` text NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer DEFAULT (unixepoch()) NOT NULL,
	PRIMARY KEY(`map_id`, `tag`),
	FOREIGN KEY (`map_id`) REFERENCES `maps`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_countries`("tag", "map_id", "name", "color", "flag", "coat_of_arms", "anthem_name", "anthem_path", "createdAt", "updatedAt") SELECT "tag", "map_id", "name", "color", "flag", "coat_of_arms", "anthem_name", "anthem_path", "createdAt", "updatedAt" FROM `countries`;--> statement-breakpoint
DROP TABLE `countries`;--> statement-breakpoint
ALTER TABLE `__new_countries` RENAME TO `countries`;--> statement-breakpoint
PRAGMA foreign_keys=ON;