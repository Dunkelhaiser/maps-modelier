import { useDeleteEthnicity } from "@ipc/ethnicities";
import { Button } from "@ui/Button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@ui/Dialog";
import { Trash } from "lucide-react";

interface Props {
    mapId: string;
    id: number;
}

const DeleteEthnicityDialog = ({ mapId, id }: Props) => {
    const deleteEthnicity = useDeleteEthnicity(mapId, id);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size="icon" variant="ghost" className="size-6" aria-label="Delete">
                    <Trash className="!size-3.5" />
                </Button>
            </DialogTrigger>
            <DialogContent aria-describedby={undefined}>
                <DialogHeader>
                    <DialogTitle>Delete Ethnicity</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this ethnicity? It and all its population across provinces will
                        be deleted. This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end gap-2">
                    <DialogClose asChild>
                        <Button type="button" variant="ghost">
                            Cancel
                        </Button>
                    </DialogClose>

                    <Button
                        type="button"
                        variant="destructive"
                        onClick={() => deleteEthnicity.mutateAsync()}
                        isLoading={deleteEthnicity.isPending}
                    >
                        <Trash />
                        Delete
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
export default DeleteEthnicityDialog;
