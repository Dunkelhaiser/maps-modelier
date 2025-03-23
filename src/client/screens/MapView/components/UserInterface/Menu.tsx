import { useSidebarStore } from "@store/sidebar";
import { ToggleGroup, ToggleGroupItem } from "@ui/ToggleGroup";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@ui/Tooltip";
import { Handshake, Map, Swords, UsersRound } from "lucide-react";

const Menu = () => {
    const openSidebar = useSidebarStore((state) => state.openSidebar);
    const activeSidebar = useSidebarStore((state) => state.activeSidebar);

    return (
        /* @ts-expect-error no value type inference */
        <ToggleGroup type="single" onValueChange={openSidebar} value={activeSidebar}>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <ToggleGroupItem value="countries" aria-label="Countries">
                            <Map />
                        </ToggleGroupItem>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Countries</p>
                    </TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <ToggleGroupItem value="ethnicities" aria-label="Ethnicities">
                            <UsersRound />
                        </ToggleGroupItem>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Ethnicities</p>
                    </TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <ToggleGroupItem value="alliances" aria-label="Alliances">
                            <Handshake />
                        </ToggleGroupItem>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Alliances</p>
                    </TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <ToggleGroupItem value="wars" aria-label="Wars">
                            <Swords />
                        </ToggleGroupItem>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Wars</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </ToggleGroup>
    );
};
export default Menu;
