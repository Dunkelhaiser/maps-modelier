import { TabsContent } from "@ui/Tabs";
import HeadOfGovernmentForm from "./HeadOfGovernmentForm";
import HeadOfStateForm from "./HeadOfStateForm";
import ParliamentForm from "./ParliamentForm";

const GovernmentTab = () => {
    return (
        <TabsContent value="government" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <HeadOfStateForm />
                <HeadOfGovernmentForm />
            </div>
            <ParliamentForm />
        </TabsContent>
    );
};

export default GovernmentTab;
