import { InferSelectModel } from "drizzle-orm";
import { maps, provinces } from "../electron/db/schema.js";
import { AddMembersInput } from "./schemas/alliances/addMembers.js";
import { AllianceInput } from "./schemas/alliances/alliance.js";
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

export interface Province extends Omit<InferSelectModel<typeof provinces>, "mapId"> {
    population: number;
    ethnicities: Ethnicity[];
}

export interface StateBase {
    id: number;
    name: string;
    type: ProvinceType;
    provinces: number[];
}

export interface State {
    id: number;
    name: string;
    type: ProvinceType;
    provinces: number[];
    population: number;
    ethnicities: Ethnicity[];
}

export interface Country {
    id: number;
    name: {
        common: string;
        official: string | null;
    };
    color: string;
    flag: string;
    coatOfArms?: string;
    anthem?: {
        name: string;
        url: string;
    };
    population: number;
    ethnicities: Ethnicity[];
    alliances: CountryAlliance[];
}

export interface CountryAlliance {
    id: number;
    name: string;
    type: string;
}

export interface CountryBase {
    id: number;
    name: string;
    flag: string;
}

export interface Ethnicity {
    id: number;
    name: string;
    color: string;
    population: number;
}

export interface ProvinceBase {
    id: number;
    color: string;
    type: string;
}

export interface Alliance {
    id: number;
    name: string;
    type: string;
    leader: CountryBase;
    membersCount: number;
}

export interface CountryStates {
    id: number;
    color: string;
    states: number[];
}

export interface CountryTable {
    id: number;
    name: string;
    flag: string;
    population: number;
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
        getAll: (mapId: string) => Promise<StateBase[]>;
        // getByProvinceId: (mapId: string, provinceId: number) => Promise<State | null>;
        getById: (mapId: string, id: number) => Promise<State>;
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
        create: (mapId: string, data: CreateCountryInput) => Promise<CountryBase & { color: string }>;
        update: (
            mapId: string,
            id: number,
            data: UpdateCountryInput
        ) => Promise<Omit<Country, "ethnicities" | "population" | "states" | "alliances">>;
        delete: (mapId: string, id: number) => Promise<void>;
        addStates: (mapId: string, data: StatesAssignmentInput) => Promise<void>;
        removeStates: (mapId: string, data: StatesAssignmentInput) => Promise<void>;
        getStates: (mapId: string) => Promise<CountryStates[]>;
        getById: (mapId: string, id: number) => Promise<Country>;
        getBases: (mapId: string) => Promise<CountryBase[]>;
        getTable: (mapId: string) => Promise<CountryTable[]>;
    };
    ethnicities: {
        getAll: (mapId: string) => Promise<Ethnicity[]>;
        create: (mapId: string, data: EthnicityInput) => Promise<Omit<Ethnicity, "population">>;
        update: (mapId: string, id: number, data: EthnicityInput) => Promise<Omit<Ethnicity, "population">>;
        delete: (mapId: string, id: number) => Promise<void>;
    };
    alliances: {
        create: (mapId: string, data: AllianceInput) => Promise<Alliance>;
        getAll: (mapId: string) => Promise<Alliance[]>;
        update: (mapId: string, id: number, data: AllianceInput) => Promise<Alliance>;
        addMembers: (mapId: string, id: number, members: AddMembersInput) => Promise<void>;
        get: (mapId: string, id: number) => Promise<Alliance>;
        getMembers: (mapId: string, id: number) => Promise<CountryBase[]>;
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
