import { Button } from "@ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ui/Card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@ui/Dialog";
import FileUpload from "@ui/FileUpload";
import { Input } from "@ui/Input";
import { Label } from "@ui/Label";
import { Map } from "@utils/types";
import { PlusCircle, Map as MapIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useMapStore } from "@/store/store";

const MapSelection = () => {
    const setActiveMap = useMapStore((state) => state.setActiveMap);
    const [existingMaps, setExistingMaps] = useState<Map[]>([]);
    const [newMapName, setNewMapName] = useState("");
    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [isNewMapDialogOpen, setIsNewMapDialogOpen] = useState(false);
    const [selectedMapForUpload, setSelectedMapForUpload] = useState<Map | null>(null);

    useEffect(() => {
        const getMaps = async () => {
            const maps = await window.electronAPI.getMaps();
            setExistingMaps(maps);
        };
        getMaps();
    }, []);

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    setSelectedFile(event.target.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleNewMapSubmit = async () => {
        if (selectedFile && newMapName.trim()) {
            const newMap = await window.electronAPI.createMap(newMapName.trim(), selectedFile);
            if (newMap) {
                await window.electronAPI.saveMapImage(selectedFile, newMap.id);
                setActiveMap({ ...newMap, imageUrl: selectedFile });
                setIsNewMapDialogOpen(false);
                setNewMapName("");
                setSelectedFile(null);
            }
        }
    };

    const handleExistingMapSelect = async (map: Map) => {
        if (map.imgPath) {
            try {
                const imageUrl = await window.electronAPI.loadMapImage(map.imgPath);
                setActiveMap({ ...map, imageUrl });
            } catch (error) {
                // eslint-disable-next-line no-alert
                alert(`Failed to load map image: ${JSON.stringify(error)}`);
                setSelectedMapForUpload(map);
            }
        } else {
            setSelectedMapForUpload(map);
        }
    };

    const handleExistingMapImageUpload = async () => {
        if (selectedFile && selectedMapForUpload) {
            await window.electronAPI.saveMapImage(selectedFile, selectedMapForUpload.id);
            setActiveMap({ ...selectedMapForUpload, imageUrl: selectedFile });
            setSelectedMapForUpload(null);
            setSelectedFile(null);
        }
    };

    return (
        <Card className="w-full max-w-4xl">
            <CardHeader>
                <CardTitle>Map Selection</CardTitle>
                <CardDescription>Create a new map or select an existing one</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
                <Dialog open={isNewMapDialogOpen} onOpenChange={setIsNewMapDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="w-full" size="lg">
                            <PlusCircle className="mr-2 size-5" />
                            Create New Map
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New Map</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div>
                                <Label htmlFor="map-name">Map Name</Label>
                                <Input
                                    id="map-name"
                                    value={newMapName}
                                    onChange={(e) => setNewMapName(e.target.value)}
                                    placeholder="Enter map name"
                                />
                            </div>
                            <div>
                                <Label htmlFor="map-file">Province Map Image</Label>
                                <FileUpload id="map-file" type="file" accept="image/*" onChange={handleFileInput} />
                            </div>
                            <Button onClick={handleNewMapSubmit} disabled={!selectedFile || !newMapName.trim()}>
                                Create Map
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>

                <Dialog
                    open={selectedMapForUpload !== null}
                    onOpenChange={(open) => !open && setSelectedMapForUpload(null)}
                >
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Upload Map Image for {selectedMapForUpload?.name}</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div>
                                <Label htmlFor="existing-map-file">Province Map Image</Label>
                                <FileUpload id="map-file" type="file" accept="image/*" onChange={handleFileInput} />
                            </div>
                            <Button onClick={handleExistingMapImageUpload} disabled={!selectedFile}>
                                Load Map
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>

                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Existing Maps</h3>
                    {existingMaps.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No maps created yet</p>
                    ) : (
                        existingMaps.map((map) => (
                            <Button
                                key={map.id}
                                variant="outline"
                                className="h-auto w-full justify-start"
                                onClick={() => handleExistingMapSelect(map)}
                            >
                                <MapIcon className="mr-2 size-5" />
                                <div className="flex flex-col items-start">
                                    <span>{map.name}</span>
                                    <span className="text-xs text-muted-foreground">
                                        Created: {new Date(map.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </Button>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default MapSelection;
