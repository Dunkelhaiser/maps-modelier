import { randomUUID } from "crypto";
import { sql } from "drizzle-orm";
import { foreignKey, integer, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";

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
        pk: primaryKey({ columns: [table.mapId, table.id], name: "provinces_pk" }),
    })
);

export const states = sqliteTable(
    "states",
    {
        id: integer("id")
            .notNull()
            .$defaultFn(() => sql`(SELECT IFNULL(MAX(id), 0) + 1 FROM states WHERE map_id = map_id)`),
        mapId: text("map_id")
            .notNull()
            .references(() => maps.id, { onDelete: "cascade" }),
        name: text("name").notNull(),
        createdAt: integer("createdAt", { mode: "timestamp" })
            .notNull()
            .default(sql`(unixepoch())`),
        updatedAt: integer("updatedAt", { mode: "timestamp" })
            .notNull()
            .default(sql`(unixepoch())`),
    },
    (table) => ({
        pk: primaryKey({ columns: [table.mapId, table.id], name: "states_pk" }),
    })
);

export const stateProvinces = sqliteTable(
    "state_provinces",
    {
        stateId: integer("state_id").notNull(),
        provinceId: integer("province_id").notNull(),
        mapId: text("map_id")
            .notNull()
            .references(() => maps.id, { onDelete: "cascade" }),
    },
    (table) => ({
        pk: primaryKey({ columns: [table.stateId, table.provinceId, table.mapId], name: "state_provinces_pk" }),
        provincesReference: foreignKey({
            columns: [table.mapId, table.provinceId],
            foreignColumns: [provinces.mapId, provinces.id],
            name: "provinces_reference",
        }).onDelete("cascade"),
        statesReference: foreignKey({
            columns: [table.mapId, table.stateId],
            foreignColumns: [states.mapId, states.id],
            name: "states_reference",
        }).onDelete("cascade"),
    })
);

export const countries = sqliteTable(
    "countries",
    {
        id: integer("id")
            .notNull()
            .$defaultFn(() => sql`(SELECT IFNULL(MAX(id), 0) + 1 FROM countries WHERE map_id = map_id)`),
        mapId: text("map_id")
            .notNull()
            .references(() => maps.id, { onDelete: "cascade" }),
        name: text("name").notNull(),
        color: text("color").notNull(),
        createdAt: integer("createdAt", { mode: "timestamp" })
            .notNull()
            .default(sql`(unixepoch())`),
        updatedAt: integer("updatedAt", { mode: "timestamp" })
            .notNull()
            .default(sql`(unixepoch())`),
    },
    (table) => ({
        pk: primaryKey({ columns: [table.mapId, table.id], name: "countries_pk" }),
    })
);
