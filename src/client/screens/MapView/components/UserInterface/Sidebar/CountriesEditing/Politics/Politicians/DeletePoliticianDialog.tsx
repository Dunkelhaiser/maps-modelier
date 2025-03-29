import { useDeletePolitician } from "@ipc/politicians";
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

const DeletePoliticianDialog = ({ mapId, id }: Props) => {
    const deletePolitician = useDeletePolitician(mapId, id);

    const deletePoliticianHandler = async () => {
        await deletePolitician.mutateAsync();
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="destructive" aria-label="Delete Politician">
                    <Trash />
                </Button>
            </DialogTrigger>
            <DialogContent aria-describedby={undefined}>
                <DialogHeader>
                    <DialogTitle>Delete Politician</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this politician? This action cannot be undone.
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
                        onClick={deletePoliticianHandler}
                        isLoading={deletePolitician.isPending}
                    >
                        <Trash />
                        Delete
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
export default DeletePoliticianDialog;
