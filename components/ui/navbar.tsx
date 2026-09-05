'use client';

import Link from "next/link";
import {useAuthStore} from "@/app/hooks/useAuthStore";
import {logoutReq} from "@/lib/api";

const Navbar = () => {
    const openModal = useAuthStore((s) => s.openModal);
    const token = useAuthStore((s) => s.token);
    const logout = useAuthStore((s) => s.logout);
    const hasHydrated = useAuthStore((s) => s.hasHydrated);
    const handleLogout = async () => {
        try {
            await logoutReq(token!)
        }finally {
            logout()
        }
    }
    return (
        <nav className="border-b border-zinc-100 px-6 py-4 flex items-center justify-between">
            <span className="font-medium text-lg font-sans text-primary">imgconvert</span>
            <div className="flex gap-6 text-sm text-primary">
                <Link href="/" className="hover:text-secondary transition-colors">Home</Link>
                <Link href="/about" className="hover:text-zinc-900 transition-colors">About</Link>
                {!hasHydrated ? (
                    <span className="w-14"></span>
                ) : token ?  (
                    <button
                        onClick={() => handleLogout()}
                        className="hover:text-zinc-900 transition-colors"
                    >
                        Logout
                    </button>
                ) : (
                    <button
                        onClick={() => openModal('signUp')}
                        className="hover:text-zinc-900 transition-colors"
                    >
                        SignUp
                    </button>
                )}
            </div>
        </nav>
    )
}

export default Navbar;