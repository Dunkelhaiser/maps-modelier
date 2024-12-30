import { useSidebarStore } from "@store/sidebar";
import { useMapSotre } from "@store/store";
import CountryWindow from "./CountryWindow";
import CreateCountryWindow from "./CreateCountryWindow";
import ProvinceWindow from "./ProvinceWindow";
import CreateStateWindow from "./StateWindow/CreateStateWindow";
import StateWindow from "./StateWindow/StateWindow";

const FloatingWindows = () => {
    const mode = useMapSotre((state) => state.mode);
    const screen = useSidebarStore((state) => state.screen);
    const selectedProvinces = useMapSotre((state) => state.selectedProvinces);
    const selectedState = useMapSotre((state) => state.selectedState);
    const selectedCountry = useMapSotre((state) => state.selectedCountry);

    return (
        !screen && (
            <div className="absolute bottom-3 left-3 flex flex-col gap-4">
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
