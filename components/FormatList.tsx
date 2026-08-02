import React from "react";

const FORMATS = ['png', 'jpg', 'jpeg', 'webp', 'pdf'];
interface FormatListProps {
    format: string;
    onChange: (format: string) => void;
}
export const FormatList: React.FC<FormatListProps> = (
    {
        format,
        onChange,
    }
) => {
    return (
        <>
            <p className="text-sm text-zinc-500 mb-3">Convert to</p>
            <div className="flex gap-2 mb-6">
                {FORMATS.map((f) => (
                    <button
                        key={f}
                        onClick={() => onChange(f)}
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
    );
};