import { desc, SQL } from "drizzle-orm";
import { SQLiteColumn } from "drizzle-orm/sqlite-core";

export const orderBy = (column: SQL | SQLiteColumn, sortOrder: "asc" | "desc" = "asc") => {
    return sortOrder === "desc" ? desc(column) : column;
};
