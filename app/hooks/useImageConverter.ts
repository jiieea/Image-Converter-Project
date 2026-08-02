import React, {useRef} from "react";
import {useRouter} from "next/navigation";
import {compressionImage, convertImage, convertPdf} from "@/lib/api";
import {toast} from "sonner";

export type ConvertMode = "single" | 'merge' | 'compress';
const IMAGE_MIME_PREFIX = "image/";
const IMAGE_EXTENSIONS = /\.(png|jpe?g|webp|gif|bmp|jpg|pdf)$/i;

const isImageFile = (file: File) =>
    file.type.startsWith(IMAGE_MIME_PREFIX) || IMAGE_EXTENSIONS.test(file.name);

export function useImageConverter() {
    const [files, setFiles] = React.useState<File[]>([]);
    const [format, setFormat] = React.useState("png");
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState("");
    const [isDragging, setIsDragging] = React.useState(false);
    const [mode, setMode] = React.useState<ConvertMode>('single')
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();


    const applySelection = (selected: File[]) => {
        const images = selected.filter(isImageFile);
        setFiles(mode === "single" || mode === 'compress' ? images.slice(0, 1) : images);
    }


    const handleDrop = (event: React.DragEvent) => {
        event.preventDefault();
        setIsDragging(false);
        applySelection(Array.from(event.dataTransfer.files));
    }

    const handleMultiFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const newFiles = Array.from(e.target.files);

        setFiles((prevState) => {
            const existingKeys = new Set(prevState.map(f => `${f.name}-${f.size}`));
            const uniqueNew = newFiles.filter((file) => !existingKeys.has(`${file.name}-${file.size}`));
            return [...prevState, ...uniqueNew];
        });
        e.target.value = ""; // reset selected file so we can add the same file after we remove itt f
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

    const getFormat = (format: string) => {
        setFormat(format);
    }


    const canConvert = files.length > 0 && !loading && !(mode === 'merge' && files.length < 2)
    const handleImage = async () => {
        if (files.length === 0) return;
        setError('')
        setLoading(true);
        try {
            const url = mode === 'merge' ?
                await convertPdf(files) : mode === 'single' ? await convertImage(files[0], format) : await compressionImage(files[0]);
            sessionStorage.setItem('url', url);
            sessionStorage.setItem('convertedFormat', mode === 'merge' ? 'pdf' : format);
            sessionStorage.setItem('originalName', files[0].name);
            router.push('/result');
            toast.success(mode !== 'compress' ? 'Convert Image Successfully' : 'Compressing image successfully');
        } catch (err: any) {
            setError(err.message);
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    }
    return {
        files, format, mode, loading, error, isDragging, inputRef, getFormat,
        setFormat, setIsDragging, switchMode, handleDrop, handleFileChange, handleImage,
        removeFile, canConvert, handleMultiFileChange
    }
}