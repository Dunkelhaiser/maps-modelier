import { useActiveMap } from "@hooks/useActiveMap";
import { useGetParties } from "@ipc/parties";
import { useMapStore } from "@store/store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui/Tabs";
import PartiesTab from "../../Country/PoliticsTab/Parties/PartiesTab";
import EditPoliticiansForm from "./Politicians/EditPoliticiansForm";

const PoliticsTab = () => {
    const activeMap = useActiveMap();
    const selectedCountry = useMapStore((state) => state.selectedCountry)!;
    const { data: parties = [] } = useGetParties(activeMap, selectedCountry);

    return (
        <TabsContent value="politics">
            <Tabs defaultValue="parties">
                <TabsList>
                    <TabsTrigger value="parties">Parties</TabsTrigger>
                    <TabsTrigger value="politicians">Politicians</TabsTrigger>
                </TabsList>
                <PartiesTab parties={parties} />
                <EditPoliticiansForm />
            </Tabs>
        </TabsContent>
    );
};
export default PoliticsTab;
