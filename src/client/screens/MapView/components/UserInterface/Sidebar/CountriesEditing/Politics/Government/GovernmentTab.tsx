import { useActiveMap } from "@hooks/useActiveMap";
import { useGetParliament } from "@ipc/government";
import { useMapStore } from "@store/store";
import CreateParliamentForm from "./CreateParliamentForm";
import EditParliamentForm from "./EditParliamentForm";
import HeadOfGovernmentForm from "./HeadOfGovernmentForm";
import HeadOfStateForm from "./HeadOfStateForm";

const GovernmentTab = () => {
    const activeMap = useActiveMap();
    const selectedCountry = useMapStore((state) => state.selectedCountry)!;

    const { data: parliament } = useGetParliament(activeMap, selectedCountry);

    return (
        <section className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <HeadOfStateForm />
                <HeadOfGovernmentForm />
            </div>
            {parliament ? <EditParliamentForm parliament={parliament} /> : <CreateParliamentForm />}
        </section>
    );
};

export default GovernmentTab;
