import { Button } from "@ui/Button";
import { Map } from "@utils/types";
import { MapIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import UploadMapImageDialog from "./Dialogs/UploadMapImageDialog";
import { useMapStore } from "@/store/store";

interface Props {
    map: Map;
}

const MapButton = ({ map }: Props) => {
    const setActiveMap = useMapStore((state) => state.setActiveMap);
    const [selectedMapForUpload, setSelectedMapForUpload] = useState<Map | null>(null);

    const handleExistingMapSelect = async () => {
        if (map.imgPath) {
            try {
                const imageUrl = await window.electronAPI.loadMapImage(map.imgPath);
                setActiveMap({ ...map, imageUrl });
            } catch (err) {
                toast.error(`Failed to load map image: ${JSON.stringify(err)}`);
                setSelectedMapForUpload(map);
            }
        } else {
            setSelectedMapForUpload(map);
        }
    };

    return (
        <>
            <Button
                key={map.id}
                variant="outline"
                className="h-auto w-full justify-start"
                onClick={handleExistingMapSelect}
            >
                <MapIcon className="mr-2 size-5" />
                <div className="flex flex-col items-start">
                    <span>{map.name}</span>
                    <span className="text-xs text-muted-foreground">
                        Created: {new Date(map.createdAt).toLocaleDateString()}
                    </span>
                </div>
            </Button>
            <UploadMapImageDialog
                selectedMapForUpload={selectedMapForUpload}
                setSelectedMapForUpload={setSelectedMapForUpload}
            />
        </>
    );
};
export default MapButton;
