import { useActiveMap } from "@hooks/useActiveMap";
import { useGetHeadOfState, useGetHeadOfGovernment } from "@ipc/government";
import { useMapStore } from "@store/store";
import { TabsContent } from "@ui/Tabs";
import Head from "./Head";

const GovernmentTab = () => {
    const activeMap = useActiveMap();
    const selectedCountry = useMapStore((state) => state.selectedCountry)!;

    const { data: headOfState } = useGetHeadOfState(activeMap, selectedCountry);
    const { data: headOfGovernment } = useGetHeadOfGovernment(activeMap, selectedCountry);

    const vacant = {
        id: -1,
        name: "Vacant",
        startDate: null,
        endDate: null,
        portrait: null,
        party: null,
    };

    return (
        <TabsContent value="government" className="grid grid-cols-2 gap-4">
            {headOfState ? (
                <Head head={headOfState} />
            ) : (
                <Head
                    head={{
                        title: "Head of State",
                        ...vacant,
                    }}
                />
            )}

            {headOfGovernment ? (
                <Head head={headOfGovernment} />
            ) : (
                <Head
                    head={{
                        title: "Head of Government",
                        ...vacant,
                    }}
                />
            )}
        </TabsContent>
    );
};

export default GovernmentTab;
