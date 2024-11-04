import { MapCanvas } from "@components/Map";
import MapSelection from "@components/MapSelection";
import { Province } from "@utils/types";
import { useEffect, useState } from "react";
import { useMapStore } from "./store/store";

const App = () => {
    const activeMap = useMapStore((state) => state.activeMap);
    const [provinces, setProvinces] = useState<Province[]>([]);

    useEffect(() => {
        const getProvinces = async () => {
            if (!activeMap) return;
            const provincesArr = await window.electronAPI.getAllProvinces(activeMap.id);
            setProvinces(provincesArr);
        };
        getProvinces();
    }, [activeMap]);

    return (
        <main className="grid h-screen w-screen place-items-center">
            {!activeMap ? <MapSelection /> : <MapCanvas provinces={provinces} activeMap={activeMap} />}
        </main>
    );
};

export default App;
