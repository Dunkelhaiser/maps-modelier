import { Toaster } from "@ui/Toast";
import FloatingWindows from "./FloatingWindows";
import Header from "./Header";

const UserInterface = () => {
    return (
        <>
            <Header />
            <FloatingWindows />
            <Toaster />
        </>
    );
};
export default UserInterface;
