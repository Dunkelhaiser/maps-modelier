import { useSidebarStore } from "@store/sidebar";
import { Card } from "@ui/Card";
import Countries from "./Countries/Countries";
import Ethnicities from "./Ethnicities/Ethnicities";

const Sidebar = () => {
    const screen = useSidebarStore((state) => state.screen);

    return (
        screen && (
            <Card className="absolute bottom-3 left-3 top-[calc(45.6px_+_0.75rem)] w-[28rem]">
                {screen === "ethnicities" && <Ethnicities />}
                {screen === "countries" && <Countries />}
            </Card>
        )
    );
};
export default Sidebar;
