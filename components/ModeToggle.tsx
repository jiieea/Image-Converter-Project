import React from "react";
import {ModeToggleProps} from "@/app/types/interface";

export const ModeToggle: React.FC<ModeToggleProps> = (
    {
        mode,
        onChange,
    }
) => {
    return (
        <div className="flex gap-2 mb-6 p-1 bg-zinc-100 rounded-lg">
            <button
                onClick={() => onChange('single')}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors
              ${mode === 'single'
                    ? 'bg-white text-zinc-900 shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-700'
                }`}
            >
                Single image
            </button>
            <button
                onClick={() => onChange('merge')}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors
              ${mode === 'merge'
                    ? 'bg-white text-zinc-900 shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-700'
                }`}
            >
                Merge to PDF
            </button>
        </div>

    )
}