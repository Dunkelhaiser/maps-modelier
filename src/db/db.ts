import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";

export const sql = new PGlite("idb://pgdata");

export const db = drizzle(sql);
