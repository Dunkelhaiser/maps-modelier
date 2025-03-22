import CardHeaderWithClose from "@components/CardHeaderWithClose";
import { useSidebarStore } from "@store/sidebar";
import { useMapStore } from "@store/store";
import { CardContent, CardTitle } from "@ui/Card";
import { Pencil } from "lucide-react";
import CreateCountryForm from "./CreateCountryForm";
import EditCountryForm from "./EditCountryForm";

const CountriesEditing = () => {
    const selectedCountry = useMapStore((state) => state.selectedCountry);
    const closeSidebar = useSidebarStore((state) => state.closeSidebar);

    return (
        <>
            <CardHeaderWithClose onClick={closeSidebar}>
                <div className="flex items-center gap-2">
                    {selectedCountry !== -1 && <Pencil size={18} className="text-primary" />}
                    <CardTitle className="text-xl">
                        {selectedCountry === -1 ? "Create Country" : "Edit Country"}
                    </CardTitle>
                </div>
            </CardHeaderWithClose>
            <CardContent className="h-[calc(100%_-_1rem_-_calc(45.6px_+_0.75rem))] overflow-auto">
                {selectedCountry === -1 ? <CreateCountryForm /> : <EditCountryForm />}
            </CardContent>
        </>
    );
};

export default CountriesEditing;
