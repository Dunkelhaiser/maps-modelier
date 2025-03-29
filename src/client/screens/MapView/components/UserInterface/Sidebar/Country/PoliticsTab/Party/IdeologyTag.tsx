import { Ideology } from "src/shared/types";

interface Props {
    ideology: Ideology;
}

const IdeologyTag = ({ ideology }: Props) => {
    return (
        <div
            className="flex items-center gap-1 rounded-md px-2 py-1"
            style={{ backgroundColor: `${ideology.color}20` }}
        >
            <div className="size-1.5 rounded-full" style={{ backgroundColor: ideology.color }} />
            <span className="text-sm" style={{ color: ideology.color }}>
                {ideology.name}
            </span>
        </div>
    );
};
export default IdeologyTag;
