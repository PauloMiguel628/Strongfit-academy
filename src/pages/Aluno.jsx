import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Dumbbell, Star, Crown, CheckCircle, Calendar, Plus, Trash2, ShieldCheck, XCircle } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useDynatrace } from '../hooks/useDynatrace';
import { LISTA_AULAS } from '../data/aulas';

const BENEFICIOS_PLANO = {
  Basico: [
    'Acesso livre a toda área de musculação',
    'Uso de vestiários e armários rotativos',
    'Wi-Fi liberado nas dependências',
    'Direito a se inscrever em até 2 aulas'
  ],
  Premium: [
    'Acesso livre a toda área de musculação',
    'Direito a se inscrever em até 5 aulas',
    'Uso das cadeiras de massagem relaxante',
    'Wi-Fi liberado nas dependências'
  ],
  Black: [
    'Acesso a TODAS as unidades da rede StrongFit',
    'Consultoria nutricional a cada 3 meses',
    'Pode trazer 1 amigo para treinar 4x no mês',
    'Acesso ILIMITADO a todas as aulas coletivas',
    'Uso das cadeiras de massagem relaxante'
  ]
};

export default function Aluno() {
  const navigate = useNavigate();
  const { sendAction, reportError } = useDynatrace();
  const { aluno: sessao, logout } = useStore();
  
  const [dadosAluno, setDadosAluno] = useState(null);
  const [modalPlano, setModalPlano] = useState(false);
  const [modalTreino, setModalTreino] = useState(false);
  
  const [meuTreino, setMeuTreino] = useState([]);
  const [novoExercicio, setNovoExercicio] = useState({ nome: '', series: '', repeticoes: '' });
  
  const [minhasInscricoes, setMinhasInscricoes] = useState([]);

  // ==============================================================
  // CORREÇÃO: Redirecionamentos de segurança agora vão para /login
  // ==============================================================
  useEffect(() => {
    if (!sessao) {
      navigate('/login'); 
      return;
    }
    const alunos = JSON.parse(localStorage.getItem('academia_alunos') || '[]');
    // Forçando conversão para String para evitar falsos negativos na comparação
    const encontrado = alunos.find(a => String(a.id) === String(sessao.alunoId));
    
    if (!encontrado) {
      logout();
      navigate('/login'); 
    } else {
      setDadosAluno(encontrado);
      sendAction('aluno_dashboard_acesso', { plano: encontrado.plano });
      
      const treinoSalvo = JSON.parse(localStorage.getItem(`academia_treino_${encontrado.id}`) || '[]');
      setMeuTreino(treinoSalvo);

      const inscricoesSalvas = JSON.parse(localStorage.getItem(`academia_inscricoes_${encontrado.id}`) || '[]');
      setMinhasInscricoes(inscricoesSalvas);
    }
  }, [sessao, navigate, logout, sendAction]);

  useEffect(() => {
    let timeout;
    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        try {
          throw new Error("Sessão expirada por inatividade");
        } catch (error) {
          reportError('sessao_expirada', error);
          toast.error("Sessão expirada. Faça login novamente.");
          logout();
          navigate('/login'); // Também atualizado aqui
        }
      }, 5 * 60 * 1000);
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

  const handleCheckin = () => {
    sendAction('aluno_checkin_realizado', { plano: dadosAluno.plano });
    toast.success('Check-in realizado com sucesso! Bom treino!');
  };

  const handleTrocarPlano = (novoPlano) => {
    try {
      if (novoPlano === dadosAluno.plano) {
        throw new Error("Você já possui este plano.");
      }
      sendAction('trocar_plano', { planoAntigo: dadosAluno.plano, novoPlano });
      
      const alunos = JSON.parse(localStorage.getItem('academia_alunos'));
      const index = alunos.findIndex(a => a.id === dadosAluno.id);
      alunos[index].plano = novoPlano;
      localStorage.setItem('academia_alunos', JSON.stringify(alunos));
      
      setDadosAluno(alunos[index]);
      setModalPlano(false);
      toast.success(`Parabéns! Seu plano agora é o ${novoPlano}!`);
    } catch (error) {
      reportError('erro_troca_plano', error, { planoTentado: novoPlano });
      toast.error(error.message);
    }
  };

  const adicionarExercicio = (e) => {
    e.preventDefault();
    if (!novoExercicio.nome || !novoExercicio.series || !novoExercicio.repeticoes) {
      toast.error("Preencha todos os campos do exercício.");
      return;
    }
    const treinoAtualizado = [...meuTreino, { ...novoExercicio, id: Date.now() }];
    setMeuTreino(treinoAtualizado);
    localStorage.setItem(`academia_treino_${dadosAluno.id}`, JSON.stringify(treinoAtualizado));
    sendAction('treino_exercicio_adicionado', { exercicio: novoExercicio.nome });
    setNovoExercicio({ nome: '', series: '', repeticoes: '' });
    toast.success("Exercício adicionado!");
  };

  const removerExercicio = (idParaRemover) => {
    const treinoAtualizado = meuTreino.filter(ex => ex.id !== idParaRemover);
    setMeuTreino(treinoAtualizado);
    localStorage.setItem(`academia_treino_${dadosAluno.id}`, JSON.stringify(treinoAtualizado));
    sendAction('treino_exercicio_removido');
  };

  const cancelarInscricao = (aulaId, aulaNome) => {
    const novasInscricoes = minhasInscricoes.filter(id => id !== aulaId);
    setMinhasInscricoes(novasInscricoes);
    localStorage.setItem(`academia_inscricoes_${dadosAluno.id}`, JSON.stringify(novasInscricoes));
    toast.success(`Inscrição na aula de ${aulaNome} cancelada.`);
    sendAction('aula_inscricao_cancelada', { aula: aulaNome });
  };

  if (!dadosAluno) return null;

  const PlanoIcon = dadosAluno.plano === 'Black' ? Crown : dadosAluno.plano === 'Premium' ? Star : ShieldCheck;
  const aulasMapeadas = LISTA_AULAS.filter(aula => minhasInscricoes.includes(aula.id));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pb-20">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h2 className="text-4xl font-black text-sfNavy dark:text-sfCream tracking-tight">
            Olá, <span className="text-sfTeal dark:text-sfGreen">{dadosAluno.nome.split(' ')[0]}</span>!
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Pronto para superar seus limites hoje?</p>
        </div>
        <button 
          onClick={handleCheckin}
          className="bg-sfTeal text-sfCream px-8 py-3 rounded-full font-bold uppercase tracking-wide hover:bg-sfNavy transition flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          <CheckCircle size={20} />
          Fazer Check-in
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        
        {/* Coluna do Plano */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white dark:bg-sfNavy border border-gray-100 dark:border-gray-800 rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <PlanoIcon className="text-sfTeal dark:text-sfGreen" size={32} />
              <h3 className="text-2xl font-black text-sfNavy dark:text-white uppercase">
                Plano {dadosAluno.plano}
              </h3>
            </div>
            
            <div className="space-y-4 mb-8">
              <p className="text-sm text-gray-500 dark:text-gray-400 font-bold uppercase">Meus Benefícios</p>
              <ul className="space-y-3">
                {BENEFICIOS_PLANO[dadosAluno.plano].map((beneficio, index) => (
                  <li key={index} className="flex items-start gap-2 text-sfNavy dark:text-gray-300">
                    <CheckCircle className="text-sfTeal dark:text-sfGreen flex-shrink-0 mt-1" size={16} />
                    <span className="text-sm font-medium leading-tight">{beneficio}</span>
                  </li>
                ))}
              </ul>
            </div>

            {dadosAluno.plano !== 'Black' && (
              <button 
                onClick={() => setModalPlano(true)} 
                className="w-full bg-sfNavy dark:bg-black text-white border border-transparent dark:border-gray-700 py-3 rounded-full font-bold uppercase text-sm hover:bg-sfTeal transition"
              >
                Fazer Upgrade de Plano
              </button>
            )}
          </div>
        </div>

        {/* Coluna do Treino */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-sfNavy border border-gray-100 dark:border-gray-800 rounded-2xl p-8 shadow-sm h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <Dumbbell className="text-sfTeal dark:text-sfGreen" size={32} />
                <h3 className="text-2xl font-black text-sfNavy dark:text-white uppercase">
                  Meu Treino
                </h3>
              </div>
              <button 
                onClick={() => {
                  sendAction('abrir_montador_treino');
                  setModalTreino(true);
                }}
                className="text-sfTeal dark:text-sfGreen font-bold flex items-center gap-1 hover:underline"
              >
                <Plus size={20} /> Montar Treino
              </button>
            </div>

            {meuTreino.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 border-gray-100 dark:border-gray-800">
                      <th className="py-4 font-bold text-gray-500 dark:text-gray-400 uppercase text-sm">Exercício</th>
                      <th className="py-4 font-bold text-gray-500 dark:text-gray-400 uppercase text-sm">Séries</th>
                      <th className="py-4 font-bold text-gray-500 dark:text-gray-400 uppercase text-sm">Repetições</th>
                      <th className="py-4 text-right"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {meuTreino.map((ex) => (
                      <tr key={ex.id} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition">
                        <td className="py-4 font-bold text-sfNavy dark:text-white">{ex.nome}</td>
                        <td className="py-4 text-gray-600 dark:text-gray-300">{ex.series}</td>
                        <td className="py-4 text-gray-600 dark:text-gray-300">{ex.repeticoes}</td>
                        <td className="py-4 text-right">
                          <button onClick={() => removerExercicio(ex.id)} className="text-red-400 hover:text-red-600 transition p-2">
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center flex-grow py-12 text-center">
                <Calendar className="text-gray-300 dark:text-gray-700 mb-4" size={64} />
                <p className="text-xl font-bold text-gray-500 dark:text-gray-400 mb-2">Seu treino está vazio!</p>
                <p className="text-gray-400 dark:text-gray-500 mb-6 max-w-sm">Crie sua ficha de musculação personalizada para acompanhar seus resultados na academia.</p>
                <button 
                  onClick={() => setModalTreino(true)}
                  className="bg-sfCream text-sfNavy px-6 py-2 rounded-full font-bold uppercase text-sm hover:bg-sfGreen transition border border-sfTeal"
                >
                  Adicionar Primeiro Exercício
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Seção Minhas Aulas Inscritas */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="text-sfTeal dark:text-sfGreen" size={32} />
          <h3 className="text-2xl font-black text-sfNavy dark:text-white uppercase">Minhas Aulas</h3>
        </div>
        
        {aulasMapeadas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {aulasMapeadas.map(aula => (
              <div key={aula.id} className="bg-white dark:bg-sfNavy border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm flex flex-col h-full">
                <div className="h-32 overflow-hidden relative">
                  <img src={aula.imagem} alt={aula.nome} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                  <h4 className="absolute bottom-3 left-4 text-xl font-black text-white tracking-tight">{aula.nome}</h4>
                </div>
                <div className="p-5 flex flex-col justify-between flex-grow">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Duração: {aula.duracao} | Nível: {aula.dificuldade}</p>
                  <button 
                    onClick={() => cancelarInscricao(aula.id, aula.nome)}
                    className="flex items-center justify-center gap-2 w-full border border-red-200 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 py-2 rounded-lg font-bold text-sm transition mt-auto"
                  >
                    <XCircle size={16} />
                    Cancelar Inscrição
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-sfNavy border border-gray-100 dark:border-gray-800 rounded-2xl p-8 text-center shadow-sm">
            <p className="text-gray-500 dark:text-gray-400 mb-4 font-medium">Você ainda não está inscrito em nenhuma aula.</p>
            <Link to="/aulas" className="inline-block bg-sfTeal text-sfCream px-6 py-2 rounded-full font-bold uppercase text-sm hover:bg-sfNavy transition">
              Explorar Grade de Aulas
            </Link>
          </div>
        )}
      </div>

      {/* Modais */}
      {modalTreino && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-sfBlack p-8 rounded-2xl w-full max-w-md border border-gray-100 dark:border-gray-800 shadow-2xl">
            <h3 className="text-2xl font-black text-sfNavy dark:text-white uppercase mb-6">Adicionar Exercício</h3>
            <form onSubmit={adicionarExercicio} className="flex flex-col gap-4 mb-6">
              <div>
                <label className="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase">Nome do Exercício</label>
                <input type="text" placeholder="Ex: Supino Reto" value={novoExercicio.nome} onChange={(e) => setNovoExercicio({...novoExercicio, nome: e.target.value})} className="w-full mt-1 p-3 bg-gray-50 dark:bg-sfNavy border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:border-sfTeal text-sfNavy dark:text-white" />
              </div>
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase">Séries</label>
                  <input type="text" placeholder="Ex: 4" value={novoExercicio.series} onChange={(e) => setNovoExercicio({...novoExercicio, series: e.target.value})} className="w-full mt-1 p-3 bg-gray-50 dark:bg-sfNavy border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:border-sfTeal text-sfNavy dark:text-white" />
                </div>
                <div className="w-1/2">
                  <label className="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase">Repetições</label>
                  <input type="text" placeholder="Ex: 10 a 12" value={novoExercicio.repeticoes} onChange={(e) => setNovoExercicio({...novoExercicio, repeticoes: e.target.value})} className="w-full mt-1 p-3 bg-gray-50 dark:bg-sfNavy border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:border-sfTeal text-sfNavy dark:text-white" />
                </div>
              </div>
              <button type="submit" className="w-full bg-sfTeal text-sfCream py-4 rounded-xl font-black uppercase tracking-wide hover:bg-sfNavy transition mt-2">Salvar Exercício</button>
            </form>
            <button onClick={() => setModalTreino(false)} className="w-full text-gray-500 hover:text-gray-800 dark:hover:text-white font-bold uppercase text-sm">Fechar</button>
          </div>
        </div>
      )}

      {modalPlano && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-sfBlack p-8 rounded-2xl w-full max-w-md border border-gray-100 dark:border-gray-800 shadow-2xl">
            <h3 className="text-2xl font-black text-sfNavy dark:text-white uppercase mb-2">Evolua seu Plano</h3>
            <p className="text-gray-500 mb-6">Desbloqueie novos benefícios exclusivos.</p>
            <div className="flex flex-col gap-3 mb-6">
              {['Basico', 'Premium', 'Black'].map(p => (
                <button key={p} onClick={() => handleTrocarPlano(p)} disabled={dadosAluno.plano === p} className={`p-4 border-2 rounded-xl text-left transition font-bold flex justify-between items-center ${dadosAluno.plano === p ? 'border-gray-200 text-gray-400 cursor-not-allowed dark:border-gray-800' : 'border-sfTeal text-sfNavy dark:text-white hover:bg-sfTeal hover:text-white'}`}>
                  Mudar para {p}
                  {dadosAluno.plano === p && <span className="text-xs uppercase bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">Atual</span>}
                </button>
              ))}
            </div>
            <button onClick={() => setModalPlano(false)} className="w-full text-gray-500 hover:text-gray-800 dark:hover:text-white font-bold uppercase text-sm">Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}