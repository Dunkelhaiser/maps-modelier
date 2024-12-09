PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_country_states` (
	`country_tag` text NOT NULL,
	`state_id` integer NOT NULL,
	`map_id` text NOT NULL,
	PRIMARY KEY(`map_id`, `country_tag`, `state_id`),
	FOREIGN KEY (`map_id`) REFERENCES `maps`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`map_id`,`state_id`) REFERENCES `states`(`map_id`,`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`map_id`,`country_tag`) REFERENCES `countries`(`map_id`,`tag`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_country_states`("country_tag", "state_id", "map_id") SELECT "country_tag", "state_id", "map_id" FROM `country_states`;--> statement-breakpoint
DROP TABLE `country_states`;--> statement-breakpoint
ALTER TABLE `__new_country_states` RENAME TO `country_states`;--> statement-breakpoint
PRAGMA foreign_keys=ON;