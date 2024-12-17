import { toast } from "sonner";

export const errorToast = async (err: unknown) => {
    if (err instanceof Error) {
        toast.error(err.message);
        return;
    }
    toast.error("Failed to perform the operation");
};
