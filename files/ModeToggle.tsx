import { ConvertMode } from "@/hooks/useImageConverter";

const OPTIONS: { value: ConvertMode; label: string }[] = [
    { value: "single", label: "Single image" },
    { value: "merge", label: "Merge to PDF" },
];

export function ModeToggle({
    mode,
    onChange,
}: {
    mode: ConvertMode;
    onChange: (mode: ConvertMode) => void;
}) {
    return (
        <div className="flex gap-2 mb-6 p-1 bg-zinc-100 rounded-lg">
            {OPTIONS.map(({ value, label }) => (
                <button
                    key={value}
                    onClick={() => onChange(value)}
                    className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                        mode === value
                            ? "bg-white text-zinc-900 shadow-sm"
                            : "text-zinc-500 hover:text-zinc-700"
                    }`}
                >
                    {label}
                </button>
            ))}
        </div>
    );
}
