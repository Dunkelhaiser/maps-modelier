PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_wars` (
	`id` integer NOT NULL,
	`map_id` text NOT NULL,
	`name` text NOT NULL,
	`aggressor` integer NOT NULL,
	`defender` integer NOT NULL,
	`started_at` integer DEFAULT (unixepoch()) NOT NULL,
	`ended_at` integer,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	PRIMARY KEY(`map_id`, `id`),
	FOREIGN KEY (`map_id`) REFERENCES `maps`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`map_id`,`aggressor`) REFERENCES `countries`(`map_id`,`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`map_id`,`defender`) REFERENCES `countries`(`map_id`,`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
INSERT INTO `__new_wars`("id", "map_id", "name", "aggressor", "defender", "started_at", "ended_at", "created_at", "updated_at") SELECT "id", "map_id", "name", "aggressor", "defender", "started_at", "ended_at", "created_at", "updated_at" FROM `wars`;--> statement-breakpoint
DROP TABLE `wars`;--> statement-breakpoint
ALTER TABLE `__new_wars` RENAME TO `wars`;--> statement-breakpoint
PRAGMA foreign_keys=ON;