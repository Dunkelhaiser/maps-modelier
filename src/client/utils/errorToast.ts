import { toast } from "sonner";

export const errorToast = async (err: unknown) => {
    if (err instanceof Error) {
        const ipcErrorMsg = "Error invoking remote method 'ipc': Error: ";
        if (err.message.startsWith(ipcErrorMsg)) {
            toast.error(err.message.split(ipcErrorMsg)[1]);
            return;
        }

        const ipcErrorMsg2 = "Error invoking remote method 'ipc': ";
        if (err.message.startsWith(ipcErrorMsg2)) {
            toast.error(err.message.split(ipcErrorMsg2)[1]);
            return;
        }

        toast.error(err.message);
        return;
    }

    toast.error("Failed to perform the operation");
};
