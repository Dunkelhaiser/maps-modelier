import { Province } from "@utils/types";
import { useState, useRef, useEffect } from "react";
import { useMapStore } from "@/store/store";

interface MapState {
    image: HTMLImageElement | null;
    scale: number;
    offsetX: number;
    offsetY: number;
    isDragging: boolean;
    lastMouseX: number;
    lastMouseY: number;
    selectedProvinceId: number | null;
}

interface Props {
    imageUrl: string | null;
}

const rgbToHex = (r: number, g: number, b: number) => {
    return `#${[r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")}`;
};

export const MapCanvas = ({ imageUrl }: Props) => {
    const activeMap = useMapStore((state) => state.activeMap);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [mapState, setMapState] = useState<MapState>({
        image: null,
        scale: 1,
        offsetX: 0,
        offsetY: 0,
        isDragging: false,
        lastMouseX: 0,
        lastMouseY: 0,
        selectedProvinceId: null,
    });

    useEffect(() => {
        const getProvinces = async () => {
            if (!activeMap) return;
            const provincesArr = await window.electronAPI.getAllProvinces(activeMap.id);
            setProvinces(provincesArr);
        };
        getProvinces();
    }, [activeMap]);

    const calculateInitialScale = (canvas: HTMLCanvasElement, image: HTMLImageElement) => {
        const widthRatio = canvas.width / image.width;
        const heightRatio = canvas.height / image.height;
        return Math.max(widthRatio, heightRatio);
    };

    const calculateInitialOffset = (canvas: HTMLCanvasElement, image: HTMLImageElement, scale: number) => {
        const scaledImageWidth = image.width * scale;
        const scaledImageHeight = image.height * scale;

        const offsetX = (canvas.width - scaledImageWidth) / 2;
        const offsetY = (canvas.height - scaledImageHeight) / 2;

        return { offsetX, offsetY };
    };

    useEffect(() => {
        if (!imageUrl) return;

        const image = new Image();
        image.src = imageUrl;
        image.onload = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;

            const initialScale = calculateInitialScale(canvas, image);
            const { offsetX, offsetY } = calculateInitialOffset(canvas, image, initialScale);

            setMapState((prev) => ({
                ...prev,
                image,
                scale: initialScale,
                offsetX,
                offsetY,
            }));
        };
    }, [imageUrl]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !mapState.image) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        ctx.imageSmoothingEnabled = false;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.save();
        ctx.translate(mapState.offsetX, mapState.offsetY);
        ctx.scale(mapState.scale, mapState.scale);

        ctx.drawImage(mapState.image, 0, 0);

        ctx.restore();
    }, [mapState]);

    const handleMouseDown = (e: React.MouseEvent) => {
        setMapState((prev) => ({
            ...prev,
            isDragging: true,
            lastMouseX: e.clientX,
            lastMouseY: e.clientY,
        }));
    };

    const handleMapDrag = (e: React.MouseEvent) => {
        if (!mapState.isDragging) return;

        const canvas = canvasRef.current;
        const { image } = mapState;
        if (!canvas || !image) return;

        const dx = e.clientX - mapState.lastMouseX;
        const dy = e.clientY - mapState.lastMouseY;

        const newOffsetX = mapState.offsetX + dx;
        const newOffsetY = mapState.offsetY + dy;

        const scaledImageWidth = image.width * mapState.scale;
        const scaledImageHeight = image.height * mapState.scale;

        const minOffsetX = Math.min(0, canvas.width - scaledImageWidth);
        const minOffsetY = Math.min(0, canvas.height - scaledImageHeight);
        const maxOffsetX = Math.max(0, canvas.width - scaledImageWidth);
        const maxOffsetY = Math.max(0, canvas.height - scaledImageHeight);

        const clampedOffsetX = Math.min(maxOffsetX, Math.max(minOffsetX, newOffsetX));
        const clampedOffsetY = Math.min(maxOffsetY, Math.max(minOffsetY, newOffsetY));

        setMapState((prev) => ({
            ...prev,
            offsetX: clampedOffsetX,
            offsetY: clampedOffsetY,
            lastMouseX: e.clientX,
            lastMouseY: e.clientY,
        }));
    };

    const handleMouseUp = () => {
        setMapState((prev) => ({ ...prev, isDragging: false }));
    };

    const handleZoom = (e: React.WheelEvent) => {
        const MAX_ZOOM = 10;

        const canvas = canvasRef.current;
        const { image } = mapState;
        if (!canvas || !image) return;

        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const scaleFactor = e.deltaY > 0 ? 0.9 : 1.1;
        const newScale = mapState.scale * scaleFactor;

        const minScale = Math.max(canvas.width / image.width, canvas.height / image.height);

        const clampedScale = Math.min(MAX_ZOOM, Math.max(minScale, newScale));

        const scaleRatio = clampedScale / mapState.scale;

        const newOffsetX = mouseX - scaleRatio * (mouseX - mapState.offsetX);
        const newOffsetY = mouseY - scaleRatio * (mouseY - mapState.offsetY);

        const scaledImageWidth = image.width * clampedScale;
        const scaledImageHeight = image.height * clampedScale;

        const minOffsetX = Math.min(0, canvas.width - scaledImageWidth);
        const minOffsetY = Math.min(0, canvas.height - scaledImageHeight);
        const maxOffsetX = Math.max(0, canvas.width - scaledImageWidth);
        const maxOffsetY = Math.max(0, canvas.height - scaledImageHeight);

        const clampedOffsetX = Math.min(maxOffsetX, Math.max(minOffsetX, newOffsetX));
        const clampedOffsetY = Math.min(maxOffsetY, Math.max(minOffsetY, newOffsetY));

        setMapState((prev) => ({
            ...prev,
            scale: clampedScale,
            offsetX: clampedOffsetX,
            offsetY: clampedOffsetY,
        }));
    };

    const handleProvinceClick = async (e: React.MouseEvent) => {
        if (mapState.isDragging) return;

        const canvas = canvasRef.current;
        const { image } = mapState;
        if (!canvas || !image) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const imageData = canvas.getContext("2d")?.getImageData(x, y, 1, 1).data;
        if (!imageData) return;

        const [r, g, b] = imageData;

        const colorHash = rgbToHex(r, g, b);
        if (!activeMap) return;
        const province = await window.electronAPI.getProvinceByColor(activeMap.id, colorHash);

        if (province) {
            setMapState((prev) => ({ ...prev, selectedProvinceId: province.id }));
            // eslint-disable-next-line no-console
            console.log(province.id);
        }
    };

    return (
        <canvas
            ref={canvasRef}
            className="size-full"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMapDrag}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleZoom}
            onClick={handleProvinceClick}
        />
    );
};
