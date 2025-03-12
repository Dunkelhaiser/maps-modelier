import UploadMapImageForm from "@screens/MapSelection/components/UploadMapImage/UploadMapImageForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@ui/Dialog";
import { MapType } from "src/shared/types";

interface Props {
    selectedMapForUpload: MapType | null;
    setSelectedMapForUpload: (map: MapType | null) => void;
}

const UploadMapImageDialog = ({ selectedMapForUpload, setSelectedMapForUpload }: Props) => {
    return (
        <Dialog open={selectedMapForUpload !== null} onOpenChange={(open) => !open && setSelectedMapForUpload(null)}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Upload Map Image for {selectedMapForUpload?.name}</DialogTitle>
                </DialogHeader>
                <UploadMapImageForm selectedMapForUpload={selectedMapForUpload} />
            </DialogContent>
        </Dialog>
    );
};
export default UploadMapImageDialog;
