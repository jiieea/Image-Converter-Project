import React from "react";
import {DropZoneProps} from '@/app/types/interface'

const DropZone: React.FC<DropZoneProps> = (
    {
        handleDrop,
        inputRef,
        setIsDragging,
        handleFileChange,
        mode,
        isDragging,
        handleMultiFileChange,
    }
) => {
    return (
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
                multiple={mode === 'merge' || mode === 'compress'}
                className="hidden"
                onChange={mode === 'single' ? handleFileChange : handleMultiFileChange}
            />
            <p className="text-3xl mb-3">↑</p>
            <p className="font-medium text-zinc-900 text-sm">
                {mode === 'single' || mode === 'compress'
                    ? 'Drop your image here'
                    : 'Drop multiple files here'
                }
            </p>
            <p className="text-xs text-zinc-400 mt-1">
                {mode === 'merge'
                    ? 'JPG, PNG, WebP supported — any mix'
                    : 'or click to browse — up to 50MB'
                }
            </p>
        </div>
    )
}

export default DropZone;