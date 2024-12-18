import { useDeleteMap } from "@ipc/maps";
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
import { Map } from "@utils/types";
import { Trash } from "lucide-react";

interface Props {
    map: Map;
}

const DeleteMapDialog = ({ map }: Props) => {
    const deleteMap = useDeleteMap(map.id);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:bg-red-100/45 hover:text-destructive"
                >
                    <Trash />
                </Button>
            </DialogTrigger>
            <DialogContent aria-describedby={undefined}>
                <DialogHeader>
                    <DialogTitle>Delete Map</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this map? This action cannot be undone.
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
                        onClick={() => deleteMap.mutateAsync()}
                        isLoading={deleteMap.isPending}
                    >
                        <Trash />
                        Delete
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
export default DeleteMapDialog;
