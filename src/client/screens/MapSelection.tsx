import CreateMapDialog from "@components/Dialogs/CreateMapDialog";
import MapButton from "@components/MapButton";
import { Button } from "@ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ui/Card";
import { ScrollArea } from "@ui/ScrollArea";
import { useGetMaps } from "@/ipc/maps";

const MapSelection = () => {
    const { data, isError, isFetching, refetch } = useGetMaps();

    return (
        <Card className="w-full max-w-4xl">
            <CardHeader>
                <CardTitle>Map Selection</CardTitle>
                <CardDescription>Create a new map or select an existing one</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
                <CreateMapDialog />

                <div className="space-y-2">
                    <h3 className="text-lg font-medium">Existing Maps</h3>
                    {isFetching && <p className="text-sm text-muted-foreground">Loading maps...</p>}
                    {isError && (
                        <>
                            <p className="text-sm font-medium text-red-600">Failed to load maps</p>
                            <Button variant="outline" onClick={() => refetch()}>
                                Retry
                            </Button>
                        </>
                    )}
                    {data?.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No maps created yet</p>
                    ) : (
                        <ScrollArea className="h-[50vh]">
                            <div className="space-y-4 px-4 py-2">
                                {data?.map((map) => <MapButton map={map} key={map.id} />)}
                            </div>
                        </ScrollArea>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default MapSelection;
