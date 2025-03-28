import { TabsContent } from "@ui/Tabs";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import CreatePoliticianForm from "./CreatePoliticianForm";

const EditPoliticsForm = () => {
    const [isCreating, setIsCreating] = useState(false);

    return (
        <TabsContent value="politics" className="grid grid-cols-2 gap-4">
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
        </TabsContent>
    );
};
export default EditPoliticsForm;
