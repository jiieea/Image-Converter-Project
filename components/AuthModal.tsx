import {useEffect, useRef, useState} from "react";
import {useAuthStore} from "@/app/hooks/useAuthStore";
import {signInRequest, signUpRequest} from "@/lib/api";
import {toast} from "sonner";
export const AuthModal = () => {

    const isOpen = useAuthStore((s) => s.isModalOpen);
    const mode = useAuthStore((s) => s.mode);
    const login = useAuthStore((s) => s.login);
    const closeModal = useAuthStore((s) => s.closeModal);
    const setMode = useAuthStore((s) => s.setMode);


    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const firstFieldRef = useRef<HTMLInputElement>(null);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setError('');
            setPassword('')
            setConfirmPassword('')
            const t = setTimeout(() => firstFieldRef.current?.focus(), 0)

            return () => clearTimeout(t);
        }
    }, [isOpen, mode]);


    useEffect(() => {
        if (!isOpen) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                closeModal();
            }
            window.addEventListener('keydown', handleKey);
            return () => window.removeEventListener('keydown', handleKey);
        }
    }, [isOpen, closeModal]);

    if (!isOpen) return null;

    const isSignup = mode === 'signUp'

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('')

        if (isSignup && password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 8) {
            setError('Passwords  must be at least 8 characters long');
            return;
        }
        setLoading(true);

        try {
            const data = isSignup ? await signUpRequest({
                email, password
            }) : await signInRequest({email, password})

            const receivedToken = data.user?.token;
            if(receivedToken) {
                toast.success('Logged in successfully');
                login(receivedToken);
            }else if(isSignup) {
                setMode('signIn');
                toast.success('Sign up successfully');
            }else {
                throw new Error('No Token returned from server')
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unexpected error.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) closeModal();
            }}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="auth-modal-title"
                className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl dark:bg-neutral-900"
            >
                <div className="mb-5 flex items-center justify-between">
                    <h2
                        id="auth-modal-title"
                        className="text-lg font-semibold text-neutral-900 dark:text-neutral-100"
                    >
                        {isSignup ? 'Create an account' : 'Sign in'}
                    </h2>
                    <button
                        type="button"
                        onClick={closeModal}
                        aria-label="Close"
                        className="rounded-md p-1 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label
                            htmlFor="email"
                            className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                        >
                            Email
                        </label>
                        <input
                            ref={firstFieldRef}
                            id="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            required
                            minLength={8}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                            placeholder="At least 8 characters"
                        />
                    </div>

                    {isSignup && (
                        <div>
                            <label
                                htmlFor="confirmPassword"
                                className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                            >
                                Confirm password
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                required
                                minLength={8}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                                placeholder="Re-enter your password"
                            />
                        </div>
                    )}

                    {error && (
                        <p
                            role="alert"
                            className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300"
                        >
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-neutral-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
                    >
                        {loading
                            ? isSignup
                                ? 'Creating account…'
                                : 'Signing in…'
                            : isSignup
                                ? 'Create account'
                                : 'Sign in'}
                    </button>
                </form>

                <p className="mt-4 text-center text-sm text-neutral-600 dark:text-neutral-400">
                    {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
                    <button
                        type="button"
                        onClick={() => setMode(isSignup ? 'signIn' : 'signUp')}
                        className="font-medium text-neutral-900 underline-offset-2 hover:underline dark:text-neutral-100"
                    >
                        {isSignup ? 'Sign in' : 'Sign up'}
                    </button>
                </p>
            </div>
        </div>
    );
}