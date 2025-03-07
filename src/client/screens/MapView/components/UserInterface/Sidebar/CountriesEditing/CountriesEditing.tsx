import CardHeaderWithClose from "@components/CardHeaderWithClose";
import { useSidebarStore } from "@store/sidebar";
import { useMapStore } from "@store/store";
import { CardContent, CardTitle } from "@ui/Card";
import CreateCountryForm from "./CreateCountryForm";
import EditCountryForm from "./EditCountryForm";

const CountriesEditing = () => {
    const selectedCountry = useMapStore((state) => state.selectedCountry);
    const closeSidebar = useSidebarStore((state) => state.closeSidebar);

    return (
        <>
            <CardHeaderWithClose onClick={closeSidebar}>
                <CardTitle className="text-xl">{selectedCountry?.tag ? "Edit Country" : "Create Country"}</CardTitle>
            </CardHeaderWithClose>
            <CardContent className="flex h-[calc(100%_-_1rem_-_calc(45.6px_+_0.75rem))] flex-col gap-2 overflow-auto">
                {selectedCountry?.tag ? <EditCountryForm /> : <CreateCountryForm />}
            </CardContent>
        </>
    );
};
export default CountriesEditing;
