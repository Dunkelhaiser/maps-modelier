import { TabsContent } from "@ui/Tabs";
import { PoliticianWithParty } from "src/shared/types";
import Politician from "./Politician";

interface Props {
    politicians: PoliticianWithParty[];
}

const PoliticiansTab = ({ politicians }: Props) => {
    return (
        <TabsContent className="grid grid-cols-3 gap-2" value="politicians">
            {politicians.map((politician) => (
                <Politician key={politician.id} politician={politician} />
            ))}
        </TabsContent>
    );
};
export default PoliticiansTab;
