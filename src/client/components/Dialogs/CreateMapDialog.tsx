import CreateMapForm from "@components/Forms/CreateMap/CreateMapForm";
import { Button } from "@ui/Button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@ui/Dialog";
import { PlusCircle } from "lucide-react";

const CreateMapDialog = () => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="w-full" size="lg">
                    <PlusCircle className="mr-2 size-5" />
                    Create New Map
                </Button>
            </DialogTrigger>
            <DialogContent aria-describedby={undefined}>
                <DialogHeader>
                    <DialogTitle>Create New Map</DialogTitle>
                </DialogHeader>
                <CreateMapForm />
            </DialogContent>
        </Dialog>
    );
};
export default CreateMapDialog;
