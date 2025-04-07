import CardHeaderWithClose from "@components/CardHeaderWithClose";
import { useMapStore } from "@store/store";
import { CardContent, CardTitle } from "@ui/Card";
import CreatePartyForm from "./CreatePartyForm";
import EditPartyForm from "./EditPartyForm";

const PartyEditing = () => {
    const selectedParty = useMapStore((state) => state.selectedParty);

    return (
        <>
            <CardHeaderWithClose>
                <CardTitle className="text-xl">{selectedParty === -1 ? "Create Party" : "Edit Party"}</CardTitle>
            </CardHeaderWithClose>
            <CardContent className="flex h-[calc(100%_-_1rem_-_calc(45.6px_+_0.75rem))] flex-col gap-2 overflow-auto">
                {selectedParty === -1 ? <CreatePartyForm /> : <EditPartyForm />}
            </CardContent>
        </>
    );
};
export default PartyEditing;
