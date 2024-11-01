export const sqlSchema = `
    CREATE TABLE IF NOT EXISTS "provinces" (
        "id" serial PRIMARY KEY NOT NULL,
        "color" text NOT NULL,
        "type" text NOT NULL,
        CONSTRAINT "provinces_color_unique" UNIQUE("color")
    );
    
    CREATE TABLE IF NOT EXISTS "maps" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "name" text NOT NULL,
        "checksum" text NOT NULL,
        "createdAt" timestamp DEFAULT now() NOT NULL,
        "updatedAt" timestamp DEFAULT now() NOT NULL
    );
`;
