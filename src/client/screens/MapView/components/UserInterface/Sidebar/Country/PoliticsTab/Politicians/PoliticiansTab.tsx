import { useActiveMap } from "@hooks/useActiveMap";
import { useGetPoliticians } from "@ipc/politicians";
import { useMapStore } from "@store/store";
import Politician from "./Politician";

const PoliticiansTab = () => {
    const activeMap = useActiveMap();
    const selectedCountry = useMapStore((state) => state.selectedCountry)!;
    const { data: politicians = [] } = useGetPoliticians(activeMap, selectedCountry);

    return (
        <section className="grid grid-cols-3 gap-2">
            {politicians.map((politician) => (
                <Politician key={politician.id} politician={politician} />
            ))}
        </section>
    );
};
export default PoliticiansTab;
