import { InferSelectModel } from "drizzle-orm";
import { maps, provinces } from "../../electron/db/schema";

export type Map = InferSelectModel<typeof maps>;

export type ActiveMap = Map & { imageUrl: string };

export type Province = Omit<InferSelectModel<typeof provinces>, "mapId">;
