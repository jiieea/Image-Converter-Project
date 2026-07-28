"use client"
import React from "react";
import {Button} from "@/components/ui/button";
import Navbar from "@/components/ui/navbar";
import DropZone from "@/components/DropZone";
import {useImageConverter} from "@/app/hooks/useImageConverter";
import {ModeToggle} from "@/components/ModeToggle";


const FORMATS = ['png', 'jpg', 'jpeg', 'webp', 'pdf'];
export default function Home() {
    const {
        files, format, mode, loading, error, isDragging, inputRef,
        setFormat, setIsDragging, switchMode, handleDrop, handleFileChange,
        removeFile, handleConvert, canConvert,
    } = useImageConverter();

    const getFormat = (format: string) => {
        setFormat(format);
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
                <ModeToggle mode={mode} onChange={switchMode}/>
                {/* Dropzone */}
                <DropZone
                    mode={mode}
                    handleDrop={handleDrop}
                    inputRef={inputRef}
                    handleFileChange={handleFileChange}
                    isDragging={isDragging}
                    setIsDragging={setIsDragging}
                />

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
                                    onClick={() => getFormat(f)}
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
                    disabled={!canConvert}
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
