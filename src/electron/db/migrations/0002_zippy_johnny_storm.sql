CREATE TABLE `country_states` (
	`country_tag` text NOT NULL,
	`state_id` integer NOT NULL,
	`map_id` text NOT NULL,
	PRIMARY KEY(`map_id`, `country_tag`, `state_id`),
	FOREIGN KEY (`map_id`) REFERENCES `maps`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`map_id`,`state_id`) REFERENCES `states`(`map_id`,`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`map_id`,`country_tag`) REFERENCES `countries`(`map_id`,`tag`) ON UPDATE no action ON DELETE cascade
);
