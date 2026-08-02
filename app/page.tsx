"use client"
import React from "react";
import {Button} from "@/components/ui/button";
import Navbar from "@/components/ui/navbar";
import DropZone from "@/components/DropZone";
import {useImageConverter} from "@/app/hooks/useImageConverter";
import {ModeToggle} from "@/components/ModeToggle";
import FilesList from "@/components/FilesList";
import {FormatList} from "@/components/FormatList";


export default function Home() {
    const {
        files, format, mode, loading, error, isDragging, inputRef,
        setIsDragging, switchMode, handleDrop, handleFileChange,
        removeFile, canConvert, handleMultiFileChange, getFormat,handleImage
    } = useImageConverter();
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
                    handleMultiFileChange={handleMultiFileChange}
                />

                <FilesList mode={mode} onRemove={removeFile} files={files}/>

                {/* Format selector — only show in single mode */}
                {mode === 'single' && (
                    <FormatList format={format} onChange={getFormat}/>
                )}

                {error && (
                    <p className="text-sm text-red-500 mb-4">{error}</p>
                )}

                <Button
                    className="w-full"
                    disabled={!canConvert}
                    onClick={
                        handleImage
                    }
                >
                    {loading
                        ? 'Converting...'
                        : mode === 'merge'
                            ? `Merge ${files.length} images to PDF`
                            : mode === 'single' ? 'Convert Image' : 'Compress Image'
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
