import { useSidebarStore } from "@store/sidebar";
import { useMapStore } from "@store/store";
import { Card } from "@ui/Card";
import Alliance from "./Alliance/Alliance";
import Alliances from "./Alliances/Alliances";
import AlliancesEditing from "./AlliancesEditing/AlliancesEditing";
import Countries from "./Countries/Countries";
import CountriesEditing from "./CountriesEditing/CountriesEditing";
import PartyEditing from "./CountriesEditing/Politics/Parties/PartyEditing";
import Country from "./Country/Country";
import Party from "./Country/PoliticsTab/Party/Party";
import Ethnicities from "./Ethnicities/Ethnicities";
import Ideologies from "./Ideologies/Ideologies";
import War from "./War/War";
import Wars from "./Wars/Wars";
import WarsEditing from "./WarsEditing/WarsEditing";

const Sidebar = () => {
    const activeSidebar = useSidebarStore((state) => state.activeSidebar);
    const mode = useMapStore((state) => state.mode);
    const selectedCountry = useMapStore((state) => state.selectedCountry);
    const selectedAlliance = useMapStore((state) => state.selectedAlliance);
    const selectedWar = useMapStore((state) => state.selectedWar);
    const selectedParty = useMapStore((state) => state.selectedParty);

    const renderSidebarContent = () => {
        if (activeSidebar === "ethnicities") return <Ethnicities />;

        if (activeSidebar === "countries") {
            if (selectedCountry) {
                if (mode === "viewing") return <Country />;
                return <CountriesEditing />;
            }
            return <Countries />;
        }

        if (activeSidebar === "parties") {
            if (selectedParty) {
                if (mode === "viewing") return <Party />;
                return <PartyEditing />;
            }
        }

        if (activeSidebar === "alliances") {
            if (selectedAlliance) {
                if (mode === "viewing") return <Alliance />;
                return <AlliancesEditing />;
            }
            return <Alliances />;
        }

        if (activeSidebar === "wars") {
            if (selectedWar) {
                if (mode === "viewing") return <War />;
                return <WarsEditing />;
            }
            return <Wars />;
        }

        if (activeSidebar === "ideologies") return <Ideologies />;

        return null;
    };

    return (
        activeSidebar && (
            <Card className="absolute bottom-3 left-3 top-[calc(45.6px_+_0.75rem)] w-[28rem] overflow-hidden">
                {renderSidebarContent()}
            </Card>
        )
    );
};
export default Sidebar;
