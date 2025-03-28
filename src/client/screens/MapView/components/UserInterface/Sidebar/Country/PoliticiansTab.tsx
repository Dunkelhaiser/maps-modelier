import { Card, CardContent } from "@ui/Card";
import { TabsContent } from "@ui/Tabs";
import { PoliticianWithParty } from "src/shared/types";

interface Props {
    politicians: PoliticianWithParty[];
}

const PoliticiansTab = ({ politicians }: Props) => {
    return (
        <TabsContent className="grid grid-cols-3 gap-2" value="politicians">
            {politicians.map((politician) => (
                <Card key={politician.id} className="overflow-hidden">
                    {politician.portrait ? (
                        <img
                            src={politician.portrait}
                            alt={`${politician.name} portrait`}
                            className="aspect-[3_/_4] w-full"
                        />
                    ) : (
                        <div className="flex aspect-[3_/_4] w-full select-none items-center justify-center bg-muted text-3xl font-medium text-muted-foreground">
                            ?
                        </div>
                    )}
                    <CardContent className="space-y-2 p-2">
                        <p className="text-sm font-medium">{politician.name}</p>
                        {politician.party && (
                            <p className="w-fit rounded-md bg-muted px-2 py-1 text-sm font-medium text-muted-foreground">
                                {politician.party.name}
                            </p>
                        )}
                    </CardContent>
                </Card>
            ))}
        </TabsContent>
    );
};
export default PoliticiansTab;
