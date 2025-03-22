import { useDeleteCountry } from "@ipc/countries";
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

const DeleteCountryDialog = ({ mapId, id }: Props) => {
    const deleteCountry = useDeleteCountry(mapId, id);
    const selectCountry = useMapStore((state) => state.selectCountry);

    const deleteCountryHandler = async () => {
        await deleteCountry.mutateAsync();
        selectCountry(null);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="destructive" aria-label="Delete Country">
                    <Trash />
                </Button>
            </DialogTrigger>
            <DialogContent aria-describedby={undefined}>
                <DialogHeader>
                    <DialogTitle>Delete Country</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this country? This action cannot be undone.
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
                        onClick={deleteCountryHandler}
                        isLoading={deleteCountry.isPending}
                    >
                        <Trash />
                        Delete
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
export default DeleteCountryDialog;
