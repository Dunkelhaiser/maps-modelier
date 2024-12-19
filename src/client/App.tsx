import MapSelection from "@screens/MapSelection/MapSelection";
import MapView from "@screens/MapView/MapView";
import { useAppStore } from "@store/store";
import { Toaster } from "@ui/Toast";

const App = () => {
    const activeMap = useAppStore((state) => state.activeMap);

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
