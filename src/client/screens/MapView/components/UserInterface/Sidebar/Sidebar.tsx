import { useSidebarStore } from "@store/sidebar";
import { Card } from "@ui/Card";
import Ethnicities from "./Ethnicities/Ethnicities";

const Sidebar = () => {
    const screen = useSidebarStore((state) => state.screen);

    return (
        screen && (
            <Card className="absolute bottom-3 left-3 top-[calc(45.6px_+_0.75rem)] w-96">
                {screen === "ethnicities" && <Ethnicities />}
            </Card>
        )
    );
};
export default Sidebar;
