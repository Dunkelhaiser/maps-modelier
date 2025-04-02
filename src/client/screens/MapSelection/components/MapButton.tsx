import { useMapStore } from "@store/store";
import { formatDate } from "@utils/utils";
import { MapIcon } from "lucide-react";
import { MapType } from "src/shared/types";
import DeleteMapDialog from "./DeleteMapDialog";
import RenameMapDialog from "./RenameMap/RenameMapDialog";

interface Props {
    map: MapType;
}

const MapButton = ({ map }: Props) => {
    const setActiveMap = useMapStore((state) => state.setActiveMap);

    const handleExistingMapSelect = async () => {
        setActiveMap(map.id);
    };

    return (
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
                <span className="text-xs text-muted-foreground">Created: {formatDate(map.createdAt)}</span>
            </div>
            <div className="z-10 ml-auto space-x-0.5">
                <RenameMapDialog map={map} />
                <DeleteMapDialog map={map} />
            </div>
        </div>
    );
};
export default MapButton;
