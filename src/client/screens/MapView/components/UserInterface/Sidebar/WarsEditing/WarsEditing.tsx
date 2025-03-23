import CardHeaderWithClose from "@components/CardHeaderWithClose";
import { useSidebarStore } from "@store/sidebar";
import { useMapStore } from "@store/store";
import { CardContent, CardTitle } from "@ui/Card";
import CreateWarForm from "./CreateWarForm";
import EditWarForm from "./EditWarForm";

const WarsEditing = () => {
    const selectedWar = useMapStore((state) => state.selectedWar);
    const closeSidebar = useSidebarStore((state) => state.closeSidebar);

    return (
        <>
            <CardHeaderWithClose onClick={closeSidebar}>
                <CardTitle className="text-xl">{selectedWar === -1 ? "Create War" : "Edit War"}</CardTitle>
            </CardHeaderWithClose>
            <CardContent className="flex h-[calc(100%_-_1rem_-_calc(45.6px_+_0.75rem))] flex-col gap-2 overflow-auto">
                {selectedWar === -1 ? <CreateWarForm /> : <EditWarForm />}
            </CardContent>
        </>
    );
};
export default WarsEditing;
