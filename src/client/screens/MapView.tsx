import { MapCanvas } from "@components/Map";
import UserInterface from "@components/UserInterface/UserInterface";
import { ActiveMap } from "@utils/types";

interface Props {
    activeMap: ActiveMap;
}

const MapView = ({ activeMap }: Props) => {
    return (
        <>
            <UserInterface />
            <MapCanvas activeMap={activeMap} />
        </>
    );
};
export default MapView;
