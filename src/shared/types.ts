import { InferSelectModel } from "drizzle-orm";
import { maps, provinces } from "../electron/db/schema.js";
import { CreateMapInput } from "./schemas/maps/createMap.js";
import { RenameMapInput } from "./schemas/maps/renameMap.js";
import { ChangeTypeInput } from "./schemas/provinces/changeType.js";
import { PopulationInput } from "./schemas/provinces/population.js";

export type Map = InferSelectModel<typeof maps>;

export type ActiveMap = Map & { imageUrl: string };

export type Type = "land" | "water";

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

export interface CountryAttributes {
    name: string;
    tag: string;
    color?: string;
    flag: string;
    coatOfArms: string;
    anthem: {
        name: string;
        url: string;
    };
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

export type DeepPartial<T> = T extends object
    ? {
          [P in keyof T]?: DeepPartial<T[P]>;
      }
    : T;

export interface ProvinceType {
    id: number;
    color: string;
    type: string;
}

export interface CreateCountryAttributes {
    name: string;
    tag: string;
    color?: string;
    flag: string;
    coatOfArms: string;
    anthem: {
        name: string;
        url: string;
    };
}

export interface IpcChannels {
    mapImage: {
        save: (imageData: string, mapId: string) => Promise<string>;
        load: (imagePath: string) => Promise<string>;
    };
    maps: {
        getAll: () => Promise<Map[]>;
        create: (data: CreateMapInput) => Promise<Map | null>;
        rename: (id: string, data: RenameMapInput) => Promise<Map | null>;
        delete: (id: string) => Promise<void>;
    };
    provinces: {
        getAll: (mapId: string, type: Type) => Promise<Province[]>;
        // getByColor: (mapId: string, color: string) => Promise<Province | null>;
        // getById: (mapId: string, id: number) => Promise<Province | null>;
        changeType: (mapId: string, data: ChangeTypeInput) => Promise<Omit<Province, "ethnicities" | "population">[]>;
        addPopulation: (mapId: string, provinceId: number, data: PopulationInput) => Promise<Population[]>;
    };
    states: {
        getAll: (mapId: string) => Promise<State[]>;
        // getByProvinceId: (mapId: string, provinceId: number) => Promise<State | null>;
        create: (mapId: string, name: string, provinces?: number[]) => Promise<State>;
        rename: (
            mapId: string,
            stateId: number,
            name: string
        ) => Promise<Omit<State, "provinces" | "ethnicities" | "population">>;
        delete: (mapId: string, stateId: number) => Promise<void>;
        addProvinces: (mapId: string, stateId: number, provinceIds: number[]) => Promise<void>;
        removeProvinces: (mapId: string, stateId: number, provinceIds: number[]) => Promise<void>;
    };
    countries: {
        getAll: (mapId: string) => Promise<Country[]>;
        create: (mapId: string, attributes: CreateCountryAttributes) => Promise<Country>;
        delete: (mapId: string, tag: string) => Promise<void>;
        update: (
            mapId: string,
            countryTag: string,
            attributes: DeepPartial<CreateCountryAttributes>
        ) => Promise<Omit<Country, "ethnicities" | "population" | "states">>;
        addStates: (mapId: string, countryTag: string, states: number[]) => Promise<void>;
        removeStates: (mapId: string, countryTag: string, states: number[]) => Promise<void>;
    };
    ethnicities: {
        getAll: (mapId: string) => Promise<Ethnicity[]>;
        create: (mapId: string, name: string) => Promise<Omit<Ethnicity, "totalNumber">>;
        delete: (mapId: string, id: number) => Promise<void>;
        rename: (mapId: string, id: number, name: string) => Promise<Omit<Ethnicity, "totalNumber">>;
    };
}

export type ElectronAPI = {
    [K in keyof IpcChannels]: {
        [M in keyof IpcChannels[K]]: IpcChannels[K][M];
    };
};

export interface IpcRequest {
    domain: keyof IpcChannels;
    command: string | number | symbol;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    args: any[];
}
