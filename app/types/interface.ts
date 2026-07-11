import React, {RefObject} from "react";
export interface DropZoneProps {
    handleDrop: (event: React.DragEvent) => void;
    inputRef: RefObject<HTMLInputElement | null>;
    setIsDragging: React.Dispatch<boolean>;
    isDragging: boolean;
    mode: string;
    handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}