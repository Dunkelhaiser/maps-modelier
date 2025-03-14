import CardHeaderWithClose from "@components/CardHeaderWithClose";
import { useActiveMap } from "@hooks/useActiveMap";
import { useGetAlliance } from "@ipc/alliances";
import { useSidebarStore } from "@store/sidebar";
import { useMapStore } from "@store/store";
import { CardContent, CardTitle } from "@ui/Card";

const Alliance = () => {
    const activeMap = useActiveMap();
    const selectedAlliance = useMapStore((state) => state.selectedAlliance)!;
    const closeSidebar = useSidebarStore((state) => state.closeSidebar);

    const { data: alliance } = useGetAlliance(activeMap.id, selectedAlliance);

    return (
        <>
            <CardHeaderWithClose onClick={closeSidebar}>
                <CardTitle className="text-xl">{alliance?.name}</CardTitle>
            </CardHeaderWithClose>
            <CardContent />
        </>
    );
};
export default Alliance;
