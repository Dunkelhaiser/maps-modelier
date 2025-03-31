import { useActiveMap } from "@hooks/useActiveMap";
import { useGetHeadOfState, useGetHeadOfGovernment, useGetParliament } from "@ipc/government";
import { useMapStore } from "@store/store";
import { Separator } from "@ui/Separator";
import { TabsContent } from "@ui/Tabs";
import Head from "./Head";
import Parliament from "./Parliament";

const GovernmentTab = () => {
    const activeMap = useActiveMap();
    const selectedCountry = useMapStore((state) => state.selectedCountry)!;

    const { data: headOfState } = useGetHeadOfState(activeMap, selectedCountry);
    const { data: headOfGovernment } = useGetHeadOfGovernment(activeMap, selectedCountry);
    const { data: parliament } = useGetParliament(activeMap, selectedCountry);

    const vacant = {
        id: -1,
        name: "Vacant",
        startDate: null,
        endDate: null,
        portrait: null,
        party: null,
    };

    return (
        <TabsContent value="government" className="flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-4">
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
            </div>

            <Separator />
            {parliament ? (
                <Parliament parliament={parliament} />
            ) : (
                <p className="text-center text-muted-foreground">No parliament established</p>
            )}
        </TabsContent>
    );
};

export default GovernmentTab;
