import { pgTable, serial, text } from "drizzle-orm/pg-core";

export const provinces = pgTable("provinces", {
    id: serial("id").primaryKey(),
    color: text("color").unique().notNull(),
    type: text("type").notNull(),
});
