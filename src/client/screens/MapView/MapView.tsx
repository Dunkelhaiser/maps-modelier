import { MapCanvas } from "@screens/MapView/components/Map/Map";
import UserInterface from "@screens/MapView/components/UserInterface/UserInterface";
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
