"use client"
import React, {useRef} from "react";
import {useRouter} from "next/navigation";
import {convertImage, convertPdf} from "@/lib/api";
import {Button} from "@/components/ui/button";
import Navbar from "@/components/ui/navbar";
import {toast} from "sonner";


const FORMATS = ['png', 'jpg', 'jpeg', 'webp', 'pdf'];
export default function Home() {
    const [files, setFiles] = React.useState<File[]>([]);
    const [format, setFormat] = React.useState("png");
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState("");
    const [isDragging, setIsDragging] = React.useState(false);
    const [mode, setMode] = React.useState<'merge' | 'single'>('single')
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const handleDrop = (event: React.DragEvent) => {
        event.preventDefault();
        setIsDragging(false);
        const dropped = Array.from(event.dataTransfer.files).filter((file) => {
            file.type.startsWith("image/");
        });
        if (mode === 'single') {
            setFiles(dropped.slice(0, 1))
        } else {
            setFiles(dropped)
        }
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selected = Array.from(event.target.files || []);
        if (mode === 'single') {
            setFiles(selected.slice(0, 1))
        } else {
            setFiles(selected)
        }
    }

    const getFormat = (format: string) => {
        setFormat(format);
        console.log(format);
    }

    const handleConvert = async () => {
        if (!files) return;
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

    const removeFile = (index: number) => {
        setFiles(files.filter((x, i) => i !== index))
    }

    return (
        <main className="min-h-screen bg-white">
            <Navbar/>

            <div className="max-w-lg mx-auto px-6 py-16">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-medium text-zinc-900 mb-2">
                        Convert images instantly
                    </h1>
                    <p className="text-zinc-500 text-sm">
                        Free, no login required. JPG, PNG, WebP and PDF supported.
                    </p>
                </div>

                {/* Mode toggle */}
                <div className="flex gap-2 mb-6 p-1 bg-zinc-100 rounded-lg">
                    <button
                        onClick={() => {
                            setMode('single');
                            setFiles([])
                        }}
                        className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors
              ${mode === 'single'
                            ? 'bg-white text-zinc-900 shadow-sm'
                            : 'text-zinc-500 hover:text-zinc-700'
                        }`}
                    >
                        Single image
                    </button>
                    <button
                        onClick={() => {
                            setMode('merge');
                            setFiles([])
                        }}
                        className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors
              ${mode === 'merge'
                            ? 'bg-white text-zinc-900 shadow-sm'
                            : 'text-zinc-500 hover:text-zinc-700'
                        }`}
                    >
                        Merge to PDF
                    </button>
                </div>

                {/* Dropzone */}
                <div
                    onDrop={handleDrop}
                    onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true)
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onClick={() => inputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors mb-4
            ${isDragging
                        ? 'border-zinc-400 bg-zinc-50'
                        : 'border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50'
                    }`}
                >
                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/*"
                        multiple={mode === 'merge'} // ← allow multiple in merge mode
                        className="hidden"
                        onChange={handleFileChange}
                    />
                    <p className="text-3xl mb-3">↑</p>
                    <p className="font-medium text-zinc-900 text-sm">
                        {mode === 'merge'
                            ? 'Drop multiple images here'
                            : 'Drop your image here'
                        }
                    </p>
                    <p className="text-xs text-zinc-400 mt-1">
                        {mode === 'merge'
                            ? 'JPG, PNG, WebP supported — any mix'
                            : 'or click to browse — up to 50MB'
                        }
                    </p>
                </div>

                {/* File list for merge mode */}
                {mode === 'merge' && files.length > 0 && (
                    <div className="border border-zinc-100 rounded-xl mb-6 overflow-hidden">
                        <div className="px-4 py-2 bg-zinc-50 border-b border-zinc-100">
                            <p className="text-xs text-zinc-500">
                                {files.length} image{files.length > 1 ? 's' : ''} selected
                                — will be merged in this order
                            </p>
                        </div>
                        {files.map((file, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-3 px-4 py-3 border-b border-zinc-50 last:border-0"
                            >
                                <span className="text-xs text-zinc-400 w-4">{index + 1}</span>
                                <p className="flex-1 text-sm text-zinc-700 truncate">{file.name}</p>
                                <p className="text-xs text-zinc-400">
                                    {(file.size / 1024 / 1024).toFixed(1)} MB
                                </p>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeFile(index)
                                    }}
                                    className="text-zinc-300 hover:text-zinc-500 text-lg leading-none"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Single file selected */}
                {mode === 'single' && files.length > 0 && (
                    <div className="flex items-center gap-3 px-4 py-3 border border-zinc-100 rounded-xl mb-6">
                        <p className="flex-1 text-sm text-zinc-700 truncate">{files[0].name}</p>
                        <p className="text-xs text-zinc-400">
                            {(files[0].size / 1024 / 1024).toFixed(1)} MB
                        </p>
                        <button
                            onClick={() => setFiles([])}
                            className="text-zinc-300 hover:text-zinc-500 text-lg leading-none"
                        >
                            ×
                        </button>
                    </div>
                )}

                {/* Format selector — only show in single mode */}
                {mode === 'single' && (
                    <>
                        <p className="text-sm text-zinc-500 mb-3">Convert to</p>
                        <div className="flex gap-2 mb-6">
                            {FORMATS.map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFormat(f)}
                                    className={`px-4 py-2 rounded-lg text-sm border transition-colors
                    ${format === f
                                        ? 'border-blue-300 bg-blue-50 text-blue-800'
                                        : 'border-zinc-200 text-zinc-500 hover:border-zinc-300'
                                    }`}
                                >
                                    {f.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </>
                )}

                {error && (
                    <p className="text-sm text-red-500 mb-4">{error}</p>
                )}

                <Button
                    className="w-full"
                    disabled={files.length === 0 || loading || (mode === 'merge' && files.length < 2)}
                    onClick={handleConvert}
                >
                    {loading
                        ? 'Converting...'
                        : mode === 'merge'
                            ? `Merge ${files.length} images to PDF`
                            : 'Convert image'
                    }
                </Button>

                {mode === 'merge' && files.length === 1 && (
                    <p className="text-xs text-zinc-400 text-center mt-2">
                        Add at least one more image to merge
                    </p>
                )}
            </div>
        </main>
    );
}
