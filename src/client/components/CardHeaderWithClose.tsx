import { Button } from "@ui/Button";
import { CardHeader } from "@ui/Card";
import { X } from "lucide-react";

interface Props {
    children: React.ReactNode;
    onClick: () => void;
}

const CardHeaderWithClose = ({ children, onClick }: Props) => (
    <CardHeader className="flex flex-row items-center justify-between space-y-0">
        {children}
        <Button variant="ghost" aria-label="Close" size="icon" onClick={onClick} className="size-auto">
            <X />
        </Button>
    </CardHeader>
);

export default CardHeaderWithClose;
