import { useEffect, useState } from "react";

interface WindowSize<T extends number | undefined = number | undefined> {
    width: T;
    height: T;
}

export const useWindowSize = () => {
    const [windowSize, setWindowSize] = useState<WindowSize>(() => ({
        width: undefined,
        height: undefined,
    }));

    const handleSize = () => {
        setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight,
        });
    };

    useEffect(() => {
        handleSize();

        window.addEventListener("resize", handleSize);

        return () => removeEventListener("resize", handleSize);
    }, []);

    return windowSize;
};
