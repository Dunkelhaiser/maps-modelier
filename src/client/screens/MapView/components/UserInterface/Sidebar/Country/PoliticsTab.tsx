import { useActiveMap } from "@hooks/useActiveMap";
import { useGetPoliticians } from "@ipc/politicians";
import { useMapStore } from "@store/store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui/Tabs";
import PoliticiansTab from "./PoliticiansTab";

const PoliticsTab = () => {
    const activeMap = useActiveMap();
    const selectedCountry = useMapStore((state) => state.selectedCountry)!;
    const { data: politicians = [] } = useGetPoliticians(activeMap, selectedCountry);

    return (
        <TabsContent value="politics">
            <Tabs defaultValue="politicians">
                <TabsList>
                    <TabsTrigger value="politicians">Politicians</TabsTrigger>
                </TabsList>
                <PoliticiansTab politicians={politicians} />
            </Tabs>
        </TabsContent>
    );
};
export default PoliticsTab;
