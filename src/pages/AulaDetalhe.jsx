import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, BarChart, Activity } from 'lucide-react';
import toast from 'react-hot-toast';
import { LISTA_AULAS } from '../data/aulas';
import { useDynatrace } from '../hooks/useDynatrace';
import { useStore } from '../store/useStore';

export default function AulaDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { sendAction, reportError } = useDynatrace();
  const { aluno: sessao } = useStore();
  
  const aula = LISTA_AULAS.find(a => a.id === id);

  // Buscar dados do aluno se estiver logado
  const alunos = JSON.parse(localStorage.getItem('academia_alunos') || '[]');
  const dadosAluno = sessao ? alunos.find(a => a.id === sessao.alunoId) : null;

  // Gerenciar inscrições da aula
  const inscricoesKey = sessao ? `academia_inscricoes_${sessao.alunoId}` : null;
  const [inscricoes, setInscricoes] = useState(() => {
    if (!inscricoesKey) return [];
    return JSON.parse(localStorage.getItem(inscricoesKey) || '[]');
  });

  const isInscrito = inscricoes.includes(aula?.id);

  useEffect(() => {
    if (aula) {
      sendAction('aula_detalhe_acesso', { aulaNome: aula.nome });
    }
  }, [aula, sendAction]);

  if (!aula) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-3xl font-bold mb-4">Aula não encontrada</h2>
        <button onClick={() => navigate('/aulas')} className="text-sfTeal underline">Voltar para a lista de aulas</button>
      </div>
    );
  }

  // Ação: Botão Começar a treinar agora
  const handleTreinarAgora = () => {
    if (sessao) {
      navigate('/aluno');
    } else {
      navigate('/unidades');
    }
  };

  // Ação: Botão Inscrever-se
  const handleInscrever = () => {
    if (!sessao) {
      navigate('/unidades');
      return;
    }

    if (isInscrito) {
      toast.error('Você já está inscrito nesta aula!');
      return;
    }

    // Regras de Negócio de Limites do Plano
    const plano = dadosAluno.plano;
    let limite = 0;
    
    if (plano === 'Basico') limite = 2;
    else if (plano === 'Premium') limite = 5;
    else if (plano === 'Black') limite = 999; // Sem limite

    if (inscricoes.length >= limite) {
      const msgErro = `Seu plano ${plano} permite no máximo ${limite} aula(s). Faça um upgrade na área do aluno!`;
      toast.error(msgErro);
      reportError('limite_aulas_atingido', new Error('Limite de aulas atingido'), { plano, limite });
      sendAction('erro_limite_inscricao_aula', { plano });
      return;
    }

    // Efetivar Inscrição
    const novasInscricoes = [...inscricoes, aula.id];
    setInscricoes(novasInscricoes);
    localStorage.setItem(inscricoesKey, JSON.stringify(novasInscricoes));
    
    toast.success(`Parabéns! Você está inscrito na aula de ${aula.nome}.`);
    sendAction('aula_inscricao_realizada', { aula: aula.nome, plano });
  };

  return (
    <div className="-m-4 md:-m-8">
      
      {/* Hero Dinâmico da Aula */}
      <section className="relative h-[60vh] w-full flex items-center justify-center bg-sfBlack overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
          style={{ backgroundImage: `url(${aula.imagem})` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-sfBlack via-transparent to-transparent"></div>

        <div className="relative z-10 text-center max-w-4xl px-4">
          <p className="text-sfTeal font-bold text-2xl md:text-3xl mb-2">Aula de</p>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white uppercase">
            {aula.nome}
          </h1>
        </div>
      </section>

      {/* Barra Flutuante de Atributos */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 -mt-10 mb-16">
        <div className="bg-white dark:bg-sfNavy rounded-full shadow-2xl py-5 px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-0 border border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <Clock className="text-sfTeal dark:text-sfGreen" size={32} />
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold">Duração</p>
              <p className="font-black text-sfNavy dark:text-white">{aula.duracao}</p>
            </div>
          </div>

          <div className="hidden md:block w-px h-10 bg-gray-200 dark:bg-gray-700"></div>

          <div className="flex items-center gap-3">
            <Activity className="text-sfTeal dark:text-sfGreen" size={32} />
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold">Intensidade</p>
              <p className="font-black text-sfNavy dark:text-white">{aula.intensidade}</p>
            </div>
          </div>

          <div className="hidden md:block w-px h-10 bg-gray-200 dark:bg-gray-700"></div>

          <div className="flex items-center gap-3">
            <BarChart className="text-sfTeal dark:text-sfGreen" size={32} />
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold">Dificuldade</p>
              <p className="font-black text-sfNavy dark:text-white">{aula.dificuldade}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Seção de Descrição e Conversão */}
      <section className="max-w-7xl mx-auto px-4 md:px-12 pb-20">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          
          <div className="md:w-1/2">
            <h2 className="text-3xl md:text-4xl font-black text-sfNavy dark:text-sfCream mb-6">
              Sobre a aula de {aula.nome}
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
              {aula.descricao}
            </p>
            
            {/* Botões Dinâmicos */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={handleTreinarAgora} 
                className="bg-sfTeal text-sfCream px-6 py-4 rounded-full font-black uppercase hover:bg-sfNavy transition shadow-lg text-center"
              >
                {sessao ? 'Ir para meu Dashboard' : 'Começar a treinar agora'}
              </button>
              
              <button 
                onClick={handleInscrever} 
                disabled={isInscrito}
                className={`px-6 py-4 rounded-full font-black uppercase transition shadow-lg text-center ${
                  isInscrito 
                    ? 'bg-gray-300 text-gray-500 dark:bg-gray-800 dark:text-gray-400 cursor-not-allowed' 
                    : 'bg-sfNavy text-sfCream hover:bg-sfTeal border border-sfNavy'
                }`}
              >
                {isInscrito ? '✓ Inscrito nesta aula' : 'Inscrever-se na Aula'}
              </button>
            </div>
          </div>

          <div className="md:w-1/2 rounded-2xl overflow-hidden shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1470&auto=format&fit=crop" 
              alt="Estrutura da Academia" 
              className="w-full h-full object-cover"
            />
          </div>

        </div>
      </section>

    </div>
  );
}