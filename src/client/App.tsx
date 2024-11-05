import { MapCanvas } from "@components/Map";
import MapSelection from "@components/MapSelection";
import { Province } from "@utils/types";
import { useEffect, useState } from "react";
import { useMapStore } from "./store/store";

const App = () => {
    const activeMap = useMapStore((state) => state.activeMap);
    const [landProvinces, setLandProvinces] = useState<Province[]>([]);
    const [waterProvinces, setWaterProvinces] = useState<Province[]>([]);

    useEffect(() => {
        const getProvinces = async () => {
            if (!activeMap) return;
            Promise.all([
                window.electronAPI.getAllProvinces(activeMap.id, "land"),
                window.electronAPI.getAllProvinces(activeMap.id, "water"),
            ]).then(([landProvincesArr, waterProvincesArr]) => {
                setLandProvinces(landProvincesArr);
                setWaterProvinces(waterProvincesArr);
            });
        };
        getProvinces();
    }, [activeMap]);

    return (
        <main className="grid h-screen w-screen place-items-center">
            {!activeMap ? (
                <MapSelection />
            ) : (
                <MapCanvas landProvinces={landProvinces} waterProvinces={waterProvinces} activeMap={activeMap} />
            )}
        </main>
    );
};

export default App;
