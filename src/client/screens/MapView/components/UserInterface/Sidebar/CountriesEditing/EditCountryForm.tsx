import { useActiveMap } from "@hooks/useActiveMap";
import { useGetCountryById } from "@ipc/countries";
import { useMapStore } from "@store/store";
import { Tabs, TabsList, TabsTrigger } from "@ui/Tabs";
import EditAttributesForm from "./EditAttributesForm";

const EditCountryForm = () => {
    const activeMap = useActiveMap();
    const selectedCountry = useMapStore((state) => state.selectedCountry)!;

    const { data: country } = useGetCountryById(activeMap, selectedCountry);

    if (!country) {
        return <p className="p-4 text-center">Loading country data...</p>;
    }

    return (
        <Tabs defaultValue="attributes">
            <TabsList>
                <TabsTrigger value="attributes">Attributes</TabsTrigger>
            </TabsList>
            <EditAttributesForm />
        </Tabs>
    );
};

export default EditCountryForm;
