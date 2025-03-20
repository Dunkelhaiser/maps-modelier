import { Ethnicity } from "src/shared/types";

interface Props {
    ethnicities: Ethnicity[];
}

export const EthnicityBar = ({ ethnicities }: Props) => {
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
        <div className="w-full">
            <div className="flex h-4 w-full overflow-hidden rounded-full">
                {displayEthnicities.map((ethnicity) => {
                    const percentage = (ethnicity.population / totalPopulation) * 100;
                    return (
                        <div
                            key={ethnicity.id}
                            className="h-full"
                            style={{
                                width: `${Math.max(0.5, percentage)}%`,
                                backgroundColor: ethnicity.color,
                            }}
                            title={`${ethnicity.name}: ${percentage.toFixed(1)}%`}
                        />
                    );
                })}
            </div>
        </div>
    );
};
