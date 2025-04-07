import { Button } from "@ui/Button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@ui/DropdownMenu";
import { Settings } from "lucide-react";
import CloseMapBtn from "./CloseMapBtn";
import DisplayModeSelect from "./DisplayModeSelect";
import Menu from "./Menu";
import ModeSelect from "./ModeSelect";

const Header = () => {
    return (
        <header className="flex w-full items-center gap-4 border bg-card px-8 py-1 text-card-foreground shadow">
            <CloseMapBtn />
            <Menu />
            <DropdownMenu>
                <DropdownMenuTrigger className="ml-auto" asChild>
                    <Button variant="ghost" size="icon">
                        <Settings />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>Settings</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="space-y-2">
                        <ModeSelect />
                        <DisplayModeSelect />
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    );
};
export default Header;
