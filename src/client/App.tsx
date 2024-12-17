import MapSelection from "@screens/MapSelection";
import MapView from "@screens/MapView";
import { Toaster } from "@ui/Toast";
import { useMapStore } from "./store/store";

const App = () => {
    const activeMap = useMapStore((state) => state.activeMap);

    return (
        <>
            <main className="grid h-screen w-screen place-items-center">
                {!activeMap ? <MapSelection /> : <MapView activeMap={activeMap} />}
            </main>
            <Toaster />
        </>
    );
};

export default App;
