import { useMapStore } from "@store/store";
import { Card, CardContent } from "@ui/Card";
import { PoliticianWithParty } from "src/shared/types";

interface Props {
    politician: PoliticianWithParty;
}

const Politician = ({ politician }: Props) => {
    const selectParty = useMapStore((state) => state.selectParty);

    return (
        <Card className="overflow-hidden">
            {politician.portrait ? (
                <img src={politician.portrait} alt={`${politician.name} portrait`} className="aspect-[3_/_4] w-full" />
            ) : (
                <div className="flex aspect-[3_/_4] w-full select-none items-center justify-center bg-muted text-3xl font-medium text-muted-foreground">
                    ?
                </div>
            )}
            <CardContent className="space-y-2 p-2">
                <p className="text-sm font-medium">{politician.name}</p>
                {politician.party && (
                    <button
                        type="button"
                        onClick={() => politician.party && selectParty(politician.party.id)}
                        className="w-fit rounded-md bg-muted px-2 py-1 text-sm font-medium text-muted-foreground"
                    >
                        {politician.party.acronym ?? politician.party.name}
                    </button>
                )}
            </CardContent>
        </Card>
    );
};
export default Politician;
