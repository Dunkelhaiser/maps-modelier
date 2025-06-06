import { z as zod } from "zod";
import { mapName } from "./shared.js";

export const renameMapSchema = zod.object({
    name: mapName,
});

export type RenameMapInput = zod.infer<typeof renameMapSchema>;
