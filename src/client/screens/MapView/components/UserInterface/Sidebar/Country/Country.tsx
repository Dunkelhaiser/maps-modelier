import CardHeaderWithClose from "@components/CardHeaderWithClose";
import { useActiveMap } from "@hooks/useActiveMap";
import { useGetCountryById } from "@ipc/countries";
import { useSidebarStore } from "@store/sidebar";
import { useMapStore } from "@store/store";
import { CardContent, CardTitle } from "@ui/Card";
import { Tabs, TabsList, TabsTrigger } from "@ui/Tabs";
import AlliancesTab from "./AlliancesTab";
import AttributesTab from "./AttributesTab";
import DemographicsTab from "./DemographicsTab";
import PoliticsTab from "./PoliticsTab/PoliticsTab";

const Country = () => {
    const activeMap = useActiveMap();
    const selectedCountry = useMapStore((state) => state.selectedCountry);
    const closeSidebar = useSidebarStore((state) => state.closeSidebar);

    const { data: country } = useGetCountryById(activeMap, selectedCountry);

    if (!country) {
        return <p className="p-4 text-center">Loading country data...</p>;
    }

    return (
        <>
            <CardHeaderWithClose onClick={closeSidebar}>
                <div className="flex items-center gap-2">
                    <div className="size-6 rounded-full" style={{ backgroundColor: country.color }} />
                    <CardTitle className="text-xl">{country.name.common}</CardTitle>
                    {country.name.official && (
                        <p className="text-sm font-medium text-muted-foreground">({country.name.official})</p>
                    )}
                </div>
            </CardHeaderWithClose>

            <CardContent className="h-[calc(100%_-_1rem_-_calc(45.6px_+_0.75rem))] overflow-y-auto">
                <Tabs defaultValue="attributes">
                    <TabsList>
                        <TabsTrigger value="attributes">Attributes</TabsTrigger>
                        <TabsTrigger value="demographics">Demographics</TabsTrigger>
                        <TabsTrigger value="politics">Politics</TabsTrigger>
                        {country.alliances.length > 0 && <TabsTrigger value="allliances">Alliances</TabsTrigger>}
                    </TabsList>
                    <AttributesTab country={country} />
                    <DemographicsTab country={country} />
                    <PoliticsTab />
                    {country.alliances.length > 0 && <AlliancesTab country={country} />}
                </Tabs>
            </CardContent>
        </>
    );
};

export default Country;
