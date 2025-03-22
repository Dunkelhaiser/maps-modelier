import { useMapStore } from "@store/store";
import { TableCell, TableRow } from "@ui/Table";
import { CountryBase } from "src/shared/types";

interface Props {
    member: CountryBase;
}

const MemberRow = ({ member }: Props) => {
    const selectCountry = useMapStore((state) => state.selectCountry);

    return (
        <TableRow key={member.id} className="relative">
            <TableCell>
                <img
                    src={member.flag}
                    alt={`Flag of ${member.name}`}
                    className="aspect-[3/2] h-6 rounded-md border border-border object-cover"
                />
                <button className="absolute inset-0" type="button" onClick={() => selectCountry(member.id)} />
            </TableCell>
            <TableCell>{member.name}</TableCell>
        </TableRow>
    );
};
export default MemberRow;
