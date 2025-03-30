const { contextBridge, ipcRenderer } = require("electron");
import type { AddMembersInput } from "../shared/schemas/alliances/addMembers.js" with { "resolution-mode": "import" };
import type { AllianceInput } from "../shared/schemas/alliances/alliance.js" with { "resolution-mode": "import" };
import type { CreateCountryInput } from "../shared/schemas/countries/createCountry.js" with { "resolution-mode": "import" };
import type { StatesAssignmentInput } from "../shared/schemas/countries/states.js" with { "resolution-mode": "import" };
import type { UpdateCountryInput } from "../shared/schemas/countries/updateCountry.js" with { "resolution-mode": "import" };
import type { EthnicityInput } from "../shared/schemas/ethnicities/ethnicity.js" with { "resolution-mode": "import" };
import type { IdeologyInput } from "../shared/schemas/ideologies/ideology.js" with { "resolution-mode": "import" };
import type { CreateMapInput } from "../shared/schemas/maps/createMap.js" with { "resolution-mode": "import" };
import type { RenameMapInput } from "../shared/schemas/maps/renameMap.js" with { "resolution-mode": "import" };
import type { PartyInput } from "../shared/schemas/parties/party.js" with { "resolution-mode": "import" };
import type { AssignHeadInput } from "../shared/schemas/politics/assignHead.js" with { "resolution-mode": "import" };
import type { ParliamentInput } from "../shared/schemas/politics/parliament.js" with { "resolution-mode": "import" };
import type { PoliticianInput } from "../shared/schemas/politics/politician.js" with { "resolution-mode": "import" };
import type { ChangeTypeInput } from "../shared/schemas/provinces/changeType.js" with { "resolution-mode": "import" };
import type { PopulationInput } from "../shared/schemas/provinces/population.js" with { "resolution-mode": "import" };
import type { CreateStateInput } from "../shared/schemas/states/createState.js" with { "resolution-mode": "import" };
import type { ProvincesAssignmentInput } from "../shared/schemas/states/provinces.js" with { "resolution-mode": "import" };
import type { StateNameInput } from "../shared/schemas/states/state.js" with { "resolution-mode": "import" };
import type { AddParticipantsInput } from "../shared/schemas/wars/addParticipants.js" with { "resolution-mode": "import" };
import type { WarInput } from "../shared/schemas/wars/war.js" with { "resolution-mode": "import" };
import type { IpcRequest, IpcChannels, ProvinceType } from "../shared/types.js" with { "resolution-mode": "import" };

const invoke = <D extends keyof IpcChannels, C extends keyof IpcChannels[D]>(
    domain: D,
    command: C,
    ...args: Parameters<Extract<IpcChannels[D][C], (...args: any[]) => any>>
): ReturnType<Extract<IpcChannels[D][C], (...args: any[]) => any>> => {
    const request: IpcRequest = { domain, command, args };
    return ipcRenderer.invoke("ipc", request) as ReturnType<Extract<IpcChannels[D][C], (...args: any[]) => any>>;
};

const api = {
    maps: {
        getAll: () => invoke("maps", "getAll"),
        create: (data: CreateMapInput) => invoke("maps", "create", data),
        rename: (id: string, data: RenameMapInput) => invoke("maps", "rename", id, data),
        delete: (id: string) => invoke("maps", "delete", id),
    },
    provinces: {
        getAll: (mapId: string, type: ProvinceType) => invoke("provinces", "getAll", mapId, type),
        // getByColor: (mapId: string, color: string) => invoke("provinces", "getByColor", mapId, color),
        // getById: (mapId: string, id: number) => invoke("provinces", "getById", mapId, id),
        changeType: (mapId: string, data: ChangeTypeInput) => invoke("provinces", "changeType", mapId, data),
        addPopulation: (mapId: string, provinceId: number, data: PopulationInput) =>
            invoke("provinces", "addPopulation", mapId, provinceId, data),
    },
    states: {
        getAll: (mapId: string) => invoke("states", "getAll", mapId),
        // getByProvinceId: (mapId: string, provinceId: number) => invoke("states", "getByProvinceId", mapId, provinceId),
        getById: (mapId: string, id: number) => invoke("states", "getById", mapId, id),
        create: (mapId: string, data: CreateStateInput) => invoke("states", "create", mapId, data),
        rename: (mapId: string, stateId: number, data: StateNameInput) =>
            invoke("states", "rename", mapId, stateId, data),
        delete: (mapId: string, stateId: number) => invoke("states", "delete", mapId, stateId),
        addProvinces: (mapId: string, data: ProvincesAssignmentInput) => invoke("states", "addProvinces", mapId, data),
        removeProvinces: (mapId: string, data: ProvincesAssignmentInput) =>
            invoke("states", "removeProvinces", mapId, data),
    },
    countries: {
        create: (mapId: string, data: CreateCountryInput) => invoke("countries", "create", mapId, data),
        update: (mapId: string, id: number, data: UpdateCountryInput) => invoke("countries", "update", mapId, id, data),
        delete: (mapId: string, id: number) => invoke("countries", "delete", mapId, id),
        addStates: (mapId: string, data: StatesAssignmentInput) => invoke("countries", "addStates", mapId, data),
        removeStates: (mapId: string, data: StatesAssignmentInput) => invoke("countries", "removeStates", mapId, data),
        getStates: (mapId: string) => invoke("countries", "getStates", mapId),
        getById: (mapId: string, id: number) => invoke("countries", "getById", mapId, id),
        getBases: (mapId: string) => invoke("countries", "getBases", mapId),
        getTable: (mapId: string) => invoke("countries", "getTable", mapId),
    },
    ethnicities: {
        getAll: (mapId: string) => invoke("ethnicities", "getAll", mapId),
        create: (mapId: string, data: EthnicityInput) => invoke("ethnicities", "create", mapId, data),
        update: (mapId: string, id: number, data: EthnicityInput) => invoke("ethnicities", "update", mapId, id, data),
        delete: (mapId: string, id: number) => invoke("ethnicities", "delete", mapId, id),
    },
    alliances: {
        create: (mapId: string, data: AllianceInput) => invoke("alliances", "create", mapId, data),
        getAll: (mapId: string) => invoke("alliances", "getAll", mapId),
        update: (mapId: string, id: number, data: AllianceInput) => invoke("alliances", "update", mapId, id, data),
        addMembers: (mapId: string, id: number, members: AddMembersInput) =>
            invoke("alliances", "addMembers", mapId, id, members),
        get: (mapId: string, id: number) => invoke("alliances", "get", mapId, id),
        getMembers: (mapId: string, id: number) => invoke("alliances", "getMembers", mapId, id),
        delete: (mapId: string, id: number) => invoke("alliances", "delete", mapId, id),
    },
    wars: {
        create: (mapId: string, data: WarInput) => invoke("wars", "create", mapId, data),
        update: (mapId: string, id: number, data: WarInput) => invoke("wars", "update", mapId, id, data),
        getAll: (mapId: string) => invoke("wars", "getAll", mapId),
        get: (mapId: string, id: number) => invoke("wars", "get", mapId, id),
        getParticipants: (mapId: string, id: number) => invoke("wars", "getParticipants", mapId, id),
        addParticipants: (mapId: string, id: number, data: AddParticipantsInput) =>
            invoke("wars", "addParticipants", mapId, id, data),
        delete: (mapId: string, id: number) => invoke("wars", "delete", mapId, id),
    },
    politicians: {
        create: (mapId: string, countryId: number, data: PoliticianInput) =>
            invoke("politicians", "create", mapId, countryId, data),
        update: (mapId: string, id: number, data: PoliticianInput) => invoke("politicians", "update", mapId, id, data),
        delete: (mapId: string, id: number) => invoke("politicians", "delete", mapId, id),
        getAll: (mapId: string, countryId: number) => invoke("politicians", "getAll", mapId, countryId),
        get: (mapId: string, politicianId: number) => invoke("politicians", "get", mapId, politicianId),
        getIndependent: (mapId: string, countryId: number) => invoke("politicians", "getIndependent", mapId, countryId),
    },
    ideologies: {
        create: (mapId: string, data: IdeologyInput) => invoke("ideologies", "create", mapId, data),
        update: (mapId: string, id: number, data: IdeologyInput) => invoke("ideologies", "update", mapId, id, data),
        delete: (mapId: string, id: number) => invoke("ideologies", "delete", mapId, id),
        getAll: (mapId: string) => invoke("ideologies", "getAll", mapId),
    },
    parties: {
        create: (mapId: string, countryId: number, data: PartyInput) =>
            invoke("parties", "create", mapId, countryId, data),
        delete: (mapId: string, id: number) => invoke("parties", "delete", mapId, id),
        getAll: (mapId: string, countryId: number) => invoke("parties", "getAll", mapId, countryId),
        get: (mapId: string, id: number) => invoke("parties", "get", mapId, id),
        getMembers: (mapId: string, id: number) => invoke("parties", "getMembers", mapId, id),
        update: (mapId: string, id: number, data: PartyInput) => invoke("parties", "update", mapId, id, data),
        addMembers: (mapId: string, id: number, members: AddMembersInput) =>
            invoke("parties", "addMembers", mapId, id, members),
    },
    government: {
        assignHeadOfState: (mapId: string, countryId: number, data: AssignHeadInput) =>
            invoke("government", "assignHeadOfState", mapId, countryId, data),
        assignHeadOfGovernment: (mapId: string, countryId: number, data: AssignHeadInput) =>
            invoke("government", "assignHeadOfGovernment", mapId, countryId, data),
        getHeadOfState: (mapId: string, countryId: number) => invoke("government", "getHeadOfState", mapId, countryId),
        getHeadOfGovernment: (mapId: string, countryId: number) =>
            invoke("government", "getHeadOfGovernment", mapId, countryId),
        createParliament: (mapId: string, countryId: number, data: ParliamentInput) =>
            invoke("government", "createParliament", mapId, countryId, data),
        updateParliament: (mapId: string, id: number, data: ParliamentInput) =>
            invoke("government", "updateParliament", mapId, id, data),
        getParliament: (mapId: string, id: number) => invoke("government", "getParliament", mapId, id),
    },
};

contextBridge.exposeInMainWorld("electron", api);
