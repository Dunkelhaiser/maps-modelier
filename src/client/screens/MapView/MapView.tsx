import { MapCanvas } from "@screens/MapView/components/Map/Map";
import UserInterface from "@screens/MapView/components/UserInterface/UserInterface";
import { useSidebarStore } from "@store/sidebar";
import { useMapStore } from "@store/store";
import { useHotkeys } from "react-hotkeys-hook";
import { ActiveMap } from "src/shared/types";

interface Props {
    activeMap: ActiveMap;
}

const MapView = ({ activeMap }: Props) => {
    const mode = useMapStore((state) => state.mode);
    const setMode = useMapStore((state) => state.setMode);
    const deselectProvinces = useMapStore((state) => state.deselectProvinces);
    const closeSidebar = useSidebarStore((state) => state.closeSidebar);

    useHotkeys("ctrl+e", () => (mode === "editing" ? setMode("viewing") : setMode("editing")));
    useHotkeys("esc", () => {
        deselectProvinces();
        closeSidebar();
    });

    return (
        <>
            <UserInterface />
            <MapCanvas activeMap={activeMap} />
        </>
    );
};
export default MapView;
