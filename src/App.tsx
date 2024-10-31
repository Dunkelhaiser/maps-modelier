import { MapCanvas } from "@components/Map";
import MapSelection from "@components/MapSelection";
import { useEffect } from "react";
import { sql } from "./db/db";
import { sqlSchema } from "./db/schema.sql";
import { useMapStore } from "./store/store";

const App = () => {
    const activeMap = useMapStore((state) => state.activeMap);

    useEffect(() => {
        const initDb = async () => {
            await sql.exec(sqlSchema);
        };

        initDb();
    }, []);

    return (
        <main className="grid h-screen w-screen place-items-center">
            {!activeMap ? <MapSelection /> : <MapCanvas imageUrl={activeMap.imageUrl} />}
        </main>
    );
};

export default App;
