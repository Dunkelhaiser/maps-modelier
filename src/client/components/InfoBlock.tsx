import { cn } from "@utils/utils";
import { LucideIcon } from "lucide-react";

interface Props {
    Icon: LucideIcon;
    label: string;
    color?: string;
    value?: string | number;
    children?: React.ReactNode;
}

const InfoBlock = ({ Icon, label, color, value, children }: Props) => {
    return (
        <div className="flex items-center gap-3 rounded-md bg-muted p-3 shadow-sm">
            <div className="rounded-full bg-muted-foreground/10 p-2">
                <Icon size={16} className={cn("text-muted-foreground", color)} />
            </div>
            <div>
                <p className="text-xs text-muted-foreground">{label}</p>
                {value && <p className="font-medium">{value}</p>}
                {children}
            </div>
        </div>
    );
};
export default InfoBlock;
