import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui/Tabs";
import EditPoliticiansForm from "./Politicians/EditPoliticiansForm";

const PoliticsTab = () => {
    return (
        <TabsContent value="politics">
            <Tabs defaultValue="politicians">
                <TabsList>
                    <TabsTrigger value="politicians">Politicians</TabsTrigger>
                </TabsList>
                <EditPoliticiansForm />
            </Tabs>
        </TabsContent>
    );
};
export default PoliticsTab;
