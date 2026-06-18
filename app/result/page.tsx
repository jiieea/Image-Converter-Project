"use client"
import Navbar from "@/components/ui/navbar";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";


const ResultPage = () => {
    const [url, setUrl] = useState("");
    const [format, setFormat] = useState("");
    const [originalName, setOriginalName] = useState("");
    const router = useRouter();


    useEffect(() => {
        const savedUrl = sessionStorage.getItem("convertedUrl");
        const savedFormat = sessionStorage.getItem("convertedFormat");
        const originalItem = sessionStorage.getItem("originalName");
        if (!savedUrl) {
            router.push("/");
            return;
        }
        setUrl(savedUrl);
        setFormat(savedFormat || "");
        setOriginalName(originalItem || "");
    }, [router]);

    const handleDownload = async () => {
        const response = await fetch(url);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = `converted.${format}`;
        link.click();

        URL.revokeObjectURL(blobUrl);
    }

    const handleReConvert = () => {
        sessionStorage.clear();
        router.push("/");
    }

    const originalExt = originalName.split('/').pop()?.toUpperCase();
    return (
        <main className='min-h-screen bg-white'>
            <Navbar/>
            <div className="max-w-lg mx-auto px-6 py-16">
                <div className="text-center mb-10">
                    <h1 className="text-2xl font-medium text-zinc-900 mb-2">
                        Your file is ready
                    </h1>
                    <p className="text-zinc-500 text-sm">
                        Download it below — link expires in 1 hour.
                    </p>
                </div>

                <div className="border border-zinc-100 rounded-xl p-5 flex items-center gap-4 mb-4">
                    <div
                        className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 text-lg flex-shrink-0">
                        ↓
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-zinc-900 truncate">
                            converted.{format}
                            <Badge variant="secondary" className="rounded-md bg-foreground ml-2 text-xs">ready</Badge>
                        </p>
                        <p className="text-xs text-zinc-400 mt-0.5">
                            Converted from {originalExt} · expires in 1 hour
                        </p>
                    </div>
                    <Button size="sm" className="rounded-md" onClick={handleDownload}>
                        Download
                    </Button>
                </div>

                <button
                    onClick={handleReConvert}
                    className="w-full py-2.5 rounded-lg border border-zinc-200 text-sm text-zinc-500 hover:bg-zinc-50 transition-colors"
                >
                    ← Convert another image
                </button>
            </div>
        </main>
    )
}

export default ResultPage;