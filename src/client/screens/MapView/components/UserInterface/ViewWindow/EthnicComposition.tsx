import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@ui/Tooltip";
import { EthnicityComposition } from "@utils/types";

interface Props {
    totalPopulation: number;
    ethnicities: EthnicityComposition[];
}

const EthnicComposition = ({ totalPopulation, ethnicities }: Props) => {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <p>{totalPopulation.toLocaleString()} people</p>
                </TooltipTrigger>
                {totalPopulation > 0 && (
                    <TooltipContent className="flex flex-col gap-2">
                        {ethnicities.map((ethnicity) => (
                            <div key={ethnicity.id}>
                                <p>
                                    <span className="font-medium">{ethnicity.name}:</span>{" "}
                                    {((ethnicity.population / totalPopulation) * 100).toFixed(2)}%
                                </p>
                            </div>
                        ))}
                    </TooltipContent>
                )}
            </Tooltip>
        </TooltipProvider>
    );
};
export default EthnicComposition;
