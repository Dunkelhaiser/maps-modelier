import { useDeleteWar } from "@ipc/wars";
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

const DeleteWarDialog = ({ mapId, id }: Props) => {
    const deleteWar = useDeleteWar(mapId, id);
    const selectWar = useMapStore((state) => state.selectWar);

    const deleteWarHandler = async () => {
        await deleteWar.mutateAsync();
        selectWar(null);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="destructive" aria-label="Delete War">
                    <Trash />
                </Button>
            </DialogTrigger>
            <DialogContent aria-describedby={undefined}>
                <DialogHeader>
                    <DialogTitle>Delete War</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this war? This action cannot be undone.
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
                        onClick={deleteWarHandler}
                        isLoading={deleteWar.isPending}
                    >
                        <Trash />
                        Delete
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
export default DeleteWarDialog;
