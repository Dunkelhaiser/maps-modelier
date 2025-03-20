import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@components/ui/Tooltip";
import { useState } from "react";
import { Ethnicity } from "src/shared/types";

interface Props {
    ethnicities: Ethnicity[];
}

export const EthnicityBar = ({ ethnicities }: Props) => {
    const [hoveredEthnicityId, setHoveredEthnicityId] = useState<number | null>(null);

    const totalPopulation = ethnicities.reduce((sum, ethnicity) => sum + ethnicity.population, 0);

    const mainEthnicities: Ethnicity[] = []; // >=1%
    const smallEthnicities: Ethnicity[] = []; // <1%

    ethnicities.forEach((ethnicity) => {
        const percentage = (ethnicity.population / totalPopulation) * 100;
        if (percentage >= 1) {
            mainEthnicities.push(ethnicity);
        } else {
            smallEthnicities.push(ethnicity);
        }
    });

    const displayEthnicities = [...mainEthnicities];

    if (smallEthnicities.length === 1) {
        displayEthnicities.push(smallEthnicities[0]);
    } else if (smallEthnicities.length > 1) {
        const othersPopulation = smallEthnicities.reduce((sum, eth) => sum + eth.population, 0);
        displayEthnicities.push({
            id: -1,
            name: `Others (${smallEthnicities.length} groups)`,
            population: othersPopulation,
            color: "#B0B0B0",
        });
    }

    return (
        <TooltipProvider>
            <div className="w-full">
                <div className="flex h-4 w-full overflow-hidden rounded-full">
                    {displayEthnicities.map((ethnicity) => {
                        const percentage = (ethnicity.population / totalPopulation) * 100;
                        const isHovered = hoveredEthnicityId === ethnicity.id;

                        return (
                            <Tooltip key={ethnicity.id} delayDuration={0} open={isHovered}>
                                <TooltipTrigger asChild>
                                    <div
                                        className="h-full transition-all duration-200"
                                        style={{
                                            width: `${Math.max(0.5, percentage)}%`,
                                            backgroundColor: ethnicity.color,
                                            opacity: hoveredEthnicityId === null || isHovered ? 1 : 0.7,
                                            cursor: "pointer",
                                        }}
                                        onMouseEnter={() => setHoveredEthnicityId(ethnicity.id)}
                                        onMouseLeave={() => setHoveredEthnicityId(null)}
                                    />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <div className="flex flex-col">
                                        <p className="font-medium">{ethnicity.name}</p>
                                        <p className="text-xs">
                                            {percentage.toFixed(1)}% ({ethnicity.population.toLocaleString()} people)
                                        </p>
                                        {ethnicity.id === -1 && smallEthnicities.length > 0 && (
                                            <div className="mt-1 max-h-24 overflow-y-auto text-xs">
                                                <p className="mb-1 font-medium">Includes:</p>
                                                <ul className="list-inside list-disc">
                                                    {smallEthnicities.map((ethnic) => (
                                                        <li key={ethnic.id}>
                                                            {ethnic.name}:{" "}
                                                            {((ethnic.population / totalPopulation) * 100).toFixed(2)}%
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </TooltipContent>
                            </Tooltip>
                        );
                    })}
                </div>
            </div>
        </TooltipProvider>
    );
};
