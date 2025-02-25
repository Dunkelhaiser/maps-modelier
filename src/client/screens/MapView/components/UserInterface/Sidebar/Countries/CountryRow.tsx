import { useSidebarStore } from "@store/sidebar";
import { useMapStore } from "@store/store";
import { Button } from "@ui/Button";
import { TableCell, TableRow } from "@ui/Table";
import { Country } from "@utils/types";
import { Edit } from "lucide-react";

interface Props {
    country: Country;
}

const CountryRow = ({ country }: Props) => {
    const mode = useMapStore((state) => state.mode);
    const openSidebar = useSidebarStore((state) => state.openSidebar);
    const deselectProvinces = useMapStore((state) => state.deselectProvinces);

    const editCountry = () => {
        openSidebar("countries_editing");
        deselectProvinces();
        useMapStore.setState({ selectedCountry: country });
    };

    return (
        <TableRow className="w-[9.25rem]">
            <TableCell className="font-medium">
                <img src={country.flag} alt={`${country.name} flag`} className="aspect-[3/2] h-6 object-cover" />
            </TableCell>
            <TableCell className="font-medium">{country.name}</TableCell>
            <TableCell className="text-right">{country.population.toLocaleString()}</TableCell>
            {mode !== "viewing" && (
                <TableCell className="space-x-1 text-right">
                    <Button
                        size="icon"
                        variant="ghost"
                        className="size-6"
                        aria-label="Edit"
                        type="button"
                        onClick={editCountry}
                    >
                        <Edit className="!size-3.5" />
                    </Button>
                </TableCell>
            )}
        </TableRow>
    );
};
export default CountryRow;
