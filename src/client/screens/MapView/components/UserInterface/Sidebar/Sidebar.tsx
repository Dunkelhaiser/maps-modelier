import { useSidebarStore } from "@store/sidebar";
import { Card } from "@ui/Card";
import Countries from "./Countries/Countries";
import CountriesEditing from "./CountriesEditing/CountriesEditing";
import Ethnicities from "./Ethnicities/Ethnicities";

const Sidebar = () => {
    const activeSidebar = useSidebarStore((state) => state.activeSidebar);

    return (
        activeSidebar && (
            <Card className="absolute bottom-3 left-3 top-[calc(45.6px_+_0.75rem)] w-[28rem]">
                {activeSidebar === "ethnicities" && <Ethnicities />}
                {activeSidebar === "countries" && <Countries />}
                {activeSidebar === "countries_editing" && <CountriesEditing />}
            </Card>
        )
    );
};
export default Sidebar;
