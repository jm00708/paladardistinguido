import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useDinerStore = create(
  persist(
    (set) => ({
      // Sesión actual
      restaurant: null,
      tableNumber: '',
      dinerId: null,
      isGuest: true,

      // Cuestionario (valores 0.0–1.0)
      questionnaire: {
        body: 0.5,
        acidity: 0.5,
        tannins: 0.35,
        sweetness: 0.2,
        experience: 'occasional',
      },

      // Flujo de selección
      selectedDish: null,
      recommendation: null,

      // Auth
      diner: null,

      // Setters
      setRestaurant: (restaurant) => set({ restaurant }),
      setTableNumber: (tableNumber) => set({ tableNumber }),
      setDinerId: (dinerId) => set({ dinerId }),
      setQuestionnaire: (q) => set((s) => ({ questionnaire: { ...s.questionnaire, ...q } })),
      setSelectedDish: (dish) => set({ selectedDish: dish }),
      setRecommendation: (rec) => set({ recommendation: rec }),
      setDiner: (diner) => set({ diner, isGuest: false }),

      clearSession: () => set({
        tableNumber: '',
        dinerId: null,
        isGuest: true,
        selectedDish: null,
        recommendation: null,
      }),
    }),
    {
      name: 'epd-session',
      partialize: (s) => ({
        dinerId: s.dinerId,
        isGuest: s.isGuest,
        questionnaire: s.questionnaire,
        diner: s.diner,
      }),
    },
  ),
)

export default useDinerStore
