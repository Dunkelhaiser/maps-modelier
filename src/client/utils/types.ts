import { InferSelectModel } from "drizzle-orm";
import { maps, provinces } from "../../electron/db/schema";

export type Map = InferSelectModel<typeof maps>;

export type ActiveMap = Map & { imageUrl: string };

type Type = "land" | "water";

export interface EthnicityComposition {
    id: number;
    name: string;
    population: number;
}

export interface Province extends Omit<InferSelectModel<typeof provinces>, "mapId"> {
    type: Type;
    population: number;
    ethnicities: EthnicityComposition[];
}

export interface State {
    id: number;
    name: string;
    type: Type;
    provinces: number[];
    population: number;
    ethnicities: EthnicityComposition[];
}

export interface Country {
    tag: string;
    name: string;
    color: string;
    flag: string;
    coatOfArms: string;
    anthem: {
        name: string;
        url: string;
    };
    states: number[];
    population: number;
    ethnicities: EthnicityComposition[];
}

export interface CountryProperties {
    tag?: string;
    name?: string;
    color?: string;
}

export interface Ethnicity {
    id: number;
    name: string;
    totalNumber?: number;
}

export interface Population {
    ethnicityId: number;
    population: number;
}

export interface EthnicityPopulation {
    ethnicityId: number;
    population: number;
}
