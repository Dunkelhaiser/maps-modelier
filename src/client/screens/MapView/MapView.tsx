import { MapCanvas } from "@screens/MapView/components/Map/Map";
import UserInterface from "@screens/MapView/components/UserInterface/UserInterface";
import { useMapStore } from "@store/store";
import { ActiveMap } from "@utils/types";
import { useHotkeys } from "react-hotkeys-hook";

interface Props {
    activeMap: ActiveMap;
}

const MapView = ({ activeMap }: Props) => {
    const mode = useMapStore((state) => state.mode);
    const setMode = useMapStore((state) => state.setMode);

    useHotkeys("ctrl+e", () => (mode === "editing" ? setMode("viewing") : setMode("editing")));

    return (
        <>
            <UserInterface />
            <MapCanvas activeMap={activeMap} />
        </>
    );
};
export default MapView;
