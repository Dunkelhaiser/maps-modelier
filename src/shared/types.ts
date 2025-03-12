import { InferSelectModel } from "drizzle-orm";
import { maps, provinces } from "../electron/db/schema.js";
import { CreateCountryInput } from "./schemas/countries/createCountry.js";
import { StatesAssignmentInput } from "./schemas/countries/states.js";
import { UpdateCountryInput } from "./schemas/countries/updateCountry.js";
import { EthnicityInput } from "./schemas/ethnicities/ethnicity.js";
import { CreateMapInput } from "./schemas/maps/createMap.js";
import { RenameMapInput } from "./schemas/maps/renameMap.js";
import { ChangeTypeInput } from "./schemas/provinces/changeType.js";
import { PopulationInput } from "./schemas/provinces/population.js";
import { CreateStateInput } from "./schemas/states/createState.js";
import { ProvincesAssignmentInput } from "./schemas/states/provinces.js";
import { StateNameInput } from "./schemas/states/state.js";

export type MapType = InferSelectModel<typeof maps>;

export type ProvinceType = "land" | "water";

export interface EthnicityComposition {
    id: number;
    name: string;
    population: number;
}

export interface Province extends Omit<InferSelectModel<typeof provinces>, "mapId"> {
    population: number;
    ethnicities: EthnicityComposition[];
}

export interface State {
    id: number;
    name: string;
    type: ProvinceType;
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

export interface Ethnicity {
    id: number;
    name: string;
    totalNumber?: number;
}

export interface ProvinceBase {
    id: number;
    color: string;
    type: string;
}

export interface IpcChannels {
    maps: {
        getAll: () => Promise<MapType[]>;
        create: (data: CreateMapInput) => Promise<MapType | null>;
        rename: (id: string, data: RenameMapInput) => Promise<MapType | null>;
        delete: (id: string) => Promise<void>;
    };
    provinces: {
        getAll: (mapId: string, type: ProvinceType) => Promise<Province[]>;
        // getByColor: (mapId: string, color: string) => Promise<Province | null>;
        // getById: (mapId: string, id: number) => Promise<Province | null>;
        changeType: (mapId: string, data: ChangeTypeInput) => Promise<Omit<Province, "ethnicities" | "population">[]>;
        addPopulation: (mapId: string, provinceId: number, data: PopulationInput) => Promise<PopulationInput>;
    };
    states: {
        getAll: (mapId: string) => Promise<State[]>;
        // getByProvinceId: (mapId: string, provinceId: number) => Promise<State | null>;
        create: (mapId: string, data: CreateStateInput) => Promise<State>;
        rename: (
            mapId: string,
            stateId: number,
            data: StateNameInput
        ) => Promise<Omit<State, "provinces" | "ethnicities" | "population">>;
        delete: (mapId: string, stateId: number) => Promise<void>;
        addProvinces: (mapId: string, data: ProvincesAssignmentInput) => Promise<void>;
        removeProvinces: (mapId: string, data: ProvincesAssignmentInput) => Promise<void>;
    };
    countries: {
        getAll: (mapId: string) => Promise<Country[]>;
        create: (mapId: string, data: CreateCountryInput) => Promise<Country>;
        update: (
            mapId: string,
            tag: string,
            data: UpdateCountryInput
        ) => Promise<Omit<Country, "ethnicities" | "population" | "states">>;
        delete: (mapId: string, tag: string) => Promise<void>;
        addStates: (mapId: string, data: StatesAssignmentInput) => Promise<void>;
        removeStates: (mapId: string, data: StatesAssignmentInput) => Promise<void>;
    };
    ethnicities: {
        getAll: (mapId: string) => Promise<Ethnicity[]>;
        create: (mapId: string, data: EthnicityInput) => Promise<Omit<Ethnicity, "totalNumber">>;
        rename: (mapId: string, id: number, data: EthnicityInput) => Promise<Omit<Ethnicity, "totalNumber">>;
        delete: (mapId: string, id: number) => Promise<void>;
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
