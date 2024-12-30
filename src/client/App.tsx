import MapSelection from "@screens/MapSelection/MapSelection";
import MapView from "@screens/MapView/MapView";
import { useMapSotre } from "@store/store";
import { Toaster } from "@ui/Toast";

const App = () => {
    const activeMap = useMapSotre((state) => state.activeMap);

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
