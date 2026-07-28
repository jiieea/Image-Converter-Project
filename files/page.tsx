"use client"
import { Button } from "@/components/ui/button";
import Navbar from "@/components/ui/navbar";
import DropZone from "@/components/DropZone";
import { ModeToggle } from "@/components/converter/ModeToggle";
import { FormatSelector } from "@/components/converter/FormatSelector";
import { FileList } from "@/components/converter/FileList";
import { useImageConverter } from "@/hooks/useImageConverter";

export default function Home() {
    const {
        files, format, mode, loading, error, isDragging, inputRef,
        setFormat, setIsDragging, switchMode, handleDrop, handleFileChange,
        removeFile, handleConvert, canConvert,
    } = useImageConverter();

    return (
        <main className="min-h-screen bg-white">
            <Navbar />

            <div className="max-w-lg mx-auto px-6 py-16">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-medium text-zinc-900 mb-2">
                        Convert images instantly
                    </h1>
                    <p className="text-zinc-500 text-sm">
                        Free, no login required. JPG, PNG, WebP and PDF supported.
                    </p>
                </div>

                <ModeToggle mode={mode} onChange={switchMode} />

                <DropZone
                    mode={mode}
                    handleDrop={handleDrop}
                    inputRef={inputRef}
                    handleFileChange={handleFileChange}
                    isDragging={isDragging}
                    setIsDragging={setIsDragging}
                />

                <FileList mode={mode} files={files} onRemove={removeFile} />

                {mode === "single" && (
                    <FormatSelector format={format} onChange={setFormat} />
                )}

                {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

                <Button className="w-full" disabled={!canConvert} onClick={handleConvert}>
                    {loading
                        ? "Converting..."
                        : mode === "merge"
                            ? `Merge ${files.length} images to PDF`
                            : "Convert image"}
                </Button>

                {mode === "merge" && files.length === 1 && (
                    <p className="text-xs text-zinc-400 text-center mt-2">
                        Add at least one more image to merge
                    </p>
                )}
            </div>
        </main>
    );
}
