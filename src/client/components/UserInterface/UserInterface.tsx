import Header from "./Header";
import ProvinceWindow from "./ProvinceWindow";
import StateWindow from "./StateWindow";

const UserInterface = () => {
    return (
        <>
            <Header />
            <div className="absolute bottom-3 left-3 flex flex-col gap-4">
                <ProvinceWindow />
                <StateWindow />
            </div>
        </>
    );
};
export default UserInterface;
