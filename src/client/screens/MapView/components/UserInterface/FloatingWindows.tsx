import { useSidebarStore } from "@store/sidebar";
import { useMapStore } from "@store/store";
import ProvinceWindow from "./ProvinceWindow";
import CreateStateWindow from "./StateWindow/CreateStateWindow";
import StateWindow from "./StateWindow/StateWindow";
import ViewWindow from "./ViewWindow/ViewWindow";

const FloatingWindows = () => {
    const mode = useMapStore((state) => state.mode);
    const screen = useSidebarStore((state) => state.screen);
    const selectedProvinces = useMapStore((state) => state.selectedProvinces);
    const selectedState = useMapStore((state) => state.selectedState);

    return (
        !screen && (
            <div className="absolute bottom-3 left-3 flex flex-col gap-4">
                {mode === "viewing" &&
                    selectedProvinces.length > 0 &&
                    selectedProvinces[0].type === "land" &&
                    selectedState && <ViewWindow />}
                {mode === "provinces_editing" && <ProvinceWindow />}
                {mode === "states_editing" && selectedProvinces.length > 0 && selectedState ? (
                    <StateWindow />
                ) : (
                    mode === "states_editing" && selectedProvinces.length > 0 && <CreateStateWindow />
                )}
            </div>
        )
    );
};
export default FloatingWindows;
