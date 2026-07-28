import React, {RefObject} from "react";
import {ConvertMode} from "@/app/hooks/useImageConverter";
export interface DropZoneProps {
    handleDrop: (event: React.DragEvent) => void;
    inputRef: RefObject<HTMLInputElement | null>;
    setIsDragging: React.Dispatch<boolean>;
    isDragging: boolean;
    mode: string;
    handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface FileListProps {
    mode : ConvertMode;
    onRemove: (index : number) => void;
    files: File[];
}


export interface ModeToggleProps {
    mode: ConvertMode;
    onChange: (mode: ConvertMode) => void;
}