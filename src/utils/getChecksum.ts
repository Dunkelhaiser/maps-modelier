export const getChecksum = async (imageUrl: string): Promise<string> => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;

    await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
    });

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not get canvas context");

    canvas.width = img.width;
    canvas.height = img.height;

    ctx.drawImage(img, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

    const hash = await window.crypto.subtle.digest("SHA-256", imageData);
    const decoder = new TextDecoder("utf-8");
    const checksum = decoder.decode(hash);

    return checksum;
};

export const verifyImageChecksum = async (imageUrl: string, expectedChecksum: string): Promise<boolean> => {
    try {
        const checksum = await getChecksum(imageUrl);
        return checksum.toLowerCase() === expectedChecksum.toLowerCase();
    } catch {
        return false;
    }
};
