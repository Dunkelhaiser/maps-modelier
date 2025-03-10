CREATE TABLE `alliance_members` (
	`alliance_id` integer NOT NULL,
	`country_tag` text NOT NULL,
	`map_id` text NOT NULL,
	PRIMARY KEY(`map_id`, `alliance_id`, `country_tag`),
	FOREIGN KEY (`alliance_id`) REFERENCES `alliances`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`map_id`) REFERENCES `maps`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`map_id`,`alliance_id`) REFERENCES `alliances`(`map_id`,`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`map_id`,`country_tag`) REFERENCES `countries`(`map_id`,`tag`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `alliances` (
	`id` integer NOT NULL,
	`map_id` text NOT NULL,
	`leader` text,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer DEFAULT (unixepoch()) NOT NULL,
	PRIMARY KEY(`map_id`, `id`),
	FOREIGN KEY (`map_id`) REFERENCES `maps`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`map_id`,`leader`) REFERENCES `countries`(`map_id`,`tag`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `war_participants` (
	`side_id` integer NOT NULL,
	`country_tag` text NOT NULL,
	`map_id` text NOT NULL,
	PRIMARY KEY(`map_id`, `side_id`, `country_tag`),
	FOREIGN KEY (`map_id`) REFERENCES `maps`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`map_id`,`side_id`) REFERENCES `war_sides`(`map_id`,`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`map_id`,`country_tag`) REFERENCES `countries`(`map_id`,`tag`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `war_sides` (
	`id` integer NOT NULL,
	`war_id` integer NOT NULL,
	`side` text NOT NULL,
	`map_id` text NOT NULL,
	PRIMARY KEY(`map_id`, `war_id`, `id`),
	FOREIGN KEY (`map_id`) REFERENCES `maps`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`map_id`,`war_id`) REFERENCES `wars`(`map_id`,`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `wars` (
	`id` integer NOT NULL,
	`map_id` text NOT NULL,
	`name` text NOT NULL,
	`aggressor` text,
	`defender` text,
	`started_at` integer DEFAULT (unixepoch()) NOT NULL,
	`ended_at` integer,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	PRIMARY KEY(`map_id`, `id`),
	FOREIGN KEY (`map_id`) REFERENCES `maps`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`map_id`,`aggressor`) REFERENCES `countries`(`map_id`,`tag`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`map_id`,`defender`) REFERENCES `countries`(`map_id`,`tag`) ON UPDATE no action ON DELETE set null
);
