import React, {useRef} from "react";
import {useRouter} from "next/navigation";
import {convertImage, convertPdf} from "@/lib/api";
import {toast} from "sonner";

export type ConvertMode = "merge" | 'single';
const IMAGE_MIME_PREFIX = "image/";

export function useImageConverter() {
    const [files, setFiles] = React.useState<File[]>([]);
    const [format, setFormat] = React.useState("png");
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState("");
    const [isDragging, setIsDragging] = React.useState(false);
    const [mode, setMode] = React.useState<ConvertMode>('single')
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();


    const applySelection = (selection: File[]) => {
        const images = selection.filter((file => {
            file.type.startsWith(IMAGE_MIME_PREFIX);
        }));
        setFiles(mode === 'single' ? images.slice(0, 1) : images)
    }


    const handleDrop = (event: React.DragEvent) => {
        event.preventDefault();
        setIsDragging(false);
        applySelection(Array.from(event.dataTransfer.files));
    }


    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        applySelection(Array.from(event.target.files ?? []))
    }

    const removeFile = (index: number) => {
        setFiles(prevState => prevState.filter((_, i) => i !== index))
    }

    const switchMode = (next: ConvertMode) => {
        setMode(next);
        setFiles([])
    }

    const canConvert = files.length > 0 && !loading && !(mode === 'merge'&& files.length < 2)
    const handleConvert = async () => {
        if (files.length === 0) return;
        setError('')
        setLoading(true);
        try {
            let url: string;

            if (mode === 'merge') {
                url = await convertPdf(files)
            } else {
                url = await convertImage(files[0], format)
            }
            sessionStorage.setItem('convertedUrl', url);
            sessionStorage.setItem('convertedFormat', mode === 'merge' ? 'pdf' : format);
            sessionStorage.setItem('originalName', files[0].name);
            router.push('/result');
            toast.success('Successfully converted!');
        } catch (err: any) {
            setError(err.message);
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    }
    return {
        files, format, mode, loading, error, isDragging, inputRef,
        setFormat, setIsDragging, switchMode, handleDrop, handleFileChange,
        removeFile, handleConvert, canConvert,
    }
}