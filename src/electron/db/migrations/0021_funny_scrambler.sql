CREATE TABLE `parliament_seats` (
	`parliament_id` integer NOT NULL,
	`party_id` integer NOT NULL,
	`map_id` text NOT NULL,
	`seats` integer NOT NULL,
	PRIMARY KEY(`map_id`, `parliament_id`, `party_id`),
	FOREIGN KEY (`map_id`) REFERENCES `maps`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`map_id`,`parliament_id`) REFERENCES `parliaments`(`map_id`,`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`map_id`,`party_id`) REFERENCES `political_parties`(`map_id`,`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `parliament_speakers` (
	`parliament_id` integer NOT NULL,
	`map_id` text NOT NULL,
	`politician_id` integer NOT NULL,
	`title` text DEFAULT 'Speaker' NOT NULL,
	`start_date` integer DEFAULT (unixepoch()) NOT NULL,
	`end_date` integer,
	PRIMARY KEY(`map_id`, `parliament_id`),
	FOREIGN KEY (`map_id`) REFERENCES `maps`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`map_id`,`parliament_id`) REFERENCES `parliaments`(`map_id`,`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`map_id`,`politician_id`) REFERENCES `politicians`(`map_id`,`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `parliamentary_group_members` (
	`group_id` integer NOT NULL,
	`parliament_id` integer NOT NULL,
	`party_id` integer NOT NULL,
	`map_id` text NOT NULL,
	PRIMARY KEY(`map_id`, `parliament_id`, `group_id`, `party_id`),
	FOREIGN KEY (`map_id`) REFERENCES `maps`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`map_id`,`parliament_id`,`group_id`) REFERENCES `parliamentary_groups`(`map_id`,`parliament_id`,`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`map_id`,`party_id`) REFERENCES `political_parties`(`map_id`,`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `parliamentary_groups` (
	`id` integer NOT NULL,
	`parliament_id` integer NOT NULL,
	`map_id` text NOT NULL,
	`name` text NOT NULL,
	`type` text DEFAULT 'neutral' NOT NULL,
	`leader_id` integer,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer DEFAULT (unixepoch()) NOT NULL,
	PRIMARY KEY(`map_id`, `parliament_id`, `id`),
	FOREIGN KEY (`map_id`) REFERENCES `maps`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`map_id`,`parliament_id`) REFERENCES `parliaments`(`map_id`,`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`map_id`,`leader_id`) REFERENCES `politicians`(`map_id`,`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `parliaments` (
	`id` integer NOT NULL,
	`map_id` text NOT NULL,
	`country_id` integer NOT NULL,
	`name` text NOT NULL,
	`total_seats` integer NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer DEFAULT (unixepoch()) NOT NULL,
	PRIMARY KEY(`map_id`, `id`),
	FOREIGN KEY (`map_id`) REFERENCES `maps`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`map_id`,`country_id`) REFERENCES `countries`(`map_id`,`id`) ON UPDATE no action ON DELETE cascade
);
