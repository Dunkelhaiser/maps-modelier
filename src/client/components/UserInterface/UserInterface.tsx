import { Toaster } from "@ui/Toast";
import Header from "./Header";
import ProvinceWindow from "./ProvinceWindow";
import StateWindow from "./StateWindow";
import { useMapStore } from "@/store/store";

const UserInterface = () => {
    const mode = useMapStore((state) => state.mode);

    return (
        <>
            <Header />
            <div className="absolute bottom-3 left-3 flex flex-col gap-4">
                {mode === "provinces_editing" && <ProvinceWindow />}
                {mode === "states_editing" && <StateWindow />}
            </div>
            <Toaster />
        </>
    );
};
export default UserInterface;
