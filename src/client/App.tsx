import MapSelection from "@screens/MapSelection";
import MapView from "@screens/MapView";
import { Toaster } from "@ui/Toast";
import { useMapStore } from "./store/store";

const App = () => {
    const activeMap = useMapStore((state) => state.activeMap);

    return (
        <main className="grid h-screen w-screen place-items-center">
            <Toaster />
            {!activeMap ? <MapSelection /> : <MapView activeMap={activeMap} />}
        </main>
    );
};

export default App;
