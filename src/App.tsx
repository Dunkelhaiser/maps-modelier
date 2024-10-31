import { MapCanvas } from "@components/Map";
import { MapUpload } from "@components/MapUpload";
import { useEffect, useState } from "react";
import { sql } from "./db/db";
import { sqlSchema } from "./db/schema.sql";

const App = () => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    useEffect(() => {
        const query = async () => {
            await sql.exec(sqlSchema);
        };

        query();
    }, []);

    return (
        <main className="grid h-screen w-screen place-items-center">
            {!imageUrl ? <MapUpload onImageUpload={setImageUrl} /> : <MapCanvas imageUrl={imageUrl} />}
        </main>
    );
};

export default App;
