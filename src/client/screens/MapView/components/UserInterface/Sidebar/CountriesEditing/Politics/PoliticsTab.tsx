import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui/Tabs";
import PartiesTab from "../../Country/PoliticsTab/Parties/PartiesTab";
import GovernmentTab from "./Government/GovernmentTab";
import EditPoliticiansForm from "./Politicians/EditPoliticiansForm";

const PoliticsTab = () => {
    return (
        <TabsContent value="politics">
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
                    <EditPoliticiansForm />
                </TabsContent>
            </Tabs>
        </TabsContent>
    );
};
export default PoliticsTab;
