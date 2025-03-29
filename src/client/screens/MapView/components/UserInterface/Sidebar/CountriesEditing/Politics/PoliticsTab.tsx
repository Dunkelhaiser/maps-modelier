import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui/Tabs";
import PartiesTab from "../../Country/PoliticsTab/Parties/PartiesTab";
import EditPoliticiansForm from "./Politicians/EditPoliticiansForm";

const PoliticsTab = () => {
    return (
        <TabsContent value="politics">
            <Tabs defaultValue="parties">
                <TabsList>
                    <TabsTrigger value="parties">Parties</TabsTrigger>
                    <TabsTrigger value="politicians">Politicians</TabsTrigger>
                </TabsList>
                <PartiesTab />
                <EditPoliticiansForm />
            </Tabs>
        </TabsContent>
    );
};
export default PoliticsTab;
