import { useMapStore } from "@store/store";
import { TableCell, TableRow } from "@ui/Table";
import { Country } from "@utils/types";

interface Props {
    country: Country;
}

const CountryRow = ({ country }: Props) => {
    const editCountry = () => useMapStore.setState({ selectedCountry: country });

    return (
        <TableRow className="relative w-[9.25rem]">
            <TableCell className="font-medium">
                <img src={country.flag} alt={`${country.name} flag`} className="aspect-[3/2] h-6 object-cover" />
                <button className="absolute inset-0" type="button" onClick={editCountry} />
            </TableCell>
            <TableCell className="font-medium">{country.name}</TableCell>
            <TableCell className="text-right">{country.population.toLocaleString()}</TableCell>
        </TableRow>
    );
};
export default CountryRow;
