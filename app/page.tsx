"use client"
import React, {useRef} from "react";
import {useRouter} from "next/navigation";
import {convertImage} from "@/lib/api";
import {Button} from "@/components/ui/button";
import Navbar from "@/components/ui/navbar";


const FORMATS = ['png', 'jpg', 'jpeg', 'webp', 'pdf'];
export default function Home() {
    const [file, setFile] = React.useState<File | null>(null);
    const [format, setFormat] = React.useState("png");
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState("");
    const [isDragging, setIsDragging] = React.useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const handleDrop = (event: React.DragEvent) => {
        event.preventDefault();
        setIsDragging(false);
        const dropped = event.dataTransfer.files[0];
        if (dropped) setFile(dropped);
    }

    const getFormat = (format: string) => {
        setFormat(format);
        console.log(format);
    }

    const handleConvert = async () => {
        if (!file) return;
        setError('')
        setLoading(true);

        try {
            const fileUrl = await convertImage(file, format); // return url
            sessionStorage.setItem('convertedUrl', fileUrl);
            sessionStorage.setItem('convertedFormat', format);
            sessionStorage.setItem('originalName', file.name);
            router.push('/result');
        } catch (error: any) {
            console.error(error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar/>
            <div className="max-w-lg mx-auto py-16 px-6">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-medium text-zinc-900 mb-2">
                        Convert images instantly
                    </h1>
                    <p className="text-zinc-500 text-sm">
                        Free, no login required. JPG, PNG, WebP and PDF supported.
                    </p>
                </div>
                <div
                    onDrop={handleDrop}
                    onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true)
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onClick={() => inputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors mb-6
                    ${isDragging
                        ? 'border-zinc-400 bg-zinc-50'
                        : 'border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50'
                    }`}
                >
                    <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        ref={inputRef}
                        onChange={(e) => setFile(e.target.files?.[0] || null)}/>
                    <p className="text-3xl mb-3">↑</p>
                    {file ? (
                        <>
                            <p className="font-medium text-zinc-900 text-sm">{file.name}</p>
                            <p className="text-xs text-zinc-400 mt-1">
                                {(file.size / 1024 / 1024).toFixed(2)} MB · click to change
                            </p>
                        </>
                    ) : (
                        <>
                            <p className="font-medium text-zinc-900 text-sm">
                                Drop your image here
                            </p>
                            <p className="text-xs text-zinc-400 mt-1">
                                or click to browse — up to 50MB
                            </p>
                        </>
                    )}
                </div>
                {/* Format selector */}
                <p className="text-sm text-zinc-500 mb-3">Convert to</p>
                <div className="flex gap-2 mb-6">
                    {FORMATS.map((f) => (
                        <Button
                            key={f}
                            onClick={() => getFormat(f)}
                            className={`px-4 py-2 rounded-lg text-sm border transition-colors
                ${format === f
                                ? 'border-popover bg-blue-50 text-blue-800'
                                : 'border-zinc-200 text-secondary hover:border-accent-foreground '
                            }`}
                        >
                            {f.toUpperCase()}
                        </Button>
                    ))}
                </div>

                {error && (
                    <p className="text-sm text-red-500 mb-4">{error}</p>
                )}
                <Button
                    className="w-full rounded-lg my-2"
                    disabled={!file || loading}
                    onClick={handleConvert}
                >
                    {loading ? 'Converting...' : 'Convert image'}
                </Button>
            </div>
        </div>
    );
}
