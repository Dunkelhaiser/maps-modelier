import type { Config } from "drizzle-kit";

export default {
    dialect: "sqlite",
    schema: "src/electron/db/schema.ts",
    out: "src/electron/db/migrations",
    dbCredentials: {
        url: "sqlite.db",
    },
} satisfies Config;
