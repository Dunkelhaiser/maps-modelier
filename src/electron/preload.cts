const { contextBridge, ipcRenderer } = require("electron");
import type { CreateCountryInput } from "../shared/schemas/countries/createCountry.js" with { "resolution-mode": "import" };
import type { StatesAssignmentInput } from "../shared/schemas/countries/states.js" with { "resolution-mode": "import" };
import type { UpdateCountryInput } from "../shared/schemas/countries/updateCountry.js" with { "resolution-mode": "import" };
import type { EthnicityInput } from "../shared/schemas/ethnicities/ethnicity.js" with { "resolution-mode": "import" };
import type { CreateMapInput } from "../shared/schemas/maps/createMap.js" with { "resolution-mode": "import" };
import type { RenameMapInput } from "../shared/schemas/maps/renameMap.js" with { "resolution-mode": "import" };
import type { ChangeTypeInput } from "../shared/schemas/provinces/changeType.js" with { "resolution-mode": "import" };
import type { PopulationInput } from "../shared/schemas/provinces/population.js" with { "resolution-mode": "import" };
import type { CreateStateInput } from "../shared/schemas/states/createState.js" with { "resolution-mode": "import" };
import type { ProvincesAssignmentInput } from "../shared/schemas/states/provinces.js" with { "resolution-mode": "import" };
import type { StateNameInput } from "../shared/schemas/states/state.js" with { "resolution-mode": "import" };
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
    mapImage: {
        save: (imageData: string, mapId: string) => invoke("mapImage", "save", imageData, mapId),
        load: (imagePath: string) => invoke("mapImage", "load", imagePath),
    },
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
        create: (mapId: string, data: CreateStateInput) => invoke("states", "create", mapId, data),
        rename: (mapId: string, stateId: number, data: StateNameInput) =>
            invoke("states", "rename", mapId, stateId, data),
        delete: (mapId: string, stateId: number) => invoke("states", "delete", mapId, stateId),
        addProvinces: (mapId: string, data: ProvincesAssignmentInput) => invoke("states", "addProvinces", mapId, data),
        removeProvinces: (mapId: string, data: ProvincesAssignmentInput) =>
            invoke("states", "removeProvinces", mapId, data),
    },
    countries: {
        getAll: (mapId: string) => invoke("countries", "getAll", mapId),
        create: (mapId: string, data: CreateCountryInput) => invoke("countries", "create", mapId, data),
        update: (mapId: string, countryTag: string, data: UpdateCountryInput) =>
            invoke("countries", "update", mapId, countryTag, data),
        delete: (mapId: string, tag: string) => invoke("countries", "delete", mapId, tag),
        addStates: (mapId: string, data: StatesAssignmentInput) => invoke("countries", "addStates", mapId, data),
        removeStates: (mapId: string, data: StatesAssignmentInput) => invoke("countries", "removeStates", mapId, data),
    },
    ethnicities: {
        getAll: (mapId: string) => invoke("ethnicities", "getAll", mapId),
        create: (mapId: string, data: EthnicityInput) => invoke("ethnicities", "create", mapId, data),
        rename: (mapId: string, id: number, data: EthnicityInput) => invoke("ethnicities", "rename", mapId, id, data),
        delete: (mapId: string, id: number) => invoke("ethnicities", "delete", mapId, id),
    },
};

contextBridge.exposeInMainWorld("electron", api);
