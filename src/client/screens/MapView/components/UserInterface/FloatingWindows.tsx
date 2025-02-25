import { useSidebarStore } from "@store/sidebar";
import { useMapStore } from "@store/store";
import ProvinceWindow from "./ProvinceWindow";
import CreateStateWindow from "./StateWindow/CreateStateWindow";
import StateWindow from "./StateWindow/StateWindow";
import ViewWindow from "./ViewWindow/ViewWindow";

const FloatingWindows = () => {
    const mode = useMapStore((state) => state.mode);
    const activeSidebar = useSidebarStore((state) => state.activeSidebar);
    const selectedProvinces = useMapStore((state) => state.selectedProvinces);
    const selectedState = useMapStore((state) => state.selectedState);

    return (
        !activeSidebar && (
            <div className="absolute bottom-3 left-3 flex flex-col gap-4">
                {mode === "viewing" && selectedProvinces.length > 0 && selectedState && <ViewWindow />}
                {mode === "editing" && (
                    <div className="flex flex-row items-end gap-4">
                        <ProvinceWindow />
                        {selectedProvinces.length > 0 && selectedState ? (
                            <StateWindow />
                        ) : (
                            selectedProvinces.length > 0 && <CreateStateWindow />
                        )}
                    </div>
                )}
            </div>
        )
    );
};
export default FloatingWindows;
