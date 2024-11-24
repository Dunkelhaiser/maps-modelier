/* eslint-disable no-bitwise */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const brightenColor = (color: number, amount = 0.2) => {
    const r = (color >> 16) & 255;
    const g = (color >> 8) & 255;
    const b = color & 255;

    const brightenChannel = (channel: number) => Math.min(255, Math.round(channel * (1 + amount)));

    const newColor = (brightenChannel(r) << 16) + (brightenChannel(g) << 8) + brightenChannel(b);

    return newColor;
};

export const darkenColor = (color: number, amount = 0.2) => {
    const r = (color >> 16) & 255;
    const g = (color >> 8) & 255;
    const b = color & 255;

    const darkenChannel = (channel: number) => Math.max(0, Math.round(channel * (1 - amount)));

    const newColor = (darkenChannel(r) << 16) + (darkenChannel(g) << 8) + darkenChannel(b);

    return newColor;
};
