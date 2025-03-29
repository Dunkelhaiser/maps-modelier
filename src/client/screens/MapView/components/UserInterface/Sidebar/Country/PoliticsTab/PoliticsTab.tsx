import { useActiveMap } from "@hooks/useActiveMap";
import { useGetParties } from "@ipc/parties";
import { useGetPoliticians } from "@ipc/politicians";
import { useMapStore } from "@store/store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui/Tabs";
import PartiesTab from "./Parties/PartiesTab";
import PoliticiansTab from "./Politicians/PoliticiansTab";

const PoliticsTab = () => {
    const activeMap = useActiveMap();
    const selectedCountry = useMapStore((state) => state.selectedCountry)!;
    const { data: politicians = [] } = useGetPoliticians(activeMap, selectedCountry);
    const { data: parties = [] } = useGetParties(activeMap, selectedCountry);

    return (
        <TabsContent value="politics">
            <Tabs defaultValue="parties">
                <TabsList>
                    <TabsTrigger value="parties">Parties</TabsTrigger>
                    <TabsTrigger value="politicians">Politicians</TabsTrigger>
                </TabsList>
                <PartiesTab parties={parties} />
                <PoliticiansTab politicians={politicians} />
            </Tabs>
        </TabsContent>
    );
};
export default PoliticsTab;
