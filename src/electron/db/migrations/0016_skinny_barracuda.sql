CREATE TABLE `ideologies` (
	`id` integer NOT NULL,
	`map_id` text NOT NULL,
	`name` text NOT NULL,
	`color` text DEFAULT '#808080' NOT NULL,
	`parent_id` integer,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer DEFAULT (unixepoch()) NOT NULL,
	PRIMARY KEY(`map_id`, `id`),
	FOREIGN KEY (`map_id`) REFERENCES `maps`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `party_ideologies` (
	`party_id` integer NOT NULL,
	`ideology_id` integer NOT NULL,
	`map_id` text NOT NULL,
	`is_primary` integer DEFAULT false NOT NULL,
	PRIMARY KEY(`map_id`, `party_id`, `ideology_id`),
	FOREIGN KEY (`map_id`) REFERENCES `maps`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`map_id`,`party_id`) REFERENCES `political_parties`(`map_id`,`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`map_id`,`ideology_id`) REFERENCES `ideologies`(`map_id`,`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `political_parties` (
	`id` integer NOT NULL,
	`map_id` text NOT NULL,
	`country_id` integer NOT NULL,
	`name` text NOT NULL,
	`color` text DEFAULT '#808080' NOT NULL,
	`leader_id` integer,
	`founded_at` integer,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer DEFAULT (unixepoch()) NOT NULL,
	PRIMARY KEY(`map_id`, `id`),
	FOREIGN KEY (`map_id`) REFERENCES `maps`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`map_id`,`leader_id`) REFERENCES `politicians`(`map_id`,`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`map_id`,`country_id`) REFERENCES `countries`(`map_id`,`id`) ON UPDATE no action ON DELETE cascade
);
