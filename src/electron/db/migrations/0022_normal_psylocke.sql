DROP TABLE `parliamentary_group_members`;--> statement-breakpoint
DROP TABLE `parliamentary_groups`;--> statement-breakpoint
ALTER TABLE `parliament_seats` ADD `side` text DEFAULT 'neutral' NOT NULL;