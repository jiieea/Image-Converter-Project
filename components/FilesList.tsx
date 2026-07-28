import React from 'react';
import {FileListProps} from '@/app/types/interface'

const toMb = (bytes: number) => (bytes / 1024 / 1024).toFixed(2)

function FilesList({
                       mode,
                       onRemove,
                       files
                   }: FileListProps) {
    if (files.length === 0) return null;

    if (mode === 'single') {
        return (
            <div className="flex items-center gap-3 px-4 py-3 border border-zinc-100 rounded-xl mb-6">
                <p className="flex-1 text-sm text-zinc-700 truncate">{files[0].name}</p>
                <p className="text-xs text-zinc-400">{toMb(files[0].size)} MB</p>
                <button
                    onClick={() => onRemove(0)}
                    className="text-zinc-300 hover:text-zinc-500 text-lg leading-none"
                >
                    ×
                </button>
            </div>
        );
    }
    return (
        <div className="border border-zinc-100 rounded-xl mb-6 overflow-hidden">
            <div className="px-4 py-2 bg-zinc-50 border-b border-zinc-100">
                <p className="text-xs text-zinc-500">
                    {files.length} image{files.length > 1 ? "s" : ""} selected — will be merged in this order
                </p>
            </div>
            {files.map((file, index) => (
                <div
                    key={`${file.name}-${index}`}
                    className="flex items-center gap-3 px-4 py-3 border-b border-zinc-50 last:border-0"
                >
                    <span className="text-xs text-zinc-400 w-4">{index + 1}</span>
                    <p className="flex-1 text-sm text-zinc-700 truncate">{file.name}</p>
                    <p className="text-xs text-zinc-400">{toMb(file.size)} MB</p>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onRemove(index);
                        }}
                        className="text-zinc-300 hover:text-zinc-500 text-lg leading-none"
                    >
                        ×
                    </button>
                </div>
            ))}
        </div>
    );
}

export default FilesList;



