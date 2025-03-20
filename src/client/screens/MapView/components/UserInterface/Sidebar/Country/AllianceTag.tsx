import { useMapStore } from "@store/store";
import { CountryAlliance } from "src/shared/types";

interface Props {
    alliance: CountryAlliance;
}

export const AllianceTag = ({ alliance }: Props) => {
    const selectAlliance = useMapStore((state) => state.selectAlliance).bind(null, alliance.id);

    return (
        <button
            type="button"
            className="flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-sm text-muted-foreground"
            onClick={selectAlliance}
        >
            <span>{alliance.name}</span>
            <span className="rounded-full bg-muted-foreground/15 px-1.5 py-0.5 text-xs font-medium">
                {alliance.type}
            </span>
        </button>
    );
};
