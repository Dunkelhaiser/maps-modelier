PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_countries` (
	`id` integer NOT NULL,
	`map_id` text NOT NULL,
	`color` text DEFAULT '#39654a' NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer DEFAULT (unixepoch()) NOT NULL,
	PRIMARY KEY(`map_id`, `id`),
	FOREIGN KEY (`map_id`) REFERENCES `maps`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `__new_country_anthems` (
	`country_id` integer NOT NULL,
	`map_id` text NOT NULL,
	`name` text NOT NULL,
	`path` text NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer DEFAULT (unixepoch()) NOT NULL,
	PRIMARY KEY(`map_id`, `country_id`),
	FOREIGN KEY (`map_id`) REFERENCES `maps`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`map_id`,`country_id`) REFERENCES `countries`(`map_id`,`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
DROP TABLE `country_anthems`;--> statement-breakpoint
ALTER TABLE `__new_country_anthems` RENAME TO `country_anthems`;--> statement-breakpoint
CREATE TABLE `__new_country_coat_of_arms` (
	`country_id` integer NOT NULL,
	`map_id` text NOT NULL,
	`path` text NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer DEFAULT (unixepoch()) NOT NULL,
	PRIMARY KEY(`map_id`, `country_id`),
	FOREIGN KEY (`map_id`) REFERENCES `maps`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`map_id`,`country_id`) REFERENCES `countries`(`map_id`,`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
DROP TABLE `country_coat_of_arms`;--> statement-breakpoint
ALTER TABLE `__new_country_coat_of_arms` RENAME TO `country_coat_of_arms`;--> statement-breakpoint
CREATE TABLE `__new_country_flags` (
	`country_id` integer NOT NULL,
	`map_id` text NOT NULL,
	`path` text NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer DEFAULT (unixepoch()) NOT NULL,
	PRIMARY KEY(`map_id`, `country_id`),
	FOREIGN KEY (`map_id`) REFERENCES `maps`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`map_id`,`country_id`) REFERENCES `countries`(`map_id`,`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
DROP TABLE `country_flags`;--> statement-breakpoint
ALTER TABLE `__new_country_flags` RENAME TO `country_flags`;--> statement-breakpoint
CREATE TABLE `__new_country_names` (
	`country_id` integer NOT NULL,
	`map_id` text NOT NULL,
	`common_name` text NOT NULL,
	`official_name` text,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer DEFAULT (unixepoch()) NOT NULL,
	PRIMARY KEY(`map_id`, `country_id`),
	FOREIGN KEY (`map_id`) REFERENCES `maps`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`map_id`,`country_id`) REFERENCES `countries`(`map_id`,`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
DROP TABLE `country_names`;--> statement-breakpoint
ALTER TABLE `__new_country_names` RENAME TO `country_names`;--> statement-breakpoint
CREATE TABLE `__new_country_states` (
	`country_id` integer NOT NULL,
	`state_id` integer NOT NULL,
	`map_id` text NOT NULL,
	PRIMARY KEY(`map_id`, `country_id`, `state_id`),
	FOREIGN KEY (`map_id`) REFERENCES `maps`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`map_id`,`state_id`) REFERENCES `states`(`map_id`,`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`map_id`,`country_id`) REFERENCES `countries`(`map_id`,`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
DROP TABLE `country_states`;--> statement-breakpoint
ALTER TABLE `__new_country_states` RENAME TO `country_states`;--> statement-breakpoint
DROP TABLE `war_participants`;--> statement-breakpoint
DROP TABLE `war_sides`;--> statement-breakpoint
DROP TABLE `alliance_members`;--> statement-breakpoint
DROP TABLE `alliances`;--> statement-breakpoint
CREATE TABLE `alliances` (
	`id` integer NOT NULL,
	`map_id` text NOT NULL,
	`leader` integer,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer DEFAULT (unixepoch()) NOT NULL,
	PRIMARY KEY(`map_id`, `id`),
	FOREIGN KEY (`map_id`) REFERENCES `maps`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`map_id`,`leader`) REFERENCES `countries`(`map_id`,`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
DROP TABLE `wars`;--> statement-breakpoint
CREATE TABLE `wars` (
	`id` integer NOT NULL,
	`map_id` text NOT NULL,
	`name` text NOT NULL,
	`aggressor` integer,
	`defender` integer,
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
CREATE TABLE `war_sides` (
    `id` integer NOT NULL,
    `war_id` integer NOT NULL,
    `side` text NOT NULL,
    `map_id` text NOT NULL,
    PRIMARY KEY(`map_id`, `war_id`, `id`),
    FOREIGN KEY (`map_id`) REFERENCES `maps`(`id`) ON UPDATE no action ON DELETE cascade
	FOREIGN KEY (`map_id`,`war_id`) REFERENCES `wars`(`map_id`,`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `war_participants` (
	`side_id` integer NOT NULL,
	`war_id` integer NOT NULL,
	`country_id` integer NOT NULL,
	`map_id` text NOT NULL,
	PRIMARY KEY(`map_id`, `side_id`, `country_id`),
	FOREIGN KEY (`map_id`) REFERENCES `maps`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`map_id`,`country_id`) REFERENCES `countries`(`map_id`,`id`) ON UPDATE no action ON DELETE cascade
	FOREIGN KEY (`map_id`,`war_id`,`side_id`) REFERENCES `war_sides`(`map_id`,`war_id`, `id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `alliance_members` (
	`alliance_id` integer NOT NULL,
	`country_id` integer NOT NULL,
	`map_id` text NOT NULL,
	PRIMARY KEY(`map_id`, `alliance_id`, `country_id`),
	FOREIGN KEY (`map_id`) REFERENCES `maps`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`map_id`,`alliance_id`) REFERENCES `alliances`(`map_id`,`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`map_id`,`country_id`) REFERENCES `countries`(`map_id`,`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
DROP TABLE `countries`;--> statement-breakpoint
ALTER TABLE `__new_countries` RENAME TO `countries`;