const { contextBridge, ipcRenderer } = require("electron");

type ProvinceType = {
    id: number;
    color: string;
    type: string;
};

contextBridge.exposeInMainWorld("electronAPI", {
    saveMapImage: (imageData: string, mapId: string) => ipcRenderer.invoke("saveMapImage", imageData, mapId),
    loadMapImage: (imagePath: string) => ipcRenderer.invoke("loadMapImage", imagePath),
    getMaps: () => ipcRenderer.invoke("getMaps"),
    createMap: (name: string, imageData: string) => ipcRenderer.invoke("createMap", name, imageData),
    updateMapName: (id: string, name: string) => ipcRenderer.invoke("updateMapName", id, name),
    getAllProvinces: (mapId: string, type: "land" | "water") => ipcRenderer.invoke("getAllProvinces", mapId, type),
    getProvinceByColor: (mapId: string, color: string) => ipcRenderer.invoke("getProvinceByColor", mapId, color),
    getProvinceById: (mapId: string, id: string) => ipcRenderer.invoke("getProvinceById", mapId, id),
    extractProvinceShapes: (imagePath: string, provinces: ProvinceType[]) =>
        ipcRenderer.invoke("extractProvinceShapes", imagePath, provinces),
    changeProvinceType: (mapId: string, id: string, type: "land" | "water") =>
        ipcRenderer.invoke("changeProvinceType", mapId, id, type),
});
