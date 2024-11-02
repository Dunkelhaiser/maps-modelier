import { randomUUID } from "crypto";
import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const maps = sqliteTable("maps", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => randomUUID()),
    name: text("name").notNull(),
    imgPath: text("imgPath"),
    createdAt: integer("createdAt", { mode: "timestamp" })
        .notNull()
        .default(sql`(unixepoch())`),
    updatedAt: integer("updatedAt", { mode: "timestamp" })
        .notNull()
        .default(sql`(unixepoch())`),
});

export const provinces = sqliteTable("provinces", {
    id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    color: text("color").unique().notNull(),
    type: text("type").notNull(),
});
