import { pgTable, serial, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const maps = pgTable("maps", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt")
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
});

export const provinces = pgTable("provinces", {
    id: serial("id").primaryKey(),
    color: text("color").unique().notNull(),
    type: text("type").notNull(),
});
