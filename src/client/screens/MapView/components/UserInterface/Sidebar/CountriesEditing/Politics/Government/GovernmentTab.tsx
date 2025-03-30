import { TabsContent } from "@ui/Tabs";
import HeadOfGovernmentForm from "./HeadOfGovernmentForm";
import HeadOfStateForm from "./HeadOfStateForm";

const GovernmentTab = () => {
    return (
        <TabsContent value="government" className="grid grid-cols-2 gap-4">
            <HeadOfStateForm />
            <HeadOfGovernmentForm />
        </TabsContent>
    );
};

export default GovernmentTab;
