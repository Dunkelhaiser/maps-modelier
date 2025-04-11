import { Country } from "src/shared/types";
import { AllianceTag } from "./AllianceTag";

interface Props {
    country: Country;
}

const AlliancesTab = ({ country }: Props) => {
    return (
        <section className="flex flex-wrap gap-2">
            {country.alliances.map((alliance) => (
                <AllianceTag key={alliance.id} alliance={alliance} />
            ))}
        </section>
    );
};
export default AlliancesTab;
