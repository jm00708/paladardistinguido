import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const usePartnerStore = create(
  persist(
    (set) => ({
      access: null,
      refresh: null,
      email: null,

      setTokens: (access, refresh, email) => {
        localStorage.setItem('partner_access_token', access)
        localStorage.setItem('partner_refresh_token', refresh)
        set({ access, refresh, email })
      },

      logout: () => {
        localStorage.removeItem('partner_access_token')
        localStorage.removeItem('partner_refresh_token')
        set({ access: null, refresh: null, email: null })
      },
    }),
    {
      name: 'epd-partner-session',
      partialize: (state) => ({ access: state.access, refresh: state.refresh, email: state.email }),
    },
  ),
)

export default usePartnerStore
