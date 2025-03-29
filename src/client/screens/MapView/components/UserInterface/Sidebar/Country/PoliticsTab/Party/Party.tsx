import CardHeaderWithClose from "@components/CardHeaderWithClose";
import { useActiveMap } from "@hooks/useActiveMap";
import { useGetParty } from "@ipc/parties";
import { useSidebarStore } from "@store/sidebar";
import { useMapStore } from "@store/store";
import { CardContent, CardTitle } from "@ui/Card";

const Party = () => {
    const activeMap = useActiveMap();
    const selectedParty = useMapStore((state) => state.selectedParty)!;
    const closeSidebar = useSidebarStore((state) => state.closeSidebar);

    const { data: party } = useGetParty(activeMap, selectedParty);

    if (!party) {
        return <p className="p-4 text-center">Loading party data...</p>;
    }

    return (
        <>
            <CardHeaderWithClose onClick={closeSidebar}>
                <div className="flex items-center gap-2">
                    <div className="size-6 rounded-full" style={{ backgroundColor: party.color }} />
                    <CardTitle className="text-xl">{party.acronym ?? party.name}</CardTitle>
                    {party.acronym && <p className="text-sm font-medium text-muted-foreground">({party.name})</p>}
                </div>
            </CardHeaderWithClose>
            <CardContent className="h-[calc(100%_-_1rem_-_calc(45.6px_+_0.75rem))] overflow-y-auto" />
        </>
    );
};

export default Party;
