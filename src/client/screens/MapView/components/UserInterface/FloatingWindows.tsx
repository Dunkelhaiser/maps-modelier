import { useSidebarStore } from "@store/sidebar";
import { useMapStore } from "@store/store";
import CountryWindow from "./CountryWindow";
import CreateCountryWindow from "./CreateCountryWindow";
import ProvinceWindow from "./ProvinceWindow";
import CreateStateWindow from "./StateWindow/CreateStateWindow";
import StateWindow from "./StateWindow/StateWindow";
import ViewWindow from "./ViewWindow/ViewWindow";

const FloatingWindows = () => {
    const mode = useMapStore((state) => state.mode);
    const screen = useSidebarStore((state) => state.screen);
    const selectedProvinces = useMapStore((state) => state.selectedProvinces);
    const selectedState = useMapStore((state) => state.selectedState);
    const selectedCountry = useMapStore((state) => state.selectedCountry);

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
                {mode === "countries_editing" && selectedProvinces.length > 0 && selectedCountry ? (
                    <CountryWindow />
                ) : (
                    mode === "countries_editing" && selectedProvinces.length > 0 && <CreateCountryWindow />
                )}
            </div>
        )
    );
};
export default FloatingWindows;
