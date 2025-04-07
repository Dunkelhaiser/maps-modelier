import { useSidebarStore } from "@store/sidebar";
import { Button } from "@ui/Button";
import { CardHeader } from "@ui/Card";
import { X } from "lucide-react";

interface Props {
    children: React.ReactNode;
}

const CardHeaderWithClose = ({ children }: Props) => {
    const closeSidebar = useSidebarStore((state) => state.closeSidebar);

    return (
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
            {children}
            <Button variant="ghost" aria-label="Close" size="icon" onClick={closeSidebar} className="size-auto">
                <X />
            </Button>
        </CardHeader>
    );
};

export default CardHeaderWithClose;
