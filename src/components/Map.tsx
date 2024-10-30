import { useState, useRef, useEffect } from "react";

interface MapState {
    image: HTMLImageElement | null;
    scale: number;
    offsetX: number;
    offsetY: number;
    isDragging: boolean;
    lastMouseX: number;
    lastMouseY: number;
}

interface Props {
    imageUrl: string | null;
}

export const Map = ({ imageUrl }: Props) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [mapState, setMapState] = useState<MapState>({
        image: null,
        scale: 1,
        offsetX: 0,
        offsetY: 0,
        isDragging: false,
        lastMouseX: 0,
        lastMouseY: 0,
    });

    useEffect(() => {
        if (!imageUrl) return;

        const image = new Image();
        image.src = imageUrl;
        image.onload = () => {
            setMapState((prev) => ({ ...prev, image }));
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

    const handleMouseMove = (e: React.MouseEvent) => {
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

    const handleWheel = (e: React.WheelEvent) => {
        e.preventDefault();

        const canvas = canvasRef.current;
        const { image } = mapState;
        if (!canvas || !image) return;

        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const scaleFactor = e.deltaY > 0 ? 0.9 : 1.1;
        const newScale = mapState.scale * scaleFactor;

        const minScale = Math.max(canvas.width / image.width, canvas.height / image.height);

        const clampedScale = Math.max(minScale, newScale);

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

    return (
        <canvas
            ref={canvasRef}
            className="size-full"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
        />
    );
};
