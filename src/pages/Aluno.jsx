import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useStore } from '../store/useStore';
import { useDynatrace } from '../hooks/useDynatrace';

export default function Aluno() {
  const navigate = useNavigate();
  const { sendAction, reportError } = useDynatrace();
  const { aluno: sessao, logout } = useStore();
  const [dadosAluno, setDadosAluno] = useState(null);
  const [modalTreino, setModalTreino] = useState(false);
  const [modalPlano, setModalPlano] = useState(false);

  useEffect(() => {
    if (!sessao) {
      navigate('/matricula');
      return;
    }
    const alunos = JSON.parse(localStorage.getItem('academia_alunos') || '[]');
    const encontrado = alunos.find(a => a.id === sessao.alunoId);
    if (!encontrado) {
      logout();
      navigate('/matricula');
    } else {
      setDadosAluno(encontrado);
    }
  }, [sessao, navigate, logout]);

  // Simulação de sessão expirada
  useEffect(() => {
    let timeout;
    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        try {
          throw new Error("Sessão expirada por inatividade");
        } catch (error) {
          reportError('Sessão expirada', error);
          toast.error("Sessão expirada. Faça login novamente.");
          logout();
          navigate('/');
        }
      }, 5 * 60 * 1000); // 5 minutos
    };

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('click', resetTimer);
    window.addEventListener('keydown', resetTimer);
    resetTimer();

    return () => {
      clearTimeout(timeout);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('click', resetTimer);
      window.removeEventListener('keydown', resetTimer);
    };
  }, [reportError, logout, navigate]);

  const handleVerTreino = () => {
    sendAction('ver_treino', { planoAtual: dadosAluno.plano });
    setModalTreino(true);
  };

  const handleTrocarPlano = (novoPlano) => {
    try {
      if (novoPlano === dadosAluno.plano) {
        throw new Error("Plano já atual");
      }
      sendAction('trocar_plano', { planoAntigo: dadosAluno.plano, novoPlano });
      
      const alunos = JSON.parse(localStorage.getItem('academia_alunos'));
      const index = alunos.findIndex(a => a.id === dadosAluno.id);
      alunos[index].plano = novoPlano;
      localStorage.setItem('academia_alunos', JSON.stringify(alunos));
      setDadosAluno(alunos[index]);
      setModalPlano(false);
      toast.success('Plano atualizado com sucesso!');
      
    } catch (error) {
      reportError('Erro ao trocar plano', error, { planoTentado: novoPlano });
      toast.error(error.message);
    }
  };

  if (!dadosAluno) return null;

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Olá, {dadosAluno.nome.split(' ')[0]}!</h2>
      
      <div className="bg-white dark:bg-sfNavy p-6 rounded-lg shadow-md mb-6">
        <p><strong>Plano atual:</strong> {dadosAluno.plano}</p>
        <p><strong>E-mail:</strong> {dadosAluno.email}</p>
      </div>

      <div className="flex gap-4">
        <button onClick={handleVerTreino} className="flex-1 bg-sfTeal text-sfCream py-3 rounded font-bold">Ver Treino</button>
        <button onClick={() => setModalPlano(true)} className="flex-1 bg-sfGreen text-sfNavy py-3 rounded font-bold">Trocar Plano</button>
      </div>

      {/* Modal de Treino */}
      {modalTreino && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-sfCream dark:bg-sfBlack p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Seu Treino de Hoje (Peito/Tríceps)</h3>
            <ul className="list-disc pl-5 mb-6">
              <li>Supino Reto - 4x10</li>
              <li>Crucifixo Inclinado - 3x12</li>
              <li>Tríceps Testa - 3x15</li>
              <li>Tríceps Pulley - 4x12</li>
            </ul>
            <button onClick={() => setModalTreino(false)} className="w-full bg-sfNavy text-sfCream py-2 rounded">Fechar</button>
          </div>
        </div>
      )}

      {/* Modal Troca de Plano */}
      {modalPlano && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-sfCream dark:bg-sfBlack p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Evolua seu Plano</h3>
            <div className="flex flex-col gap-2 mb-6">
              {['Basico', 'Premium', 'Black'].map(p => (
                <button key={p} onClick={() => handleTrocarPlano(p)} className="p-3 border border-sfTeal rounded text-left hover:bg-sfTeal hover:text-white transition">
                  Mudar para {p}
                </button>
              ))}
            </div>
            <button onClick={() => setModalPlano(false)} className="w-full bg-red-500 text-white py-2 rounded">Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}