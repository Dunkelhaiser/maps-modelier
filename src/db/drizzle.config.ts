import type { Config } from "drizzle-kit";

export default {
    dialect: "postgresql",
    driver: "pglite",
    schema: "src/db/schema.ts",
    out: "src/db/migrations",
    dbCredentials: {
        url: "idb://pgdata",
    },
} satisfies Config;
