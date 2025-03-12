import { useSidebarStore } from "@store/sidebar";
import { useMapStore } from "@store/store";
import { Card } from "@ui/Card";
import Alliance from "./Alliance/Alliance";
import Alliances from "./Alliances/Alliances";
import AlliancesEditing from "./AlliancesEditing/AlliancesEditing";
import Countries from "./Countries/Countries";
import CountriesEditing from "./CountriesEditing/CountriesEditing";
import Country from "./Country/Country";
import Ethnicities from "./Ethnicities/Ethnicities";

const Sidebar = () => {
    const activeSidebar = useSidebarStore((state) => state.activeSidebar);
    const mode = useMapStore((state) => state.mode);
    const selectedCountry = useMapStore((state) => state.selectedCountry);
    const selectedAlliance = useMapStore((state) => state.selectedAlliance);

    const renderSidebarContent = () => {
        if (activeSidebar === "ethnicities") return <Ethnicities />;

        if (activeSidebar === "countries") {
            if (selectedCountry) {
                if (mode === "viewing") return <Country />;
                return <CountriesEditing />;
            }
            return <Countries />;
        }

        if (activeSidebar === "alliances") {
            if (selectedAlliance) {
                if (mode === "viewing") return <Alliance />;
                return <AlliancesEditing />;
            }
            return <Alliances />;
        }

        return null;
    };

    return (
        activeSidebar && (
            <Card className="absolute bottom-3 left-3 top-[calc(45.6px_+_0.75rem)] w-[28rem]">
                {renderSidebarContent()}
            </Card>
        )
    );
};
export default Sidebar;
