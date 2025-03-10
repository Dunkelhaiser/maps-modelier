import RenameMapForm from "@screens/MapSelection/components/RenameMap/RenameMapForm";
import { Button } from "@ui/Button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@ui/Dialog";
import { Edit } from "lucide-react";
import { useState } from "react";
import { Map } from "src/shared/types";

interface Props {
    map: Map;
}

const RenameMapDialog = ({ map }: Props) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-white/75" aria-label="Rename map">
                    <Edit />
                </Button>
            </DialogTrigger>
            <DialogContent aria-describedby={undefined}>
                <DialogHeader>
                    <DialogTitle>Rename Map</DialogTitle>
                </DialogHeader>
                <RenameMapForm map={map} closeDialog={() => setIsOpen(false)} />
            </DialogContent>
        </Dialog>
    );
};
export default RenameMapDialog;
