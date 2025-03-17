import CardHeaderWithClose from "@components/CardHeaderWithClose";
import { useActiveMap } from "@hooks/useActiveMap";
import { useGetCountryByTag } from "@ipc/countries";
import { useSidebarStore } from "@store/sidebar";
import { useMapStore } from "@store/store";
import { CardContent, CardTitle } from "@ui/Card";

const Country = () => {
    const activeMap = useActiveMap();
    const selectedCountry = useMapStore((state) => state.selectedCountry);
    const closeSidebar = useSidebarStore((state) => state.closeSidebar);

    const { data: country } = useGetCountryByTag(activeMap.id, selectedCountry);

    return (
        <>
            <CardHeaderWithClose onClick={closeSidebar}>
                <CardTitle className="text-xl">{country?.name.official ?? country?.name.common}</CardTitle>
            </CardHeaderWithClose>
            <CardContent className="flex h-[calc(100%_-_1rem_-_calc(45.6px_+_0.75rem))] flex-col gap-2 overflow-auto">
                <img src={country?.flag} alt="Flag" className="rounded-md" />
                <img src={country?.coatOfArms} alt="Coat of arms" />
                <audio controls>
                    <source src={country?.anthem?.url} />
                </audio>
            </CardContent>
        </>
    );
};
export default Country;
