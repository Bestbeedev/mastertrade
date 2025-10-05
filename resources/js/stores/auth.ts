
import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { User } from "@/types/model" // ton fichier où tu as défini User et Role

// 📌 Typage du store
interface AuthState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null

  // Actions
  login: (user: User) => void
  logout: () => void
  setLoading: (state: boolean) => void
  setError: (message: string | null) => void
  updateUser: (data: Partial<User>) => void
}

// 📌 Store Zustand
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      login: (user) =>
        set({
          user,
          isAuthenticated: true,
          loading: false,
          error: null,
        }),

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
        }),

      setLoading: (state) => set({ loading: state }),
      setError: (message) => set({ error: message }),

      updateUser: (data) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        })),
    }),
    {
      name: "auth-storage", // clé localeStorage
    }
  )
)
