import { useSidebarStore } from "@store/sidebar";
import { ToggleGroup, ToggleGroupItem } from "@ui/ToggleGroup";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@ui/Tooltip";
import { Map, UsersRound } from "lucide-react";

const Menu = () => {
    const setScreen = useSidebarStore((state) => state.setScreen);

    return (
        /* @ts-expect-error no value type inference */
        <ToggleGroup type="single" onValueChange={setScreen}>
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
            </TooltipProvider>
        </ToggleGroup>
    );
};
export default Menu;
