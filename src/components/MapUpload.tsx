import FileUpload from "@ui/FileUpload";

interface Props {
    onImageUpload: (imageUrl: string) => void;
}

export const MapUpload = ({ onImageUpload }: Props) => {
    const handleDrop = (e: React.DragEvent) => {
        const [file] = e.dataTransfer.files;
        if (file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    onImageUpload(event.target.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    onImageUpload(event.target.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    return <FileUpload className="mx-auto w-full max-w-xl" onChange={handleFileInput} onDrop={handleDrop} />;
};
