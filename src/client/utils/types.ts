import { InferSelectModel } from "drizzle-orm";
import { maps, provinces } from "../../electron/db/schema";

export type Map = InferSelectModel<typeof maps>;

export type ActiveMap = Map & { imageUrl: string };

type Type = "land" | "water";

export interface Province extends Omit<InferSelectModel<typeof provinces>, "mapId"> {
    type: Type;
    population: number;
    ethnicities: {
        id: number;
        name: string;
        population: number;
    }[];
}

export interface State {
    id: number;
    name: string;
    type: Type;
    provinces: number[];
}

export interface Country {
    tag: string;
    name: string;
    color: string;
    states: number[];
}

export interface CountryProperties {
    tag?: string;
    name?: string;
    color?: string;
}
