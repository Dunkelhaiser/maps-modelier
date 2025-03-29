import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui/Tabs";
import PartiesTab from "./Parties/PartiesTab";
import PoliticiansTab from "./Politicians/PoliticiansTab";

const PoliticsTab = () => {
    return (
        <TabsContent value="politics">
            <Tabs defaultValue="parties">
                <TabsList>
                    <TabsTrigger value="parties">Parties</TabsTrigger>
                    <TabsTrigger value="politicians">Politicians</TabsTrigger>
                </TabsList>
                <PartiesTab />
                <PoliticiansTab />
            </Tabs>
        </TabsContent>
    );
};
export default PoliticsTab;
