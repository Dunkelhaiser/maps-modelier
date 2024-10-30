CREATE TABLE IF NOT EXISTS "provinces" (
	"id" serial PRIMARY KEY NOT NULL,
	"color" text NOT NULL,
	"type" text NOT NULL,
	CONSTRAINT "provinces_color_unique" UNIQUE("color")
);
