import { MapCanvas } from "@components/Map";
import MapSelection from "@components/MapSelection";
import { ActiveMap } from "@utils/types";
import { InferSelectModel } from "drizzle-orm";
import { useEffect, useState } from "react";
import { sql } from "./db/db";
import { maps } from "./db/schema";
import { sqlSchema } from "./db/schema.sql";

const App = () => {
    const [activeMap, setActiveMap] = useState<ActiveMap | null>(null);

    useEffect(() => {
        const initDb = async () => {
            await sql.exec(sqlSchema);
        };

        initDb();
    }, []);

    const handleMapSelect = (map: InferSelectModel<typeof maps>, imageUrl: string) => {
        setActiveMap({ ...map, imageUrl });
    };

    return (
        <main className="grid h-screen w-screen place-items-center">
            {!activeMap ? <MapSelection onMapSelect={handleMapSelect} /> : <MapCanvas imageUrl={activeMap.imageUrl} />}
        </main>
    );
};

export default App;
