CREATE TABLE `country_offmap_populations` (
	`map_id` text NOT NULL,
	`country_id` integer NOT NULL,
	`ethnicity_id` integer NOT NULL,
	`population` integer DEFAULT 0 NOT NULL,
	PRIMARY KEY(`map_id`, `country_id`, `ethnicity_id`),
	FOREIGN KEY (`map_id`) REFERENCES `maps`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`map_id`,`country_id`) REFERENCES `countries`(`map_id`,`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`map_id`,`ethnicity_id`) REFERENCES `ethnicities`(`map_id`,`id`) ON UPDATE no action ON DELETE cascade
);
