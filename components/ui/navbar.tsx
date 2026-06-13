import Link from "next/link";
import React from "react";

const Navbar = () => {
    return (
        <nav className="border-b border-zinc-100 px-6 py-4 flex items-center justify-between">
            <span className="font-medium text-lg font-sans text-primary">imgconvert</span>
            <div className="flex gap-6 text-sm text-primary">
                <Link href="/" className="hover:text-secondary transition-colors">Home</Link>
                <Link href="/about" className="hover:text-zinc-900 transition-colors">About</Link>
            </div>
        </nav>
    )
}

export default Navbar;