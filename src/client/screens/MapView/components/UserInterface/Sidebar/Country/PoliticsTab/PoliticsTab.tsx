import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui/Tabs";
import GovernmentTab from "./Government/GovernmentTab";
import PartiesTab from "./Parties/PartiesTab";
import PoliticiansTab from "./Politicians/PoliticiansTab";

const PoliticsTab = () => {
    return (
        <Tabs defaultValue="government">
            <TabsList>
                <TabsTrigger value="government">Government</TabsTrigger>
                <TabsTrigger value="parties">Parties</TabsTrigger>
                <TabsTrigger value="politicians">Politicians</TabsTrigger>
            </TabsList>
            <TabsContent value="government">
                <GovernmentTab />
            </TabsContent>
            <TabsContent value="parties">
                <PartiesTab />
            </TabsContent>
            <TabsContent value="politicians">
                <PoliticiansTab />
            </TabsContent>
        </Tabs>
    );
};
export default PoliticsTab;
