import { useActiveMap } from "@hooks/useActiveMap";
import { useGetPoliticians } from "@ipc/politicians";
import { useMapStore } from "@store/store";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import CreatePoliticianForm from "./CreatePoliticianForm";
import EditPoliticianForm from "./EditPoliticianForm";

const EditPoliticiansForm = () => {
    const [isCreating, setIsCreating] = useState(false);

    const activeMap = useActiveMap();
    const selectedCountry = useMapStore((state) => state.selectedCountry)!;
    const { data: politicians } = useGetPoliticians(activeMap, selectedCountry);

    return (
        <section className="grid grid-cols-2 gap-4">
            {isCreating ? (
                <CreatePoliticianForm stopCreating={() => setIsCreating(false)} />
            ) : (
                <button
                    className="flex w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-background pb-6 pt-5 transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 dark:border-muted-foreground/25"
                    aria-label="Add"
                    type="button"
                    onClick={() => setIsCreating(true)}
                >
                    <PlusIcon className="size-8 text-muted-foreground" />
                    <p className="text-sm font-semibold text-muted-foreground">Add politician</p>
                </button>
            )}

            {politicians?.map((politician) => <EditPoliticianForm politician={politician} key={politician.id} />)}
        </section>
    );
};
export default EditPoliticiansForm;
