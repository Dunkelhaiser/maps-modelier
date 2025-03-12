import CardHeaderWithClose from "@components/CardHeaderWithClose";
import { useSidebarStore } from "@store/sidebar";
import { useMapStore } from "@store/store";
import { CardContent, CardTitle } from "@ui/Card";

const Alliance = () => {
    const selectedAlliance = useMapStore((state) => state.selectedAlliance);
    const closeSidebar = useSidebarStore((state) => state.closeSidebar);

    return (
        <>
            <CardHeaderWithClose onClick={closeSidebar}>
                <CardTitle className="text-xl">{selectedAlliance?.name}</CardTitle>
            </CardHeaderWithClose>
            <CardContent />
        </>
    );
};
export default Alliance;
