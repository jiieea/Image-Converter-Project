"use client"
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { convertImage, convertPdf } from "@/lib/api";
import { toast } from "sonner";

export type ConvertMode = "merge" | "single" | "compress";

const IMAGE_MIME_PREFIX = "image/";

export function useImageConverter() {
    const [files, setFiles] = useState<File[]>([]);
    const [format, setFormat] = useState("png");
    const [mode, setMode] = useState<ConvertMode>("single");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isDragging, setIsDragging] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const applySelection = (selected: File[]) => {
        const images = selected.filter((file) => file.type.startsWith(IMAGE_MIME_PREFIX));
        setFiles(mode === "single" ? images.slice(0, 1) : images);
    };

    const handleDrop = (event: React.DragEvent) => {
        event.preventDefault();
        setIsDragging(false);
        applySelection(Array.from(event.dataTransfer.files));
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        applySelection(Array.from(event.target.files ?? []));
    };

    const removeFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const switchMode = (next: ConvertMode) => {
        setMode(next);
        setFiles([]);
    };

    const handleConvert = async () => {
        if (files.length === 0) return;
        setError("");
        setLoading(true);
        try {
            const url = mode === "merge"
                ? await convertPdf(files)
                : await convertImage(files[0], format);

            sessionStorage.setItem("convertedUrl", url);
            sessionStorage.setItem("convertedFormat", mode === "merge" ? "pdf" : format);
            sessionStorage.setItem("originalName", files[0].name);

            toast.success("Successfully converted!");
            router.push("/result");
        } catch (err: any) {
            const message = err?.message ?? "Something went wrong";
            setError(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const canConvert = files.length > 0 && !loading && !(mode === "merge" && files.length < 2);

    return {
        files, format, mode, loading, error, isDragging, inputRef,
        setFormat, setIsDragging, switchMode, handleDrop, handleFileChange,
        removeFile, handleConvert, canConvert,
    };
}
