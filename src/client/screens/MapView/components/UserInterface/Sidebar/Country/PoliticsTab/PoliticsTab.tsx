import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui/Tabs";
import GovernmentTab from "./Government/GovernmentTab";
import PartiesTab from "./Parties/PartiesTab";
import PoliticiansTab from "./Politicians/PoliticiansTab";

const PoliticsTab = () => {
    return (
        <TabsContent value="politics">
            <Tabs defaultValue="government">
                <TabsList>
                    <TabsTrigger value="government">Government</TabsTrigger>
                    <TabsTrigger value="parties">Parties</TabsTrigger>
                    <TabsTrigger value="politicians">Politicians</TabsTrigger>
                </TabsList>
                <GovernmentTab />
                <PartiesTab />
                <PoliticiansTab />
            </Tabs>
        </TabsContent>
    );
};
export default PoliticsTab;
