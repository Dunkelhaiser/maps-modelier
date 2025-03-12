import CardHeaderWithClose from "@components/CardHeaderWithClose";
import { useSidebarStore } from "@store/sidebar";
import { useMapStore } from "@store/store";
import { CardContent, CardTitle } from "@ui/Card";
import CreateAllianceForm from "./CreateAllianceForm";
import EditAllianceForm from "./EditAllianceForm";

const AlliancesEditing = () => {
    const selectedAlliance = useMapStore((state) => state.selectedAlliance);
    const closeSidebar = useSidebarStore((state) => state.closeSidebar);

    return (
        <>
            <CardHeaderWithClose onClick={closeSidebar}>
                <CardTitle className="text-xl">
                    {selectedAlliance?.id === -1 ? "Create Alliance" : "Edit Alliance"}
                </CardTitle>
            </CardHeaderWithClose>
            <CardContent className="flex h-[calc(100%_-_1rem_-_calc(45.6px_+_0.75rem))] flex-col gap-2 overflow-auto">
                {selectedAlliance?.id === -1 ? <CreateAllianceForm /> : <EditAllianceForm />}
            </CardContent>
        </>
    );
};
export default AlliancesEditing;
