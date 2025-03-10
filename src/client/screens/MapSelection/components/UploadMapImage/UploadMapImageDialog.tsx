import UploadMapImageForm from "@screens/MapSelection/components/UploadMapImage/UploadMapImageForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@ui/Dialog";
import { Map } from "src/shared/types";

interface Props {
    selectedMapForUpload: Map | null;
    setSelectedMapForUpload: (map: Map | null) => void;
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
