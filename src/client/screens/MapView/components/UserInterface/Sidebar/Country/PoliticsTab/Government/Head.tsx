import InfoBlock from "@components/InfoBlock";
import { formatDate } from "@utils/utils";
import { Calendar } from "lucide-react";
import { Head as HeadType } from "src/shared/types";
import Politician from "../Politicians/Politician";

interface Props {
    head: Omit<HeadType, "startDate"> & { startDate: Date | null };
}

const Head = ({ head }: Props) => {
    return (
        <div className="flex flex-col gap-4">
            <h3 className="text-lg font-medium">{head.title}</h3>
            <Politician politician={head} />
            {head.startDate && (
                <div className="flex flex-col gap-2">
                    <InfoBlock Icon={Calendar} label="Since" value={formatDate(head.startDate)} />
                    {head.endDate && <InfoBlock Icon={Calendar} label="Until" value={formatDate(head.endDate)} />}
                </div>
            )}
        </div>
    );
};
export default Head;
