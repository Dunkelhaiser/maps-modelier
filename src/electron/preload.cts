const { contextBridge, ipcRenderer } = require("electron");
import type { CreateMapInput } from "../shared/schemas/maps/createMap.js" with { "resolution-mode": "import" };
import type { RenameMapInput } from "../shared/schemas/maps/renameMap.js" with { "resolution-mode": "import" };
import type {
    IpcRequest,
    IpcChannels,
    ProvinceType,
    EthnicityPopulation,
    CreateCountryAttributes,
} from "../shared/types.js" with { "resolution-mode": "import" };

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
        getAll: (mapId: string, type: "land" | "water") => invoke("provinces", "getAll", mapId, type),
        // getByColor: (mapId: string, color: string) => invoke("provinces", "getByColor", mapId, color),
        // getById: (mapId: string, id: number) => invoke("provinces", "getById", mapId, id),
        extractShapes: (imagePath: string, provinces: ProvinceType[]) =>
            invoke("provinces", "extractShapes", imagePath, provinces),
        changeType: (mapId: string, id: number[], type: "land" | "water") =>
            invoke("provinces", "changeType", mapId, id, type),
        addPopulation: (mapId: string, provinceId: number, ethnicityPopulation: EthnicityPopulation[]) =>
            invoke("provinces", "addPopulation", mapId, provinceId, ethnicityPopulation),
    },
    states: {
        getAll: (mapId: string) => invoke("states", "getAll", mapId),
        // getByProvinceId: (mapId: string, provinceId: number) => invoke("states", "getByProvinceId", mapId, provinceId),
        create: (mapId: string, name: string, provinces?: number[]) =>
            invoke("states", "create", mapId, name, provinces),
        rename: (mapId: string, stateId: number, name: string) => invoke("states", "rename", mapId, stateId, name),
        delete: (mapId: string, stateId: number) => invoke("states", "delete", mapId, stateId),
        addProvinces: (mapId: string, stateId: number, provinceIds: number[]) =>
            invoke("states", "addProvinces", mapId, stateId, provinceIds),
        removeProvinces: (mapId: string, stateId: number, provinceIds: number[]) =>
            invoke("states", "removeProvinces", mapId, stateId, provinceIds),
    },
    countries: {
        getAll: (mapId: string) => invoke("countries", "getAll", mapId),
        create: (mapId: string, attributes: CreateCountryAttributes) =>
            invoke("countries", "create", mapId, attributes),
        update: (mapId: string, countryTag: string, attributes: Partial<CreateCountryAttributes>) =>
            invoke("countries", "update", mapId, countryTag, attributes),
        delete: (mapId: string, tag: string) => invoke("countries", "delete", mapId, tag),
        addStates: (mapId: string, countryTag: string, states: number[]) =>
            invoke("countries", "addStates", mapId, countryTag, states),
        removeStates: (mapId: string, countryTag: string, states: number[]) =>
            invoke("countries", "removeStates", mapId, countryTag, states),
    },
    ethnicities: {
        getAll: (mapId: string) => invoke("ethnicities", "getAll", mapId),
        create: (mapId: string, name: string) => invoke("ethnicities", "create", mapId, name),
        rename: (mapId: string, id: number, name: string) => invoke("ethnicities", "rename", mapId, id, name),
        delete: (mapId: string, id: number) => invoke("ethnicities", "delete", mapId, id),
    },
};

contextBridge.exposeInMainWorld("electron", api);
