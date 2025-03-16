import { toast } from "sonner";

export const errorToast = async (err: unknown) => {
    if (err instanceof Error) {
        if (err.message.startsWith("Error invoking remote method 'ipc': Error: ")) {
            toast.error(err.message.split("Error invoking remote method 'ipc': Error: ")[1]);
            return;
        }
        toast.error(err.message);
        return;
    }
    toast.error("Failed to perform the operation");
};
