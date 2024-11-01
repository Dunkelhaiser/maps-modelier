import type { Config } from "drizzle-kit";

export default {
    dialect: "postgresql",
    driver: "pglite",
    schema: "src/client/db/schema.ts",
    out: "src/client/db/migrations",
    dbCredentials: {
        url: "idb://pgdata",
    },
} satisfies Config;
