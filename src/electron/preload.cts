const { contextBridge, ipcRenderer } = require("electron");

type ProvinceType = {
    id: number;
    color: string;
    type: string;
};

interface EthnicityPopulation {
    ethnicityId: number;
    population: number;
}

interface CreateCountryAttributes {
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

contextBridge.exposeInMainWorld("electronAPI", {
    saveMapImage: (imageData: string, mapId: string) => ipcRenderer.invoke("saveMapImage", imageData, mapId),
    loadMapImage: (imagePath: string) => ipcRenderer.invoke("loadMapImage", imagePath),
    getMaps: () => ipcRenderer.invoke("getMaps"),
    createMap: (name: string, imageData: string) => ipcRenderer.invoke("createMap", name, imageData),
    deleteMap: (id: string) => ipcRenderer.invoke("deleteMap", id),
    renameMap: (id: string, name: string) => ipcRenderer.invoke("renameMap", id, name),
    getAllProvinces: (mapId: string, type: "land" | "water") => ipcRenderer.invoke("getAllProvinces", mapId, type),
    getProvinceByColor: (mapId: string, color: string) => ipcRenderer.invoke("getProvinceByColor", mapId, color),
    getProvinceById: (mapId: string, id: string) => ipcRenderer.invoke("getProvinceById", mapId, id),
    extractProvinceShapes: (imagePath: string, provinces: ProvinceType[]) =>
        ipcRenderer.invoke("extractProvinceShapes", imagePath, provinces),
    changeProvinceType: (mapId: string, id: number[], type: "land" | "water") =>
        ipcRenderer.invoke("changeProvinceType", mapId, id, type),
    getStateByProvinceId: (mapId: string, provinceId: number) =>
        ipcRenderer.invoke("getStateByProvinceId", mapId, provinceId),
    getAllStates: (mapId: string) => ipcRenderer.invoke("getAllStates", mapId),
    createState: (mapId: string, name: string, provinces?: number[]) =>
        ipcRenderer.invoke("createState", mapId, name, provinces),
    addProvinces: (mapId: string, stateId: number, provinceIds: number[]) =>
        ipcRenderer.invoke("addProvinces", mapId, stateId, provinceIds),
    removeProvinces: (mapId: string, stateId: number, provinceIds: number[]) =>
        ipcRenderer.invoke("removeProvinces", mapId, stateId, provinceIds),
    renameState: (mapId: string, stateId: number, name: string) =>
        ipcRenderer.invoke("renameState", mapId, stateId, name),
    deleteState: (mapId: string, stateId: number) => ipcRenderer.invoke("deleteState", mapId, stateId),
    createCountry: (mapId: string, attributes: CreateCountryAttributes) =>
        ipcRenderer.invoke("createCountry", mapId, attributes),
    deleteCountry: (mapId: string, tag: string) => ipcRenderer.invoke("deleteCountry", mapId, tag),
    getAllCountries: (mapId: string) => ipcRenderer.invoke("getAllCountries", mapId),
    addStates: (mapId: string, countryTag: string, states: number[]) =>
        ipcRenderer.invoke("addStates", mapId, countryTag, states),
    removeStates: (mapId: string, countryTag: string, states: number[]) =>
        ipcRenderer.invoke("removeStates", mapId, countryTag, states),
    updateCountry: (mapId: string, countryTag: string, attributes: Partial<CreateCountryAttributes>) =>
        ipcRenderer.invoke("updateCountry", mapId, countryTag, attributes),
    getAllEthnicities: (mapId: string) => ipcRenderer.invoke("getAllEthnicities", mapId),
    deleteEthnicity: (mapId: string, id: number) => ipcRenderer.invoke("deleteEthnicity", mapId, id),
    renameEthnicity: (mapId: string, id: number, name: string) =>
        ipcRenderer.invoke("renameEthnicity", mapId, id, name),
    createEthnicity: (mapId: string, name: string) => ipcRenderer.invoke("createEthnicity", mapId, name),
    addPopulation: (mapId: string, provinceId: number, ethnicityPopulation: EthnicityPopulation[]) =>
        ipcRenderer.invoke("addPopulation", mapId, provinceId, ethnicityPopulation),
});
