import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// This store lives in localStorage — survives page refresh
const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,

      setTokens: (access, refresh) => {
        localStorage.setItem('access_token', access)
        localStorage.setItem('refresh_token', refresh)
        set({ accessToken: access, refreshToken: refresh })
      },

      setUser: (user) => set({ user }),

      logout: () => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        set({ user: null, accessToken: null, refreshToken: null })
      },

      isAuthenticated: () => {
        const state = useAuthStore.getState()
        return !!state.accessToken
      },
    }),
    { name: 'auth-storage', partialize: (s) => ({ user: s.user, accessToken: s.accessToken, refreshToken: s.refreshToken }) }
  )
)

export default useAuthStore
