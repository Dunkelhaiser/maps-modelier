import { AddMembersInput } from "./schemas/alliances/addMembers.js";
import { AllianceInput } from "./schemas/alliances/alliance.js";
import { GetAlliancesInput } from "./schemas/alliances/getAlliances.js";
import { CreateCountryInput } from "./schemas/countries/createCountry.js";
import { GetCountriesInput } from "./schemas/countries/getCountries.js";
import { StatesAssignmentInput } from "./schemas/countries/states.js";
import { UpdateCountryInput } from "./schemas/countries/updateCountry.js";
import { EthnicityInput } from "./schemas/ethnicities/ethnicity.js";
import { GetEthnicitiesInput } from "./schemas/ethnicities/getEthnicities.js";
import { GetIdeologiesInput } from "./schemas/ideologies/getIdeologies.js";
import { IdeologyInput } from "./schemas/ideologies/ideology.js";
import { CreateMapInput } from "./schemas/maps/createMap.js";
import { RenameMapInput } from "./schemas/maps/renameMap.js";
import { GetPartiesInput } from "./schemas/parties/getParties.js";
import { PartyInput } from "./schemas/parties/party.js";
import { PartiesInput as ParliamentPartyInput } from "./schemas/politics/addParties.js";
import { AssignHeadInput } from "./schemas/politics/assignHead.js";
import { ParliamentInput } from "./schemas/politics/parliament.js";
import { PoliticianInput } from "./schemas/politics/politician.js";
import { ChangeTypeInput } from "./schemas/provinces/changeType.js";
import { PopulationInput } from "./schemas/provinces/population.js";
import { CreateStateInput } from "./schemas/states/createState.js";
import { ProvincesAssignmentInput } from "./schemas/states/provinces.js";
import { StateNameInput } from "./schemas/states/state.js";
import { AddParticipantsInput } from "./schemas/wars/addParticipants.js";
import { GetWarsInput } from "./schemas/wars/getWars.js";
import { WarInput } from "./schemas/wars/war.js";

export interface IdRes {
    id: number;
}

export interface MapType {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
}

export type ProvinceType = "land" | "water";

export interface Province {
    id: number;
    shape: number[][];
    color: string;
    type: ProvinceType;
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

export type AllianceType = "economic" | "political" | "military";

export interface Alliance {
    id: number;
    name: string;
    type: AllianceType;
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

export interface CountryPopulation {
    onMapPopulation: Ethnicity[];
    offMapPopulation: Ethnicity[];
}

export interface WarBase {
    id: number;
    name: string;
    aggressor: CountryBase;
    defender: CountryBase;
    startedAt: Date;
    endedAt: Date | null;
}

export interface WarSide {
    id: number;
    name: string;
    participantCount: number;
}

export interface WarParticipantGroup {
    id: number | null;
    name: string;
    leader: number | null;
    countries: (CountryBase & { allianceId?: number | null })[];
    nonParticipatingCountries: (CountryBase & { allianceId?: number | null })[];
    participantCount: number;
}

export interface WarSideWithGroups extends WarSide {
    allianceGroups: WarParticipantGroup[];
    totalGroups: number;
}

export interface WarTable extends WarBase {
    totalParticipants: number;
    sides: WarSide[];
}

export interface WarParticipants {
    sides: WarSideWithGroups[];
    totalParticipants: number;
    totalGroups: number;
}

export interface Politician {
    id: number;
    name: string;
    portrait: string | null;
}

export interface PoliticalPartyBase {
    id: number;
    name: string;
    color: string;
    acronym: string | null;
}

export interface PoliticalPartyTable extends PoliticalPartyBase {
    membersCount: number;
    primaryIdeology: Ideology;
    foundedAt: Date | null;
}

export interface PoliticalParty extends PoliticalPartyTable {
    leader: Politician;
    ideologies: Ideology[];
}

export interface PoliticianWithParty extends Politician {
    party: PoliticalPartyBase | null;
}

export interface Ideology {
    id: number;
    name: string;
    color: string;
}

export interface Head extends PoliticianWithParty {
    title: string;
    startDate: Date;
    endDate: Date | null;
}

interface Side {
    count: number;
    seats: number;
}

export interface Parliament {
    id: number;
    name: string;
    seatsNumber: number;
    coalitionLeader: Politician | null;
    oppositionLeader: Politician | null;
    coalition: Side;
    neutral: Side;
    opposition: Side;
}

export interface ParliamentGroup {
    side: "ruling_coalition" | "opposition" | "neutral";
    parties: (PoliticalPartyBase & { seats: number })[];
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
        changeType: (mapId: string, data: ChangeTypeInput) => Promise<void>;
        addPopulation: (mapId: string, provinceId: number, data: PopulationInput) => Promise<void>;
    };
    states: {
        getAll: (mapId: string) => Promise<StateBase[]>;
        getById: (mapId: string, id: number) => Promise<State>;
        create: (mapId: string, data: CreateStateInput) => Promise<IdRes>;
        rename: (mapId: string, stateId: number, data: StateNameInput) => Promise<void>;
        delete: (mapId: string, stateId: number) => Promise<void>;
        addProvinces: (mapId: string, data: ProvincesAssignmentInput) => Promise<void>;
        removeProvinces: (mapId: string, data: ProvincesAssignmentInput) => Promise<void>;
    };
    countries: {
        create: (mapId: string, data: CreateCountryInput) => Promise<IdRes>;
        update: (mapId: string, id: number, data: UpdateCountryInput) => Promise<void>;
        delete: (mapId: string, id: number) => Promise<void>;
        addStates: (mapId: string, data: StatesAssignmentInput) => Promise<void>;
        removeStates: (mapId: string, data: StatesAssignmentInput) => Promise<void>;
        getStates: (mapId: string) => Promise<CountryStates[]>;
        getById: (mapId: string, id: number) => Promise<Country>;
        getBases: (mapId: string) => Promise<CountryBase[]>;
        getTable: (mapId: string, query?: GetCountriesInput) => Promise<CountryTable[]>;
        addOffmapPopulation: (mapId: string, countryId: number, data: PopulationInput) => Promise<void>;
        getPopulation: (mapId: string, id: number) => Promise<CountryPopulation>;
    };
    ethnicities: {
        getAll: (mapId: string, query?: GetEthnicitiesInput) => Promise<Ethnicity[]>;
        create: (mapId: string, data: EthnicityInput) => Promise<IdRes>;
        update: (mapId: string, id: number, data: EthnicityInput) => Promise<void>;
        delete: (mapId: string, id: number) => Promise<void>;
    };
    alliances: {
        create: (mapId: string, data: AllianceInput) => Promise<IdRes>;
        getAll: (mapId: string, query?: GetAlliancesInput) => Promise<Alliance[]>;
        update: (mapId: string, id: number, data: AllianceInput) => Promise<void>;
        addMembers: (mapId: string, id: number, members: AddMembersInput) => Promise<void>;
        get: (mapId: string, id: number) => Promise<Alliance>;
        getMembers: (mapId: string, id: number) => Promise<CountryBase[]>;
        delete: (mapId: string, id: number) => Promise<void>;
    };
    wars: {
        create: (mapId: string, data: WarInput) => Promise<IdRes>;
        update: (mapId: string, id: number, data: WarInput) => Promise<void>;
        getAll: (mapId: string, query?: GetWarsInput) => Promise<WarTable[]>;
        get: (mapId: string, id: number) => Promise<WarBase>;
        getParticipants: (mapId: string, id: number) => Promise<WarParticipants>;
        addParticipants: (mapId: string, id: number, participants: AddParticipantsInput) => Promise<void>;
        delete: (mapId: string, id: number) => Promise<void>;
    };
    politicians: {
        create: (mapId: string, countryId: number, input: PoliticianInput) => Promise<IdRes>;
        update: (mapId: string, id: number, data: PoliticianInput) => Promise<void>;
        delete: (mapId: string, id: number) => Promise<void>;
        getAll: (mapId: string, countryId: number) => Promise<PoliticianWithParty[]>;
        get: (mapId: string, politicianId: number) => Promise<PoliticianWithParty>;
        getIndependent: (mapId: string, countryId: number) => Promise<PoliticianWithParty[]>;
    };
    ideologies: {
        create: (mapId: string, data: IdeologyInput) => Promise<IdRes>;
        update: (mapId: string, id: number, data: IdeologyInput) => Promise<void>;
        delete: (mapId: string, id: number) => Promise<void>;
        getAll: (mapId: string, query?: GetIdeologiesInput) => Promise<Ideology[]>;
    };
    parties: {
        create: (mapId: string, countryId: number, data: PartyInput) => Promise<IdRes>;
        delete: (mapId: string, id: number) => Promise<void>;
        getAll: (mapId: string, countryId: number, query?: GetPartiesInput) => Promise<PoliticalPartyTable[]>;
        get: (mapId: string, id: number) => Promise<PoliticalParty>;
        getMembers: (mapId: string, id: number) => Promise<Politician[]>;
        update: (mapId: string, id: number, data: PartyInput) => Promise<void>;
        addMembers: (mapId: string, id: number, data: AddMembersInput) => Promise<void>;
    };
    government: {
        assignHeadOfState: (mapId: string, countryId: number, data: AssignHeadInput) => Promise<void>;
        assignHeadOfGovernment: (mapId: string, countryId: number, data: AssignHeadInput) => Promise<void>;
        getHeadOfState: (mapId: string, countryId: number) => Promise<Head | null>;
        getHeadOfGovernment: (mapId: string, countryId: number) => Promise<Head | null>;
        createParliament: (mapId: string, countryId: number, data: ParliamentInput) => Promise<IdRes>;
        updateParliament: (mapId: string, id: number, data: ParliamentInput) => Promise<void>;
        getParliament: (mapId: string, countryId: number) => Promise<Parliament>;
        addParties: (mapId: string, id: number, data: ParliamentPartyInput) => Promise<void>;
        getParties: (mapId: string, id: number) => Promise<ParliamentGroup[]>;
    };
}

export interface IpcRequest {
    domain: keyof IpcChannels;
    command: string | number | symbol;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    args: any[];
}
