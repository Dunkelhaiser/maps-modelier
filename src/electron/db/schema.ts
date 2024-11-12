import { randomUUID } from "crypto";
import { sql } from "drizzle-orm";
import { integer, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";

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

export const provinces = sqliteTable(
    "provinces",
    {
        id: integer("id").notNull(),
        mapId: text("map_id")
            .notNull()
            .references(() => maps.id, { onDelete: "cascade" }),
        color: text("color").notNull(),
        type: text("type").notNull().default("land"),
        shape: text("shape", { mode: "json" })
            .$type<number[][]>()
            .notNull()
            .default(sql`(json_array())`),
    },
    (table) => ({
        pk: unique("provinces_pk").on(table.mapId, table.id),
    })
);
