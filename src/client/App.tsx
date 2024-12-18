import MapSelection from "@screens/MapSelection/MapSelection";
import MapView from "@screens/MapView";
import { useMapStore } from "@store/store";
import { Toaster } from "@ui/Toast";

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
