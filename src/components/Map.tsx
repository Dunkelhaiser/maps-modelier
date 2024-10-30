import { useState, useRef, useEffect } from "react";

interface MapState {
    image: HTMLImageElement | null;
    scale: number;
    offsetX: number;
    offsetY: number;
    isDragging: boolean;
    lastMouseX: number;
    lastMouseY: number;
    provinceIds: Map<string, string>;
    selectedProvinceId: string | null;
}

interface Props {
    imageUrl: string | null;
}

const hashColor = (r: number, g: number, b: number): string => {
    return `${r.toString(16)}${g.toString(16)}${b.toString(16)}`;
};

export const MapCanvas = ({ imageUrl }: Props) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [mapState, setMapState] = useState<MapState>({
        image: null,
        scale: 1,
        offsetX: 0,
        offsetY: 0,
        isDragging: false,
        lastMouseX: 0,
        lastMouseY: 0,
        provinceIds: new Map(),
        selectedProvinceId: null,
    });

    useEffect(() => {
        if (!imageUrl) return;

        const image = new Image();
        image.src = imageUrl;
        image.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = image.width;
            canvas.height = image.height;
            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            ctx.drawImage(image, 0, 0);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

            const provinceIds = new Map<string, string>();
            for (let i = 0; i < imageData.length; i += 4) {
                const r = imageData[i];
                const g = imageData[i + 1];
                const b = imageData[i + 2];
                const colorHash = hashColor(r, g, b);
                const pixelIndex = i / 4;
                const x = pixelIndex % canvas.width;
                const y = Math.floor(pixelIndex / canvas.width);
                const provinceId = `province-${colorHash}-${x}-${y}`;
                provinceIds.set(colorHash, provinceId);
            }

            canvas.remove();

            setMapState((prev) => ({ ...prev, image, provinceIds }));
        };
    }, [imageUrl]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !mapState.image) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

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

        const maxOffsetX = Math.max(0, (canvas.width - scaledImageWidth) / 2);
        const maxOffsetY = Math.max(0, (canvas.height - scaledImageHeight) / 2);

        const minOffsetX = Math.min(0, canvas.width - scaledImageWidth);
        const minOffsetY = Math.min(0, canvas.height - scaledImageHeight);

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

        const maxOffsetX = Math.max(0, (canvas.width - scaledImageWidth) / 2);
        const maxOffsetY = Math.max(0, (canvas.height - scaledImageHeight) / 2);

        const minOffsetX = Math.min(0, canvas.width - scaledImageWidth);
        const minOffsetY = Math.min(0, canvas.height - scaledImageHeight);

        const clampedOffsetX = Math.min(maxOffsetX, Math.max(minOffsetX, newOffsetX));
        const clampedOffsetY = Math.min(maxOffsetY, Math.max(minOffsetY, newOffsetY));

        setMapState((prev) => ({
            ...prev,
            scale: clampedScale,
            offsetX: clampedOffsetX,
            offsetY: clampedOffsetY,
        }));
    };

    const handleProvinceClick = (e: React.MouseEvent) => {
        if (mapState.isDragging) return;

        const canvas = canvasRef.current;
        const { image, provinceIds } = mapState;
        if (!canvas || !image) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const imageData = canvas.getContext("2d")?.getImageData(x, y, 1, 1).data;
        if (!imageData) return;

        const [r, g, b] = imageData;

        const colorHash = hashColor(r, g, b);
        const provinceId = provinceIds.get(colorHash);

        if (provinceId) {
            setMapState((prev) => ({ ...prev, selectedProvinceId: provinceId }));
            // eslint-disable-next-line no-console
            console.log(provinceId);
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
