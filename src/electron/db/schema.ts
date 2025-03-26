import { randomUUID } from "crypto";
import { relations, sql } from "drizzle-orm";
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

const provinceType = ["land", "water"] as const;

export const provinces = sqliteTable(
    "provinces",
    {
        id: integer("id").notNull(),
        mapId: text("map_id")
            .notNull()
            .references(() => maps.id, { onDelete: "cascade" }),
        color: text("color").notNull(),
        type: text("type", { enum: provinceType }).notNull().default("land"),
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
        color: text("color").notNull().default("#39654a"),
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
        type: text("type", { enum: provinceType }).notNull(),
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
        color: text("color").notNull().default("#39654a"),
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

export const countryNames = sqliteTable(
    "country_names",
    {
        countryId: integer("country_id").notNull(),
        mapId: text("map_id")
            .notNull()
            .references(() => maps.id, { onDelete: "cascade" }),
        commonName: text("common_name").notNull(),
        officialName: text("official_name"),
        createdAt: integer("createdAt", { mode: "timestamp" })
            .notNull()
            .default(sql`(unixepoch())`),
        updatedAt: integer("updatedAt", { mode: "timestamp" })
            .notNull()
            .default(sql`(unixepoch())`),
    },
    (table) => ({
        pk: primaryKey({ columns: [table.mapId, table.countryId], name: "country_names_pk" }),
        countriesReference: foreignKey({
            columns: [table.mapId, table.countryId],
            foreignColumns: [countries.mapId, countries.id],
            name: "country_names_countries_reference",
        })
            .onDelete("cascade")
            .onUpdate("cascade"),
    })
);

export const countryFlags = sqliteTable(
    "country_flags",
    {
        countryId: integer("country_id").notNull(),
        mapId: text("map_id")
            .notNull()
            .references(() => maps.id, { onDelete: "cascade" }),
        path: text("path").notNull(),
        createdAt: integer("createdAt", { mode: "timestamp" })
            .notNull()
            .default(sql`(unixepoch())`),
        updatedAt: integer("updatedAt", { mode: "timestamp" })
            .notNull()
            .default(sql`(unixepoch())`),
    },
    (table) => ({
        pk: primaryKey({ columns: [table.mapId, table.countryId], name: "country_flags_pk" }),
        countriesReference: foreignKey({
            columns: [table.mapId, table.countryId],
            foreignColumns: [countries.mapId, countries.id],
            name: "country_flags_countries_reference",
        })
            .onDelete("cascade")
            .onUpdate("cascade"),
    })
);

export const countryCoatOfArms = sqliteTable(
    "country_coat_of_arms",
    {
        countryId: integer("country_id").notNull(),
        mapId: text("map_id")
            .notNull()
            .references(() => maps.id, { onDelete: "cascade" }),
        path: text("path").notNull(),
        createdAt: integer("createdAt", { mode: "timestamp" })
            .notNull()
            .default(sql`(unixepoch())`),
        updatedAt: integer("updatedAt", { mode: "timestamp" })
            .notNull()
            .default(sql`(unixepoch())`),
    },
    (table) => ({
        pk: primaryKey({ columns: [table.mapId, table.countryId], name: "country_coat_of_arms_pk" }),
        countriesReference: foreignKey({
            columns: [table.mapId, table.countryId],
            foreignColumns: [countries.mapId, countries.id],
            name: "country_coat_of_arms_countries_reference",
        })
            .onDelete("cascade")
            .onUpdate("cascade"),
    })
);

export const countryAnthems = sqliteTable(
    "country_anthems",
    {
        countryId: integer("country_id").notNull(),
        mapId: text("map_id")
            .notNull()
            .references(() => maps.id, { onDelete: "cascade" }),
        name: text("name").notNull(),
        path: text("path").notNull(),
        createdAt: integer("createdAt", { mode: "timestamp" })
            .notNull()
            .default(sql`(unixepoch())`),
        updatedAt: integer("updatedAt", { mode: "timestamp" })
            .notNull()
            .default(sql`(unixepoch())`),
    },
    (table) => ({
        pk: primaryKey({ columns: [table.mapId, table.countryId], name: "country_anthems_pk" }),
        countriesReference: foreignKey({
            columns: [table.mapId, table.countryId],
            foreignColumns: [countries.mapId, countries.id],
            name: "country_anthems_countries_reference",
        })
            .onDelete("cascade")
            .onUpdate("cascade"),
    })
);

export const countryStates = sqliteTable(
    "country_states",
    {
        countryId: integer("country_id").notNull(),
        stateId: integer("state_id").notNull(),
        mapId: text("map_id")
            .notNull()
            .references(() => maps.id, { onDelete: "cascade" }),
    },
    (table) => {
        return {
            pk: primaryKey({ columns: [table.mapId, table.countryId, table.stateId], name: "country_states_pk" }),
            statesReference: foreignKey({
                columns: [table.mapId, table.stateId],
                foreignColumns: [states.mapId, states.id],
                name: "states_reference",
            }).onDelete("cascade"),
            countriesReference: foreignKey({
                columns: [table.mapId, table.countryId],
                foreignColumns: [countries.mapId, countries.id],
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
        leader: integer("leader"),
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
        leaderReference: foreignKey({
            columns: [table.mapId, table.leader],
            foreignColumns: [countries.mapId, countries.id],
            name: "leader_reference",
        }).onDelete("set null"),
    })
);

export const allianceMembers = sqliteTable(
    "alliance_members",
    {
        allianceId: integer("alliance_id").notNull(),
        countryId: integer("country_id").notNull(),
        mapId: text("map_id")
            .notNull()
            .references(() => maps.id, { onDelete: "cascade" }),
    },
    (table) => ({
        pk: primaryKey({ columns: [table.mapId, table.allianceId, table.countryId], name: "alliance_members_pk" }),
        alliancesReference: foreignKey({
            columns: [table.mapId, table.allianceId],
            foreignColumns: [alliances.mapId, alliances.id],
            name: "alliances_reference",
        }).onDelete("cascade"),
        countriesReference: foreignKey({
            columns: [table.mapId, table.countryId],
            foreignColumns: [countries.mapId, countries.id],
            name: "countries_reference",
        }).onDelete("cascade"),
    })
);

export const wars = sqliteTable(
    "wars",
    {
        id: integer("id")
            .notNull()
            .$defaultFn(() => sql`(SELECT IFNULL(MAX(id), 0) + 1 FROM wars WHERE map_id = map_id)`),
        mapId: text("map_id")
            .notNull()
            .references(() => maps.id, { onDelete: "cascade" }),
        name: text("name").notNull(),
        aggressor: integer("aggressor").notNull(),
        defender: integer("defender").notNull(),
        startedAt: integer("started_at", { mode: "timestamp" })
            .notNull()
            .default(sql`(unixepoch())`),
        endedAt: integer("ended_at", { mode: "timestamp" }),
        createdAt: integer("created_at", { mode: "timestamp" })
            .notNull()
            .default(sql`(unixepoch())`),
        updatedAt: integer("updated_at", { mode: "timestamp" })
            .notNull()
            .default(sql`(unixepoch())`),
    },
    (table) => ({
        pk: primaryKey({ columns: [table.mapId, table.id], name: "wars_pk" }),
        aggressorReference: foreignKey({
            columns: [table.mapId, table.aggressor],
            foreignColumns: [countries.mapId, countries.id],
            name: "aggressor_reference",
        }).onDelete("set null"),
        defenderReference: foreignKey({
            columns: [table.mapId, table.defender],
            foreignColumns: [countries.mapId, countries.id],
            name: "defender_reference",
        }).onDelete("set null"),
    })
);

export const warSides = sqliteTable(
    "war_sides",
    {
        id: integer("id")
            .notNull()
            .$defaultFn(() => sql`(SELECT IFNULL(MAX(id), 0) + 1 FROM war_sides WHERE war_id = war_id)`),
        warId: integer("war_id").notNull(),
        side: text("side").notNull(),
        mapId: text("map_id")
            .notNull()
            .references(() => maps.id, { onDelete: "cascade" }),
    },
    (table) => ({
        pk: primaryKey({ columns: [table.mapId, table.warId, table.id], name: "war_sides_pk" }),
        warsReference: foreignKey({
            columns: [table.mapId, table.warId],
            foreignColumns: [wars.mapId, wars.id],
            name: "wars_reference",
        }).onDelete("cascade"),
    })
);

export const warParticipants = sqliteTable(
    "war_participants",
    {
        sideId: integer("side_id").notNull(),
        warId: integer("war_id").notNull(),
        countryId: integer("country_id").notNull(),
        mapId: text("map_id")
            .notNull()
            .references(() => maps.id, { onDelete: "cascade" }),
    },
    (table) => ({
        pk: primaryKey({ columns: [table.mapId, table.sideId, table.countryId], name: "war_participants_pk" }),
        warSidesReference: foreignKey({
            columns: [table.mapId, table.warId, table.sideId],
            foreignColumns: [warSides.mapId, warSides.warId, warSides.id],
            name: "war_sides_reference",
        }).onDelete("cascade"),
        countriesReference: foreignKey({
            columns: [table.mapId, table.countryId],
            foreignColumns: [countries.mapId, countries.id],
            name: "countries_reference",
        }).onDelete("cascade"),
    })
);

export const politicians = sqliteTable(
    "politicians",
    {
        id: integer("id")
            .notNull()
            .$defaultFn(() => sql`(SELECT IFNULL(MAX(id), 0) + 1 FROM politicians WHERE map_id = map_id)`),
        mapId: text("map_id")
            .notNull()
            .references(() => maps.id, { onDelete: "cascade" }),
        countryId: integer("country_id").notNull(),
        name: text("name").notNull(),
        portrait: text("portrait"),
        createdAt: integer("createdAt", { mode: "timestamp" })
            .notNull()
            .default(sql`(unixepoch())`),
        updatedAt: integer("updatedAt", { mode: "timestamp" })
            .notNull()
            .default(sql`(unixepoch())`),
    },
    (table) => ({
        pk: primaryKey({ columns: [table.mapId, table.id], name: "politicians_pk" }),
        countryReference: foreignKey({
            columns: [table.mapId, table.countryId],
            foreignColumns: [countries.mapId, countries.id],
            name: "politician_country_reference",
        }).onDelete("cascade"),
    })
);

export const headsOfState = sqliteTable(
    "heads_of_state",
    {
        countryId: integer("country_id").notNull(),
        mapId: text("map_id")
            .notNull()
            .references(() => maps.id, { onDelete: "cascade" }),
        politicianId: integer("politician_id").notNull(),
        title: text("title").notNull(),
        startDate: integer("start_date", { mode: "timestamp" })
            .notNull()
            .default(sql`(unixepoch())`),
        endDate: integer("end_date", { mode: "timestamp" }),
        createdAt: integer("createdAt", { mode: "timestamp" })
            .notNull()
            .default(sql`(unixepoch())`),
        updatedAt: integer("updatedAt", { mode: "timestamp" })
            .notNull()
            .default(sql`(unixepoch())`),
    },
    (table) => ({
        pk: primaryKey({ columns: [table.mapId, table.countryId], name: "heads_of_state_pk" }),
        countriesReference: foreignKey({
            columns: [table.mapId, table.countryId],
            foreignColumns: [countries.mapId, countries.id],
            name: "heads_of_state_countries_reference",
        })
            .onDelete("cascade")
            .onUpdate("cascade"),
        politicianReference: foreignKey({
            columns: [table.mapId, table.politicianId],
            foreignColumns: [politicians.mapId, politicians.id],
            name: "head_of_state_politician_reference",
        }).onDelete("cascade"),
    })
);

export const headsOfGovernment = sqliteTable(
    "heads_of_government",
    {
        countryId: integer("country_id").notNull(),
        mapId: text("map_id")
            .notNull()
            .references(() => maps.id, { onDelete: "cascade" }),
        politicianId: integer("politician_id").notNull(),
        title: text("title").notNull(),
        startDate: integer("start_date", { mode: "timestamp" })
            .notNull()
            .default(sql`(unixepoch())`),
        endDate: integer("end_date", { mode: "timestamp" }),
        createdAt: integer("createdAt", { mode: "timestamp" })
            .notNull()
            .default(sql`(unixepoch())`),
        updatedAt: integer("updatedAt", { mode: "timestamp" })
            .notNull()
            .default(sql`(unixepoch())`),
    },
    (table) => ({
        pk: primaryKey({ columns: [table.mapId, table.countryId], name: "heads_of_government_pk" }),
        countriesReference: foreignKey({
            columns: [table.mapId, table.countryId],
            foreignColumns: [countries.mapId, countries.id],
            name: "heads_of_government_countries_reference",
        })
            .onDelete("cascade")
            .onUpdate("cascade"),
        politicianReference: foreignKey({
            columns: [table.mapId, table.politicianId],
            foreignColumns: [politicians.mapId, politicians.id],
            name: "head_of_government_politician_reference",
        }).onDelete("cascade"),
    })
);

export const ideologies = sqliteTable(
    "ideologies",
    {
        id: integer("id")
            .notNull()
            .$defaultFn(() => sql`(SELECT IFNULL(MAX(id), 0) + 1 FROM ideologies WHERE map_id = map_id)`),
        mapId: text("map_id")
            .notNull()
            .references(() => maps.id, { onDelete: "cascade" }),
        name: text("name").notNull(),
        color: text("color").notNull().default("#808080"),
        parentId: integer("parent_id"),
        createdAt: integer("createdAt", { mode: "timestamp" })
            .notNull()
            .default(sql`(unixepoch())`),
        updatedAt: integer("updatedAt", { mode: "timestamp" })
            .notNull()
            .default(sql`(unixepoch())`),
    },
    (table) => ({
        pk: primaryKey({ columns: [table.mapId, table.id], name: "ideologies_pk" }),
    })
);

export const ideologiesRelations = relations(ideologies, ({ one }) => ({
    parent: one(ideologies, {
        fields: [ideologies.mapId, ideologies.parentId],
        references: [ideologies.mapId, ideologies.id],
        relationName: "ideology_parent",
    }),
}));

export const politicalParties = sqliteTable(
    "political_parties",
    {
        id: integer("id")
            .notNull()
            .$defaultFn(() => sql`(SELECT IFNULL(MAX(id), 0) + 1 FROM political_parties WHERE map_id = map_id)`),
        mapId: text("map_id")
            .notNull()
            .references(() => maps.id, { onDelete: "cascade" }),
        countryId: integer("country_id").notNull(),
        name: text("name").notNull(),
        color: text("color").notNull().default("#808080"),
        leaderId: integer("leader_id"),
        foundedAt: integer("founded_at", { mode: "timestamp" }),
        createdAt: integer("createdAt", { mode: "timestamp" })
            .notNull()
            .default(sql`(unixepoch())`),
        updatedAt: integer("updatedAt", { mode: "timestamp" })
            .notNull()
            .default(sql`(unixepoch())`),
    },
    (table) => ({
        pk: primaryKey({ columns: [table.mapId, table.id], name: "political_parties_pk" }),
        leaderReference: foreignKey({
            columns: [table.mapId, table.leaderId],
            foreignColumns: [politicians.mapId, politicians.id],
            name: "party_leader_reference",
        }).onDelete("set null"),
        countryReference: foreignKey({
            columns: [table.mapId, table.countryId],
            foreignColumns: [countries.mapId, countries.id],
            name: "party_country_reference",
        }).onDelete("cascade"),
    })
);

export const partyIdeologies = sqliteTable(
    "party_ideologies",
    {
        partyId: integer("party_id").notNull(),
        ideologyId: integer("ideology_id").notNull(),
        mapId: text("map_id")
            .notNull()
            .references(() => maps.id, { onDelete: "cascade" }),
        isPrimary: integer("is_primary", { mode: "boolean" }).notNull().default(false),
    },
    (table) => ({
        pk: primaryKey({ columns: [table.mapId, table.partyId, table.ideologyId], name: "party_ideologies_pk" }),
        partyReference: foreignKey({
            columns: [table.mapId, table.partyId],
            foreignColumns: [politicalParties.mapId, politicalParties.id],
            name: "ideology_party_reference",
        }).onDelete("cascade"),
        ideologyReference: foreignKey({
            columns: [table.mapId, table.ideologyId],
            foreignColumns: [ideologies.mapId, ideologies.id],
            name: "party_ideology_reference",
        }).onDelete("cascade"),
    })
);
