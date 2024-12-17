import { Button } from "@ui/Button";
import { Map } from "@utils/types";
import { Edit, MapIcon, Trash } from "lucide-react";
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
            <div className="relative flex h-auto w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-input bg-background px-4 py-2 shadow-sm transition focus-within:translate-y-[2px] focus-within:ring-2 focus-within:ring-ring hover:translate-y-[2px] hover:bg-accent hover:text-accent-foreground">
                <MapIcon className="mr-2 size-5" />
                <div className="flex flex-col items-start">
                    <button
                        type="button"
                        onClick={handleExistingMapSelect}
                        className="text-sm font-medium outline-none before:absolute before:inset-0 before:content-['']"
                    >
                        {map.name}
                    </button>
                    <span className="text-xs text-muted-foreground">
                        Created: {new Date(map.createdAt).toLocaleDateString()}
                    </span>
                </div>
                <div className="z-10 ml-auto space-x-0.5">
                    <Button variant="ghost" size="icon" className="hover:bg-white/75">
                        <Edit />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:bg-red-100/45 hover:text-destructive"
                    >
                        <Trash />
                    </Button>
                </div>
            </div>
            <UploadMapImageDialog
                selectedMapForUpload={selectedMapForUpload}
                setSelectedMapForUpload={setSelectedMapForUpload}
            />
        </>
    );
};
export default MapButton;
