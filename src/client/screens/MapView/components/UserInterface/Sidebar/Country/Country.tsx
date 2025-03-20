import CardHeaderWithClose from "@components/CardHeaderWithClose";
import { useActiveMap } from "@hooks/useActiveMap";
import { useGetCountryByTag } from "@ipc/countries";
import { useSidebarStore } from "@store/sidebar";
import { useMapStore } from "@store/store";
import { CardContent, CardTitle } from "@ui/Card";
import { Users, Music } from "lucide-react";
import { AllianceTag } from "./AllianceTag";
import { EthnicityBar } from "./EthnicityBar";

const Country = () => {
    const activeMap = useActiveMap();
    const selectedCountry = useMapStore((state) => state.selectedCountry);
    const closeSidebar = useSidebarStore((state) => state.closeSidebar);

    const { data: country } = useGetCountryByTag(activeMap, selectedCountry);

    if (!country) {
        return <p className="p-4 text-center">Loading country data...</p>;
    }

    return (
        <>
            <CardHeaderWithClose onClick={closeSidebar}>
                <div className="flex items-center gap-2">
                    <div className="size-6 rounded-full" style={{ backgroundColor: country.color }} />
                    <CardTitle className="text-xl">{country.name.official ?? country.name.common}</CardTitle>
                </div>
            </CardHeaderWithClose>

            <CardContent className="flex h-[calc(100%_-_1rem_-_calc(45.6px_+_0.75rem))] flex-col gap-4 overflow-auto pb-6">
                <div className="flex flex-col gap-3">
                    <div className="flex gap-3">
                        <div className="flex-1">
                            <p className="mb-1 text-xs font-medium text-slate-500">Flag</p>
                            <div className="overflow-hidden rounded-md border border-slate-200">
                                <img
                                    src={country.flag}
                                    alt={`Flag of ${country.name.common}`}
                                    className="h-32 w-full object-cover"
                                />
                            </div>
                        </div>

                        <div className="flex-1">
                            <p className="mb-1 text-xs font-medium text-slate-500">Coat of Arms</p>
                            <div className="aspect-square h-32 overflow-hidden rounded-md border border-slate-200 bg-slate-50">
                                {country.coatOfArms && (
                                    <img
                                        src={country.coatOfArms}
                                        alt={`Coat of Arms of ${country.name.common}`}
                                        className="size-full object-contain"
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    {country.anthem && (
                        <div>
                            <div className="flex items-center gap-1 text-xs font-medium text-slate-500">
                                <Music size={14} />
                                <p>National Anthem: {country.anthem.name}</p>
                            </div>
                            <audio controls className="mt-1 w-full">
                                <source src={country.anthem.url} />
                            </audio>
                        </div>
                    )}
                </div>

                <div className="mt-2">
                    <h3 className="mb-2 text-lg font-semibold">Demographics</h3>

                    <div className="space-y-4">
                        <div className="flex items-center gap-2 rounded-md bg-slate-100 p-3 shadow-sm">
                            <div className="rounded-full bg-slate-200 p-2">
                                <Users size={16} className="text-slate-600" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500">Population</p>
                                <p className="font-medium">{country.population.toLocaleString()}</p>
                            </div>
                        </div>
                        <EthnicityBar ethnicities={country.ethnicities} />
                    </div>

                    <div className="mt-3 max-h-40 overflow-y-auto rounded-md border border-slate-200">
                        <table className="w-full border-collapse text-sm">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="border-b border-slate-200 p-2 text-left">Ethnicity</th>
                                    <th className="border-b border-slate-200 p-2 text-right">Population</th>
                                    <th className="border-b border-slate-200 p-2 text-right">Percentage</th>
                                </tr>
                            </thead>
                            <tbody>
                                {country.ethnicities
                                    .sort((a, b) => b.population - a.population)
                                    .map((ethnicity) => (
                                        <tr key={ethnicity.id} className="border-b border-slate-100 hover:bg-slate-50">
                                            <td className="p-2">
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="size-3 rounded-full"
                                                        style={{ backgroundColor: ethnicity.color }}
                                                    />
                                                    {ethnicity.name}
                                                </div>
                                            </td>
                                            <td className="p-2 text-right">{ethnicity.population.toLocaleString()}</td>
                                            <td className="p-2 text-right">
                                                {((ethnicity.population / country.population) * 100).toFixed(2)}%
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {country.alliances.length > 0 && (
                    <div className="mt-2">
                        <h3 className="mb-2 text-lg font-semibold">Alliances</h3>
                        <div className="flex flex-wrap gap-2">
                            {country.alliances.map((alliance) => (
                                <AllianceTag key={alliance.id} alliance={alliance} />
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </>
    );
};

export default Country;
