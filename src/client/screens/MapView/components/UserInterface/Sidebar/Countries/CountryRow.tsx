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
    const setScreen = useSidebarStore((state) => state.setScreen);

    const editCountry = () => {
        setScreen("countries_editing");
        useMapStore.setState({ selectedCountry: country });
    };

    return (
        <TableRow className="w-[9.25rem]">
            <TableCell className="font-medium">
                <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTW_KykquMknj5dTIu5rxG4Y6bCGCNOCA5qSQ&s"
                    alt={`${country.name} flag`}
                    className="aspect-[3/2] h-6 object-cover"
                />
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
