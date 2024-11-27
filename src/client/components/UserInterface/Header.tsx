import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@ui/DropdownMenu";
import { Settings } from "lucide-react";
import ModeSelect from "./ModeSelect";

const Header = () => {
    return (
        <header className="flex w-full items-center border bg-card px-8 py-2 text-card-foreground shadow">
            <DropdownMenu>
                <DropdownMenuTrigger className="ml-auto">
                    <Settings />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>Settings</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <ModeSelect />
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    );
};
export default Header;
