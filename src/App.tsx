import { MapCanvas } from "@components/Map";
import { MapUpload } from "@components/MapUpload";
import { useState } from "react";

const App = () => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    return (
        <main className="grid h-screen w-screen place-items-center">
            {!imageUrl ? <MapUpload onImageUpload={setImageUrl} /> : <MapCanvas imageUrl={imageUrl} />}
        </main>
    );
};

export default App;
