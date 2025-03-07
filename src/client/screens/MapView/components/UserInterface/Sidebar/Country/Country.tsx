import CardHeaderWithClose from "@components/CardHeaderWithClose";
import { useSidebarStore } from "@store/sidebar";
import { useMapStore } from "@store/store";
import { CardContent, CardTitle } from "@ui/Card";

const Country = () => {
    const selectedCountry = useMapStore((state) => state.selectedCountry);
    const closeSidebar = useSidebarStore((state) => state.closeSidebar);

    return (
        <>
            <CardHeaderWithClose onClick={closeSidebar}>
                <CardTitle className="text-xl">{selectedCountry?.name}</CardTitle>
            </CardHeaderWithClose>
            <CardContent className="flex h-[calc(100%_-_1rem_-_calc(45.6px_+_0.75rem))] flex-col gap-2 overflow-auto">
                <img src={selectedCountry?.flag} alt="Flag" className="rounded-md" />
                <img src={selectedCountry?.coatOfArms} alt="Coat of arms" />
                <audio controls>
                    <source src={selectedCountry?.anthem.url} />
                </audio>
            </CardContent>
        </>
    );
};
export default Country;
