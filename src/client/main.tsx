import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { errorToast } from "@utils/errorToast.ts";
import { createRoot } from "react-dom/client";
import { ElectronAPI } from "src/shared/types.ts";
import App from "./App.tsx";
import "./index.css";

declare global {
    interface Window {
        electron: ElectronAPI;
    }
}

export const queryClient = new QueryClient({
    defaultOptions: {
        mutations: {
            onError: errorToast,
        },
        queries: {
            refetchOnReconnect: false,
            refetchOnWindowFocus: false,
        },
    },
});

createRoot(document.getElementById("root")!).render(
    <QueryClientProvider client={queryClient}>
        <App />
    </QueryClientProvider>
);
