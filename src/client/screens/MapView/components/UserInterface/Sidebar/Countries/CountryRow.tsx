import { useMapStore } from "@store/store";
import { TableCell, TableRow } from "@ui/Table";
import { CountryTable } from "src/shared/types";

interface Props {
    country: CountryTable;
}

const CountryRow = ({ country }: Props) => {
    const selectCountry = useMapStore((state) => state.selectCountry).bind(null, country.tag);

    return (
        <TableRow className="relative w-[9.25rem]">
            <TableCell className="font-medium">
                <img
                    src={country.flag}
                    alt={`${country.name} flag`}
                    className="aspect-[3/2] h-6 rounded-md object-cover"
                />
                <button className="absolute inset-0" type="button" onClick={selectCountry} />
            </TableCell>
            <TableCell className="font-medium">{country.name}</TableCell>
            <TableCell className="text-right">{country.population.toLocaleString()}</TableCell>
        </TableRow>
    );
};
export default CountryRow;
