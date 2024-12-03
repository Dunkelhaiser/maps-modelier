import { Button } from "@ui/Button";
import { LogOut } from "lucide-react";
import { useMapStore } from "@/store/store";

const CloseMapBtn = () => {
    const closeMap = useMapStore((state) => state.closeMap);

    return (
        <Button aria-label="Close Map" onClick={closeMap} variant="ghost" size="icon">
            <LogOut className="rotate-180" />
        </Button>
    );
};
export default CloseMapBtn;
