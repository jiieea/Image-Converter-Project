import {create} from "zustand";
import {persist} from 'zustand/middleware'

type AuthMode = 'signIn' | 'signUp'

interface AuthStoreState {
    // state
    token: string | null;
    isModalOpen: boolean;
    mode: AuthMode;
    hasHydrated: boolean;

    // derived-ish getters
    isAuthenticated: () => boolean;

    // actions
    openModal: (mode?: AuthMode) => void;
    closeModal: () => void;
    setMode: (mode?: AuthMode) => void;
    login: (token: string) => void;
    logout: () => void;
    setHasHydrated: (hasHydrated: boolean) => void;
}

export const useAuthStore = create<AuthStoreState>()(
    persist(
        (set, get) => ({
            token: null,
            isModalOpen: false,
            mode: "signIn",
            hasHydrated: false,
            isAuthenticated: () => get().token !== null,
            openModal: (mode = 'signIn') => set({isModalOpen: true, mode}),
            closeModal: () => set({isModalOpen: false}),

            setHasHydrated: (hasHydrated: boolean) => set({hasHydrated}),
            setMode: (mode: AuthMode) => set({mode}),
            login: (token: string) => set({isModalOpen: false, token}),
            logout: () => set({token: null}),

        }),
        {
            name: 'auth-storage', // localStorage  key
            partialize: (state) => ({
                token: state.token,
            }) ,// only persist token not UI State
            onRehydrateStorage: () => (state: any) => {
                state?.setHasHydrated(true);
            }
        }
    )
)
