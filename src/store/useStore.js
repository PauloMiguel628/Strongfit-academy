import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStore = create(
  persist(
    (set) => ({
      // --- Estado de Autenticação ---
      aluno: null,
      login: (dados) => set({ aluno: dados }),
      logout: () => set({ aluno: null }),

      // --- Estado do Dark Mode ---
      darkMode: false,
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
    }),
    {
      name: 'strongfit-sessao',
      // Agora guarda tanto o login do aluno quanto o tema escolhido
      partialize: (state) => ({ aluno: state.aluno, darkMode: state.darkMode }), 
    }
  )
);