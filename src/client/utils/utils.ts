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

export const formatLocalDateTime = (date: Date | null | undefined) => {
    if (!date) return undefined;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export const formatDate = (date: Date | string) => new Date(date).toLocaleDateString();
