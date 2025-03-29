import { useDeleteParty } from "@ipc/parties";
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

const DeletePartyDialog = ({ mapId, id }: Props) => {
    const deleteParty = useDeleteParty(mapId, id);
    const selectCountry = useMapStore((state) => state.selectCountry);
    const selectedCountry = useMapStore((state) => state.selectedCountry);

    const deletePartyHandler = async () => {
        await deleteParty.mutateAsync();
        selectCountry(selectedCountry);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="destructive" aria-label="Delete Party">
                    <Trash />
                </Button>
            </DialogTrigger>
            <DialogContent aria-describedby={undefined}>
                <DialogHeader>
                    <DialogTitle>Delete Party</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this party? This action cannot be undone.
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
                        onClick={deletePartyHandler}
                        isLoading={deleteParty.isPending}
                    >
                        <Trash />
                        Delete
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
export default DeletePartyDialog;
