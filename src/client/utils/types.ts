import { InferSelectModel } from "drizzle-orm";
import { maps } from "@/db/schema";

export type Map = InferSelectModel<typeof maps>;

export type ActiveMap = Map & { imageUrl: string };
