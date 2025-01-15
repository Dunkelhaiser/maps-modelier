import { useSidebarStore } from "@store/sidebar";
import { useMapStore } from "@store/store";
import { Button } from "@ui/Button";
import { TableCell, TableRow } from "@ui/Table";
import { Plus } from "lucide-react";

const CountryRowCreate = () => {
    const setScreen = useSidebarStore((state) => state.setScreen);
    const deselectProvinces = useMapStore((state) => state.deselectProvinces);

    const createCountryHandler = () => {
        setScreen("countries_editing");
        deselectProvinces();
    };

    return (
        <TableRow className="hover:bg-card">
            <TableCell className="aspect-[3/2] h-6" />
            <TableCell className="text-right" />
            <TableCell className="text-right" />
            <TableCell className="text-right">
                <Button
                    size="icon"
                    variant="ghost"
                    className="size-6"
                    aria-label="Add"
                    type="button"
                    onClick={createCountryHandler}
                >
                    <Plus className="!size-3.5" />
                </Button>
            </TableCell>
        </TableRow>
    );
};
export default CountryRowCreate;
