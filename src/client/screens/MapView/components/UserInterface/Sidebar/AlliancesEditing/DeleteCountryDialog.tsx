import { useDeleteAlliance } from "@ipc/alliances";
import { useMapStore } from "@store/store";
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

const DeleteAllianceDialog = ({ mapId, id }: Props) => {
    const deleteAlliance = useDeleteAlliance(mapId, id);
    const selectAlliance = useMapStore((state) => state.selectAlliance);

    const deleteAllianceHandler = async () => {
        await deleteAlliance.mutateAsync();
        selectAlliance(null);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="destructive" aria-label="Delete Alliance">
                    <Trash />
                </Button>
            </DialogTrigger>
            <DialogContent aria-describedby={undefined}>
                <DialogHeader>
                    <DialogTitle>Delete Alliance</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this alliance? This action cannot be undone.
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
                        onClick={deleteAllianceHandler}
                        isLoading={deleteAlliance.isPending}
                    >
                        <Trash />
                        Delete
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
export default DeleteAllianceDialog;
