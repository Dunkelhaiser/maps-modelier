import { MapCanvas } from "@components/Map";
import MapSelection from "@components/MapSelection";
import { useMapStore } from "./store/store";

const App = () => {
    const activeMap = useMapStore((state) => state.activeMap);

    return (
        <main className="grid h-screen w-screen place-items-center">
            {!activeMap ? <MapSelection /> : <MapCanvas activeMap={activeMap} />}
        </main>
    );
};

export default App;
