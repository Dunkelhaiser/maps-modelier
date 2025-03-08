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

export const ethnicities = sqliteTable(
    "ethnicities",
    {
        id: integer("id")
            .notNull()
            .$defaultFn(() => sql`(SELECT IFNULL(MAX(id), 0) + 1 FROM ethnicities WHERE map_id = map_id)`),
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
        pk: primaryKey({ columns: [table.mapId, table.id], name: "ethnicities_pk" }),
    })
);

export const provincePopulations = sqliteTable(
    "province_populations",
    {
        provinceId: integer("province_id").notNull(),
        ethnicityId: integer("ethnicity_id").notNull(),
        mapId: text("map_id")
            .notNull()
            .references(() => maps.id, { onDelete: "cascade" }),
        population: integer("population").notNull().default(0),
    },
    (table) => ({
        pk: primaryKey({
            columns: [table.mapId, table.provinceId, table.ethnicityId],
            name: "province_populations_pk",
        }),
        provincesReference: foreignKey({
            columns: [table.mapId, table.provinceId],
            foreignColumns: [provinces.mapId, provinces.id],
            name: "provinces_reference",
        }).onDelete("cascade"),
        ethnicitiesReference: foreignKey({
            columns: [table.mapId, table.ethnicityId],
            foreignColumns: [ethnicities.mapId, ethnicities.id],
            name: "ethnicities_reference",
        }).onDelete("cascade"),
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
        type: text("type").notNull(),
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
        tag: text("tag").notNull(),
        mapId: text("map_id")
            .notNull()
            .references(() => maps.id, { onDelete: "cascade" }),
        name: text("name").notNull(),
        color: text("color").notNull().default("#39654a"),
        flag: text("flag").notNull(),
        coatOfArms: text("coat_of_arms").notNull(),
        anthemName: text("anthem_name").notNull(),
        anthemPath: text("anthem_path").notNull(),
        createdAt: integer("createdAt", { mode: "timestamp" })
            .notNull()
            .default(sql`(unixepoch())`),
        updatedAt: integer("updatedAt", { mode: "timestamp" })
            .notNull()
            .default(sql`(unixepoch())`),
    },
    (table) => ({
        pk: primaryKey({ columns: [table.mapId, table.tag], name: "countries_pk" }),
    })
);

export const countryStates = sqliteTable(
    "country_states",
    {
        countryTag: text("country_tag").notNull(),
        stateId: integer("state_id").notNull(),
        mapId: text("map_id")
            .notNull()
            .references(() => maps.id, { onDelete: "cascade" }),
    },
    (table) => {
        return {
            pk: primaryKey({ columns: [table.mapId, table.countryTag, table.stateId], name: "country_states_pk" }),
            statesReference: foreignKey({
                columns: [table.mapId, table.stateId],
                foreignColumns: [states.mapId, states.id],
                name: "states_reference",
            }).onDelete("cascade"),
            countriesReference: foreignKey({
                columns: [table.mapId, table.countryTag],
                foreignColumns: [countries.mapId, countries.tag],
                name: "countries_reference",
            })
                .onDelete("cascade")
                .onUpdate("cascade"),
        };
    }
);

export const alliances = sqliteTable(
    "alliances",
    {
        id: integer("id")
            .notNull()
            .$defaultFn(() => sql`(SELECT IFNULL(MAX(id), 0) + 1 FROM alliances WHERE map_id = map_id)`),
        mapId: text("map_id")
            .notNull()
            .references(() => maps.id, { onDelete: "cascade" }),
        leader: text("leader").references(() => countries.tag, { onDelete: "set null" }),
        name: text("name").notNull(),
        type: text("type").notNull(),
        createdAt: integer("createdAt", { mode: "timestamp" })
            .notNull()
            .default(sql`(unixepoch())`),
        updatedAt: integer("updatedAt", { mode: "timestamp" })
            .notNull()
            .default(sql`(unixepoch())`),
    },
    (table) => ({
        pk: primaryKey({ columns: [table.mapId, table.id], name: "alliances_pk" }),
    })
);

export const allianceMembers = sqliteTable(
    "alliance_members",
    {
        allianceId: integer("alliance_id")
            .notNull()
            .references(() => alliances.id, { onDelete: "cascade" }),
        countryTag: text("country_tag")
            .notNull()
            .references(() => countries.tag, { onDelete: "cascade" }),
        mapId: text("map_id")
            .notNull()
            .references(() => maps.id, { onDelete: "cascade" }),
    },
    (table) => ({
        pk: primaryKey({ columns: [table.mapId, table.allianceId, table.countryTag], name: "alliance_members_pk" }),
        alliancesReference: foreignKey({
            columns: [table.mapId, table.allianceId],
            foreignColumns: [alliances.mapId, alliances.id],
            name: "alliances_reference",
        }).onDelete("cascade"),
        countriesReference: foreignKey({
            columns: [table.mapId, table.countryTag],
            foreignColumns: [countries.mapId, countries.tag],
            name: "countries_reference",
        }).onDelete("cascade"),
    })
);
