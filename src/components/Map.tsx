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

    return <canvas ref={canvasRef} className="size-full" />;
};
