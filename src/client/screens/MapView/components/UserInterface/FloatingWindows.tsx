import { useSidebarStore } from "@store/sidebar";
import { useAppStore } from "@store/store";
import CountryWindow from "./CountryWindow";
import CreateCountryWindow from "./CreateCountryWindow";
import CreateStateWindow from "./CreateStateWindow";
import ProvinceWindow from "./ProvinceWindow";
import StateWindow from "./StateWindow";

const FloatingWindows = () => {
    const mode = useAppStore((state) => state.mode);
    const screen = useSidebarStore((state) => state.screen);
    const selectedProvinces = useAppStore((state) => state.selectedProvinces);
    const selectedState = useAppStore((state) => state.selectedState);
    const selectedCountry = useAppStore((state) => state.selectedCountry);

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
