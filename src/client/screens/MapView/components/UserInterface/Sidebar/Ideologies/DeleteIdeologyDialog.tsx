import { useDeleteIdeology } from "@ipc/ideologies";
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

const DeleteIdeologyDialog = ({ mapId, id }: Props) => {
    const deleteIdeology = useDeleteIdeology(mapId, id);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size="icon" variant="ghost" className="size-6" aria-label="Delete">
                    <Trash className="!size-3.5" />
                </Button>
            </DialogTrigger>
            <DialogContent aria-describedby={undefined}>
                <DialogHeader>
                    <DialogTitle>Delete Ideology</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this ideology? This action cannot be undone.
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
                        onClick={() => deleteIdeology.mutateAsync()}
                        isLoading={deleteIdeology.isPending}
                    >
                        <Trash />
                        Delete
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
export default DeleteIdeologyDialog;
