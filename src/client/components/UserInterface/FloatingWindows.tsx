import CreateCountryWindow from "./CreateCountryWindow";
import CreateStateWindow from "./CreateStateWindow";
import ProvinceWindow from "./ProvinceWindow";
import StateWindow from "./StateWindow";
import { useMapStore } from "@/store/store";

const FloatingWindows = () => {
    const mode = useMapStore((state) => state.mode);
    const selectedProvinces = useMapStore((state) => state.selectedProvinces);
    const selectedState = useMapStore((state) => state.selectedState);

    return (
        <div className="absolute bottom-3 left-3 flex flex-col gap-4">
            {mode === "provinces_editing" && <ProvinceWindow />}
            {mode === "states_editing" && selectedProvinces.length > 0 && selectedState ? (
                <StateWindow />
            ) : (
                mode === "states_editing" && selectedProvinces.length > 0 && <CreateStateWindow />
            )}
            {mode === "countries_editing" && selectedProvinces.length > 0 && <CreateCountryWindow />}
        </div>
    );
};
export default FloatingWindows;
