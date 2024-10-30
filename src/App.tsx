import { MapCanvas } from "@components/Map";
import { MapUpload } from "@components/MapUpload";
import { useEffect, useState } from "react";
import { sql } from "./db/db";

const App = () => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    useEffect(() => {
        const query = async () => {
            await sql.exec(
                `CREATE TABLE IF NOT EXISTS "provinces" ("id" serial PRIMARY KEY NOT NULL, "color" text NOT NULL, "type" text NOT NULL, CONSTRAINT "provinces_color_unique" UNIQUE("color"));`
            );
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
