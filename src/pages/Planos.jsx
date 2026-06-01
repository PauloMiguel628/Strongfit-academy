import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useDynatrace } from '../hooks/useDynatrace';
import { useStore } from '../store/useStore';

const PLANOS = [
  { id: 'Basico', nome: 'Plano Básico', preco: 89.90, desc: 'Acesso livre a equipamentos.' },
  { id: 'Premium', nome: 'Plano Premium', preco: 129.90, desc: 'Equipamentos + Aulas coletivas.' },
  { id: 'Black', nome: 'Plano Black', preco: 199.90, desc: 'Tudo acima + Consultoria nutricional.' }
];

export default function Planos() {
  const navigate = useNavigate();
  const { sendAction } = useDynatrace();
  const { aluno: sessao } = useStore(); // Puxando a sessão atual
  const [modalSimulacao, setModalSimulacao] = useState(null);

  const handleSimular = (plano, meses) => {
    sendAction('simular_plano', { plano: plano.nome, duracaoMeses: meses });
    setModalSimulacao({ ...plano, meses, total: plano.preco * meses });
  };

  const handleContratar = (planoId) => {
    sendAction('contratar_click', { plano: planoId });

    // Verifica se o usuário está logado
    if (sessao) {
      // Busca os dados completos do aluno no localStorage
      const alunos = JSON.parse(localStorage.getItem('academia_alunos') || '[]');
      const dadosAluno = alunos.find(a => a.id === sessao.alunoId);

      if (dadosAluno && dadosAluno.plano === planoId) {
        // Cenário 1: Já tem o exato plano que clicou
        toast('Você já está matriculado neste plano!', { icon: '✅' });
      } else {
        // Cenário 2: Tem outro plano e clicou em um diferente
        toast('Acesse seu dashboard para realizar a troca de plano.', { icon: '🔄' });
        navigate('/aluno');
      }
    } else {
      // Cenário 3: Não está logado (fluxo normal de matrícula)
      navigate('/matricula', { state: { planoPreSelecionado: planoId } });
    }
  };

  return (
    <div className="py-12">
      <h2 className="text-4xl font-black mb-10 text-center text-sfNavy dark:text-sfCream uppercase tracking-tight">
        Escolha seu <span className="text-sfTeal dark:text-sfGreen">Plano</span>
      </h2>
      
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
        {PLANOS.map(plano => (
          <div key={plano.id} className="bg-white dark:bg-sfNavy border border-gray-100 dark:border-gray-800 rounded-2xl p-8 flex flex-col justify-between shadow-sm hover:shadow-xl transition-shadow">
            <div>
              <h3 className="text-2xl font-black uppercase text-sfNavy dark:text-white">{plano.nome}</h3>
              <div className="my-6">
                <span className="text-4xl font-black text-sfTeal dark:text-sfGreen tracking-tighter">
                  R$ {plano.preco.toFixed(2).replace('.', ',')}
                </span>
                <span className="text-gray-500 font-bold text-sm uppercase ml-1">/mês</span>
              </div>
              <p className="mb-8 text-gray-600 dark:text-gray-300 font-medium">{plano.desc}</p>
            </div>
            
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => handleSimular(plano, 12)} 
                className="bg-transparent border border-sfTeal text-sfTeal dark:border-sfGreen dark:text-sfGreen font-bold py-3 rounded-full hover:bg-sfTeal hover:text-white dark:hover:bg-sfGreen dark:hover:text-sfNavy transition"
              >
                Simular (12 meses)
              </button>
              <button 
                onClick={() => handleContratar(plano.id)} 
                className="bg-sfTeal text-sfCream font-black uppercase tracking-wide py-3 rounded-full hover:bg-sfNavy transition shadow-md"
              >
                {sessao ? 'Contratar' : 'Matricule-se'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Simulação */}
      {modalSimulacao && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-sfBlack p-8 rounded-2xl max-w-sm w-full border border-gray-100 dark:border-gray-800 shadow-2xl text-center">
            <h3 className="text-2xl font-black uppercase mb-4 text-sfNavy dark:text-white">Simulação</h3>
            <p className="text-sfTeal dark:text-sfGreen font-bold text-xl mb-2">{modalSimulacao.nome}</p>
            <p className="text-gray-500 mb-6 font-medium">Duração do contrato: {modalSimulacao.meses} meses</p>
            
            <div className="bg-gray-50 dark:bg-sfNavy py-6 rounded-xl mb-6">
              <p className="text-sm font-bold uppercase text-gray-400 mb-1">Investimento Total</p>
              <p className="text-4xl font-black text-sfNavy dark:text-white">
                R$ {modalSimulacao.total.toFixed(2).replace('.', ',')}
              </p>
            </div>
            
            <button 
              onClick={() => setModalSimulacao(null)} 
              className="w-full bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300 py-3 rounded-full font-bold uppercase text-sm hover:bg-gray-300 dark:hover:bg-gray-700 transition"
            >
              Fechar Simulação
            </button>
          </div>
        </div>
      )}
    </div>
  );
}