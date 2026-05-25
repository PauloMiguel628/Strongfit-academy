import { create } from 'zustand';

// Pre-populando para testes
const mockAlunos = [
  { id: '1', nome: 'João Silva', email: 'joao@teste.com', cpf: '00000000000', plano: 'Premium' }
];
if (!localStorage.getItem('academia_alunos')) {
  localStorage.setItem('academia_alunos', JSON.stringify(mockAlunos));
}

export const useStore = create((set) => ({
  darkMode: false,
  toggleDarkMode: () => set((state) => {
    const isDark = !state.darkMode;
    document.documentElement.classList.toggle('dark', isDark);
    return { darkMode: isDark };
  }),
  aluno: JSON.parse(localStorage.getItem('academia_sessoes')) || null,
  login: (alunoId) => {
    const sessionData = { alunoId, timestamp: Date.now() };
    localStorage.setItem('academia_sessoes', JSON.stringify(sessionData));
    set({ aluno: sessionData });
  },
  logout: () => {
    localStorage.removeItem('academia_sessoes');
    set({ aluno: null });
  }
}));