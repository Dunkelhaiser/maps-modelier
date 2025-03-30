import { useMapStore } from "@store/store";
import { Card, CardContent } from "@ui/Card";
import { PoliticalPartyBase, Politician as PoliticianType } from "src/shared/types";

interface Props {
    politician: PoliticianType & { party?: PoliticalPartyBase | null };
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
                        className="w-fit rounded-md px-2 py-1 font-medium"
                        style={{ backgroundColor: `${politician.party.color}20` }}
                    >
                        <span className="text-sm" style={{ color: politician.party.color }}>
                            {politician.party.acronym ?? politician.party.name}
                        </span>
                    </button>
                )}
            </CardContent>
        </Card>
    );
};
export default Politician;
