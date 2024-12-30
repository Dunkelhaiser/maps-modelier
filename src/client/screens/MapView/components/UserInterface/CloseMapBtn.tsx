import { useMapSotre } from "@store/store";
import { Button } from "@ui/Button";
import { LogOut } from "lucide-react";

const CloseMapBtn = () => {
    const closeMap = useMapSotre((state) => state.closeMap);

    return (
        <Button aria-label="Close Map" onClick={closeMap} variant="ghost" size="icon">
            <LogOut className="rotate-180" />
        </Button>
    );
};
export default CloseMapBtn;
