import { Province } from "src/shared/types";

let minPopulation: number | null = null;
let maxPopulation: number | null = null;

export const updatePopulationRange = (provinces: Province[]): void => {
    if (provinces.length === 0) return;

    minPopulation = Math.min(...provinces.map((p) => p.population));
    maxPopulation = Math.max(...provinces.map((p) => p.population));
};

export const getPopulationColor = (population: number): string => {
    if (minPopulation === null || maxPopulation === null || minPopulation === maxPopulation) {
        return "#39654a";
    }

    const minColor = [65, 105, 225];
    // const midColor = [144, 238, 144];
    const maxColor = [220, 20, 60];

    const normalized = Math.max(0, Math.min(1, (population - minPopulation) / (maxPopulation - minPopulation)));

    let resultColor;

    if (normalized <= 0.5) {
        const factor = normalized * 2;
        resultColor = [
            // Math.round(minColor[0] + factor * (midColor[0] - minColor[0])),
            // Math.round(minColor[1] + factor * (midColor[1] - minColor[1])),
            // Math.round(minColor[2] + factor * (midColor[2] - minColor[2])),

            Math.round(minColor[0] + factor * (maxColor[0] - minColor[0])),
            Math.round(minColor[1] + factor * (maxColor[1] - minColor[1])),
            Math.round(minColor[2] + factor * (maxColor[2] - minColor[2])),
        ];
    } else {
        const factor = (normalized - 0.5) * 2;
        resultColor = [
            // Math.round(midColor[0] + factor * (maxColor[0] - midColor[0])),
            // Math.round(midColor[1] + factor * (maxColor[1] - midColor[1])),
            // Math.round(midColor[2] + factor * (maxColor[2] - midColor[2])),

            Math.round(minColor[0] + factor * (maxColor[0] - minColor[0])),
            Math.round(minColor[1] + factor * (maxColor[1] - minColor[1])),
            Math.round(minColor[2] + factor * (maxColor[2] - minColor[2])),
        ];
    }

    return `#${resultColor[0].toString(16).padStart(2, "0")}${resultColor[1].toString(16).padStart(2, "0")}${resultColor[2].toString(16).padStart(2, "0")}`;
};
