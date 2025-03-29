import { useActiveMap } from "@hooks/useActiveMap";
import { useGetPoliticians } from "@ipc/politicians";
import { useMapStore } from "@store/store";
import { TabsContent } from "@ui/Tabs";
import Politician from "./Politician";

const PoliticiansTab = () => {
    const activeMap = useActiveMap();
    const selectedCountry = useMapStore((state) => state.selectedCountry)!;
    const { data: politicians = [] } = useGetPoliticians(activeMap, selectedCountry);

    return (
        <TabsContent className="grid grid-cols-3 gap-2" value="politicians">
            {politicians.map((politician) => (
                <Politician key={politician.id} politician={politician} />
            ))}
        </TabsContent>
    );
};
export default PoliticiansTab;
